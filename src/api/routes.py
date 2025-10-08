"""
Módulo de rutas de la API
Gestiona todos los endpoints REST para usuarios y pedidos
"""
from flask import request, jsonify, Blueprint
from api.models import db, User, Order
from flask_cors import CORS
from datetime import datetime
import re

api = Blueprint('api', __name__)
CORS(api)

# ============== UTILIDADES ==============


def validate_email(email):
    """Valida el formato de un email usando expresión regular"""
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email) is not None


def validate_pagination_params(page, per_page):
    """
    Valida los parámetros de paginación
    Returns: (is_valid, error_message, status_code)
    """
    if page < 1:
        return False, "Page must be greater than 0", 400
    if per_page < 1 or per_page > 100:
        return False, "Per page must be between 1 and 100", 400
    return True, None, None


# ============== ENDPOINTS DE PRUEBA ==============

@api.route('/hello', methods=['GET'])
def handle_hello():
    """Endpoint de prueba para verificar que el backend está funcionando"""
    return jsonify({"message": "Backend is running"}), 200


# ============== ENDPOINTS DE USUARIOS ==============

@api.route('/users', methods=['POST'])
def create_user():
    """Crea un nuevo usuario en la base de datos"""
    try:
        body = request.get_json()

        if not body:
            return jsonify({"error": "Request body is required"}), 400

        # Validar campos requeridos
        name = body.get("name", "").strip()
        email = body.get("email", "").strip().lower()

        if not name:
            return jsonify({"error": "Name is required"}), 400
        if not email:
            return jsonify({"error": "Email is required"}), 400

        # Validar formato de email
        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        # Verificar que el email no exista
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already exists"}), 400

        # Crear y guardar el nuevo usuario
        new_user = User(name=name, email=email)
        db.session.add(new_user)
        db.session.commit()

        return jsonify(new_user.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/users', methods=['GET'])
def get_users():
    """Obtiene todos los usuarios con paginación y búsqueda opcional"""
    try:
        # Obtener parámetros de query
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '', type=str).strip()

        # Validar parámetros de paginación
        is_valid, error_msg, status_code = validate_pagination_params(
            page, per_page)
        if not is_valid:
            return jsonify({"error": error_msg}), status_code

        # Construir query base
        query = User.query

        # Aplicar filtro de búsqueda si existe
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                db.or_(
                    User.name.ilike(search_pattern),
                    User.email.ilike(search_pattern)
                )
            )

        # Paginar resultados
        users_pagination = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        return jsonify({
            "users": [user.serialize() for user in users_pagination.items],
            "total": users_pagination.total,
            "page": page,
            "per_page": per_page,
            "total_pages": users_pagination.pages,
            "search": search if search else None
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/users/<int:user_id>/orders', methods=['GET'])
def get_user_orders(user_id):
    """Obtiene todos los pedidos de un usuario específico"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        orders = Order.query.filter_by(user_id=user_id).all()

        return jsonify({
            "user": user.serialize(),
            "orders": [order.serialize() for order in orders],
            "total_orders": len(orders)
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/users/export', methods=['GET'])
def export_users():
    """Exporta todos los usuarios a formato JSON"""
    try:
        users = User.query.all()

        return jsonify({
            "success": True,
            "total": len(users),
            "users": [user.serialize() for user in users],
            "exported_at": datetime.now().isoformat()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/users/batch', methods=['POST'])
def batch_create_users():
    """Crea múltiples usuarios en lote desde un array JSON"""
    try:
        body = request.get_json()

        # Validar estructura del request
        if not body:
            return jsonify({"error": "Request body is required"}), 400
        if "users" not in body or not isinstance(body["users"], list):
            return jsonify({"error": "users array is required"}), 400
        if len(body["users"]) == 0:
            return jsonify({"error": "users array cannot be empty"}), 400
        if len(body["users"]) > 1000:
            return jsonify({"error": "Maximum 1000 users per batch"}), 400

        created_users = []
        errors = []

        # Obtener emails existentes para validación eficiente
        existing_emails = set(
            email[0].lower() for email in db.session.query(User.email).all()
        )

        # Procesar cada usuario del lote
        for index, user_data in enumerate(body["users"]):
            try:
                # Validar campos requeridos
                name = str(user_data.get("name", "")).strip()
                email = str(user_data.get("email", "")).strip().lower()

                if not name:
                    errors.append(
                        {"index": index, "data": user_data, "error": "name is required"})
                    continue
                if not email:
                    errors.append(
                        {"index": index, "data": user_data, "error": "email is required"})
                    continue

                # Validar formato de email
                if not validate_email(email):
                    errors.append(
                        {"index": index, "data": user_data, "error": "Invalid email format"})
                    continue

                # Verificar duplicados en BD y en el lote actual
                if email in existing_emails:
                    errors.append({"index": index, "data": user_data,
                                  "error": f"Email {email} already exists"})
                    continue

                # Crear usuario
                new_user = User(name=name, email=email)
                db.session.add(new_user)
                created_users.append(new_user)
                existing_emails.add(email)

            except Exception as e:
                errors.append(
                    {"index": index, "data": user_data, "error": str(e)})

        # Confirmar transacción si hay usuarios válidos
        if created_users:
            db.session.commit()

        response = {
            "success": True,
            "created": len(created_users),
            "failed": len(errors),
            "total_processed": len(body["users"]),
            "users": [user.serialize() for user in created_users]
        }

        if errors:
            response["errors"] = errors

        return jsonify(response), 201 if created_users else 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Actualiza la información de un usuario existente"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        body = request.get_json()
        if not body:
            return jsonify({"error": "Request body is required"}), 400

        # Actualizar nombre si se proporciona
        if "name" in body:
            name = body["name"].strip()
            if not name:
                return jsonify({"error": "Name cannot be empty"}), 400
            user.name = name

        # Actualizar email si se proporciona
        if "email" in body:
            email = body["email"].strip().lower()
            if not email:
                return jsonify({"error": "Email cannot be empty"}), 400
            if not validate_email(email):
                return jsonify({"error": "Invalid email format"}), 400

            # Verificar que el email no exista en otro usuario
            existing_user = User.query.filter(
                User.email == email,
                User.id != user_id
            ).first()
            if existing_user:
                return jsonify({"error": "Email already exists"}), 400

            user.email = email

        db.session.commit()
        return jsonify(user.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Elimina un usuario (solo si no tiene pedidos asociados)"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Verificar que no tenga pedidos
        order_count = Order.query.filter_by(user_id=user_id).count()
        if order_count > 0:
            return jsonify({
                "error": "Cannot delete user with existing orders",
                "order_count": order_count
            }), 400

        db.session.delete(user)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": f"User {user.name} deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ============== ENDPOINTS DE PEDIDOS ==============

@api.route('/orders', methods=['POST'])
def create_order():
    """Crea un nuevo pedido asociado a un usuario"""
    try:
        body = request.get_json()

        if not body:
            return jsonify({"error": "Request body is required"}), 400

        # Validar campos requeridos
        user_id = body.get("user_id")
        product_name = body.get("product_name", "").strip()
        amount = body.get("amount")

        if user_id is None:
            return jsonify({"error": "User ID is required"}), 400
        if not product_name:
            return jsonify({"error": "Product name is required"}), 400
        if amount is None:
            return jsonify({"error": "Amount is required"}), 400

        # Validar que amount sea numérico y mayor a 0
        try:
            amount = float(amount)
            if amount <= 0:
                return jsonify({"error": "Amount must be greater than 0"}), 400
        except (ValueError, TypeError):
            return jsonify({"error": "Amount must be a valid number"}), 400

        # Verificar que el usuario exista
        if not User.query.get(user_id):
            return jsonify({"error": "User not found"}), 404

        # Crear y guardar el pedido
        new_order = Order(
            user_id=user_id,
            product_name=product_name,
            amount=amount
        )
        db.session.add(new_order)
        db.session.commit()

        return jsonify(new_order.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/orders', methods=['GET'])
def get_orders():
    """Obtiene todos los pedidos con información del usuario, paginación y búsqueda"""
    try:
        # Obtener parámetros de query
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        user_id = request.args.get('user_id', type=int)
        search = request.args.get('search', '', type=str).strip()

        # Validar parámetros de paginación
        is_valid, error_msg, status_code = validate_pagination_params(
            page, per_page)
        if not is_valid:
            return jsonify({"error": error_msg}), status_code

        # Query con join para incluir información del usuario
        query = Order.query.join(User)

        # Aplicar filtros opcionales
        if user_id:
            query = query.filter(Order.user_id == user_id)
        if search:
            query = query.filter(Order.product_name.ilike(f"%{search}%"))

        # Ordenar y paginar
        orders_pagination = query.order_by(Order.created_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        return jsonify({
            "orders": [order.serialize() for order in orders_pagination.items],
            "total": orders_pagination.total,
            "page": page,
            "per_page": per_page,
            "total_pages": orders_pagination.pages,
            "search": search if search else None
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/orders/export', methods=['GET'])
def export_orders():
    """Exporta pedidos a formato JSON con filtros opcionales"""
    try:
        user_id = request.args.get('user_id', type=int)

        # Construir query con join
        query = Order.query.join(User)

        if user_id:
            query = query.filter(Order.user_id == user_id)

        orders = query.order_by(Order.created_at.desc()).all()

        return jsonify({
            "success": True,
            "total": len(orders),
            "orders": [order.serialize() for order in orders],
            "exported_at": datetime.now().isoformat(),
            "filters": {"user_id": user_id} if user_id else {}
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/orders/batch', methods=['POST'])
def batch_create_orders():
    """Crea múltiples pedidos en lote desde un array JSON"""
    try:
        body = request.get_json()

        # Validar estructura del request
        if not body:
            return jsonify({"error": "Request body is required"}), 400
        if "orders" not in body or not isinstance(body["orders"], list):
            return jsonify({"error": "orders array is required"}), 400
        if len(body["orders"]) == 0:
            return jsonify({"error": "orders array cannot be empty"}), 400
        if len(body["orders"]) > 1000:
            return jsonify({"error": "Maximum 1000 orders per batch"}), 400

        created_orders = []
        errors = []

        # Procesar cada pedido del lote
        for index, order_data in enumerate(body["orders"]):
            try:
                # Validar campos requeridos
                user_id = order_data.get("user_id")
                product_name = str(order_data.get("product_name", "")).strip()
                amount = order_data.get("amount")

                if user_id is None:
                    errors.append(
                        {"index": index, "error": "user_id is required"})
                    continue
                if not product_name:
                    errors.append(
                        {"index": index, "error": "product_name is required"})
                    continue
                if amount is None:
                    errors.append(
                        {"index": index, "error": "amount is required"})
                    continue

                # Validar amount
                try:
                    amount = float(amount)
                    if amount <= 0:
                        errors.append(
                            {"index": index, "error": "amount must be greater than 0"})
                        continue
                except (ValueError, TypeError):
                    errors.append(
                        {"index": index, "error": "amount must be a valid number"})
                    continue

                # Verificar que el usuario exista
                if not User.query.get(user_id):
                    errors.append(
                        {"index": index, "error": f"User with id {user_id} not found"})
                    continue

                # Crear pedido
                new_order = Order(
                    user_id=user_id,
                    product_name=product_name,
                    amount=amount
                )
                db.session.add(new_order)
                created_orders.append(new_order)

            except Exception as e:
                errors.append({"index": index, "error": str(e)})

        # Confirmar transacción si hay pedidos válidos
        if created_orders:
            db.session.commit()

        response = {
            "success": True,
            "created": len(created_orders),
            "failed": len(errors),
            "total_processed": len(body["orders"]),
            "orders": [order.serialize() for order in created_orders]
        }

        if errors:
            response["errors"] = errors

        return jsonify(response), 201 if created_orders else 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/orders/<int:order_id>', methods=['PATCH'])
def update_order_status(order_id):
    """Actualiza el estado de un pedido (pending, completed, cancelled)"""
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({"error": "Order not found"}), 404

        body = request.get_json()
        if not body:
            return jsonify({"error": "Request body is required"}), 400
        if "status" not in body:
            return jsonify({"error": "Status is required"}), 400

        # Validar que el estado sea válido
        valid_statuses = ["pending", "completed", "cancelled"]
        new_status = body["status"].lower()

        if new_status not in valid_statuses:
            return jsonify({
                "error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            }), 400

        order.status = new_status
        db.session.commit()

        return jsonify(order.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
