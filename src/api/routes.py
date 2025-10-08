"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Order
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
import re

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


def validate_email(email):
    """Validate email format"""
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email) is not None


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Backend is running"
    }
    return jsonify(response_body), 200


# ============== USER ENDPOINTS ==============

@api.route('/users', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        body = request.get_json()

        # Validate required fields
        if not body:
            return jsonify({"error": "Request body is required"}), 400

        if "name" not in body or not body["name"].strip():
            return jsonify({"error": "Name is required"}), 400

        if "email" not in body or not body["email"].strip():
            return jsonify({"error": "Email is required"}), 400

        # Validate email format
        if not validate_email(body["email"]):
            return jsonify({"error": "Invalid email format"}), 400

        # Check if email already exists
        existing_user = User.query.filter_by(email=body["email"]).first()
        if existing_user:
            return jsonify({"error": "Email already exists"}), 400

        # Create new user
        new_user = User(
            name=body["name"].strip(),
            email=body["email"].strip().lower()
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify(new_user.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/users', methods=['GET'])
def get_users():
    """Get all users with optional pagination"""
    try:
        # Optional pagination
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        # Validate pagination parameters
        if page < 1:
            return jsonify({"error": "Page must be greater than 0"}), 400
        if per_page < 1 or per_page > 100:
            return jsonify({"error": "Per page must be between 1 and 100"}), 400

        # Query with pagination
        users_pagination = User.query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        users = [user.serialize() for user in users_pagination.items]

        return jsonify({
            "users": users,
            "total": users_pagination.total,
            "page": page,
            "per_page": per_page,
            "total_pages": users_pagination.pages
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/users/<int:user_id>/orders', methods=['GET'])
def get_user_orders(user_id):
    """Get all orders for a specific user"""
    try:
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Get user's orders
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
    """Export all users to JSON"""
    try:
        # Get all users without pagination
        users = User.query.all()

        # Serialize all users
        users_data = [user.serialize() for user in users]

        return jsonify({
            "success": True,
            "total": len(users_data),
            "users": users_data,
            "exported_at": datetime.now().isoformat()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/users/batch', methods=['POST'])
def batch_create_users():
    """Create multiple users from JSON in batch"""
    try:
        body = request.get_json()

        # Validate request body
        if not body:
            return jsonify({"error": "Request body is required"}), 400

        if "users" not in body or not isinstance(body["users"], list):
            return jsonify({"error": "users array is required"}), 400

        if len(body["users"]) == 0:
            return jsonify({"error": "users array cannot be empty"}), 400

        # Limit batch size to prevent overload
        if len(body["users"]) > 1000:
            return jsonify({"error": "Maximum 1000 users per batch"}), 400

        created_users = []
        errors = []

        # Get all existing emails for duplicate check
        existing_emails = set(
            email[0].lower() for email in db.session.query(User.email).all()
        )

        # Process each user
        for index, user_data in enumerate(body["users"]):
            try:
                # Validate required fields
                if "name" not in user_data or not str(user_data["name"]).strip():
                    errors.append({
                        "index": index,
                        "data": user_data,
                        "error": "name is required"
                    })
                    continue

                if "email" not in user_data or not str(user_data["email"]).strip():
                    errors.append({
                        "index": index,
                        "data": user_data,
                        "error": "email is required"
                    })
                    continue

                email = str(user_data["email"]).strip().lower()

                # Validate email format
                if not validate_email(email):
                    errors.append({
                        "index": index,
                        "data": user_data,
                        "error": "Invalid email format"
                    })
                    continue

                # Check for duplicate email in database
                if email in existing_emails:
                    errors.append({
                        "index": index,
                        "data": user_data,
                        "error": f"Email {email} already exists"
                    })
                    continue

                # Check for duplicate email in current batch
                if email in [u.email for u in created_users]:
                    errors.append({
                        "index": index,
                        "data": user_data,
                        "error": f"Duplicate email {email} in batch"
                    })
                    continue

                # Create new user
                new_user = User(
                    name=str(user_data["name"]).strip(),
                    email=email
                )

                db.session.add(new_user)
                created_users.append(new_user)
                # Add to set to prevent duplicates in same batch
                existing_emails.add(email)

            except Exception as e:
                errors.append({
                    "index": index,
                    "data": user_data,
                    "error": str(e)
                })

        # Commit all valid users
        if created_users:
            db.session.commit()

        # Prepare response
        response = {
            "success": True,
            "created": len(created_users),
            "failed": len(errors),
            "total_processed": len(body["users"]),
            "users": [user.serialize() for user in created_users]
        }

        if errors:
            response["errors"] = errors

        status_code = 201 if created_users else 400

        return jsonify(response), status_code

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update an existing user"""
    try:
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        body = request.get_json()
        if not body:
            return jsonify({"error": "Request body is required"}), 400

        # Update name if provided
        if "name" in body:
            if not body["name"].strip():
                return jsonify({"error": "Name cannot be empty"}), 400
            user.name = body["name"].strip()

        # Update email if provided
        if "email" in body:
            if not body["email"].strip():
                return jsonify({"error": "Email cannot be empty"}), 400

            # Validate email format
            if not validate_email(body["email"]):
                return jsonify({"error": "Invalid email format"}), 400

            # Check if email already exists (excluding current user)
            existing_user = User.query.filter(
                User.email == body["email"].strip().lower(),
                User.id != user_id
            ).first()

            if existing_user:
                return jsonify({"error": "Email already exists"}), 400

            user.email = body["email"].strip().lower()

        db.session.commit()
        return jsonify(user.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user (only if they have no orders)"""
    try:
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Check if user has orders
        order_count = Order.query.filter_by(user_id=user_id).count()
        if order_count > 0:
            return jsonify({
                "error": "Cannot delete user with existing orders",
                "order_count": order_count
            }), 400

        # Delete user
        db.session.delete(user)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": f"User {user.name} deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ============== ORDER ENDPOINTS ==============

@api.route('/orders', methods=['POST'])
def create_order():
    """Create a new order"""
    try:
        body = request.get_json()

        # Validate required fields
        if not body:
            return jsonify({"error": "Request body is required"}), 400

        if "user_id" not in body:
            return jsonify({"error": "User ID is required"}), 400

        if "product_name" not in body or not body["product_name"].strip():
            return jsonify({"error": "Product name is required"}), 400

        if "amount" not in body:
            return jsonify({"error": "Amount is required"}), 400

        # Validate amount
        try:
            amount = float(body["amount"])
            if amount <= 0:
                return jsonify({"error": "Amount must be greater than 0"}), 400
        except (ValueError, TypeError):
            return jsonify({"error": "Amount must be a valid number"}), 400

        # Check if user exists
        user = User.query.get(body["user_id"])
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Create new order
        new_order = Order(
            user_id=body["user_id"],
            product_name=body["product_name"].strip(),
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
    """Get all orders with user information"""
    try:
        # Optional pagination
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        user_id = request.args.get('user_id', type=int)  # Optional filter

        # Validate pagination parameters
        if page < 1:
            return jsonify({"error": "Page must be greater than 0"}), 400
        if per_page < 1 or per_page > 100:
            return jsonify({"error": "Per page must be between 1 and 100"}), 400

        # Query with join to include user information
        query = Order.query.join(User)

        # Apply user_id filter if provided
        if user_id:
            query = query.filter(Order.user_id == user_id)

        # Order by created_at descending and paginate
        orders_pagination = query.order_by(Order.created_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        orders = [order.serialize() for order in orders_pagination.items]

        return jsonify({
            "orders": orders,
            "total": orders_pagination.total,
            "page": page,
            "per_page": per_page,
            "total_pages": orders_pagination.pages
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/orders/export', methods=['GET'])
def export_orders():
    """Export all orders to JSON"""
    try:
        # Get all orders without pagination
        orders = Order.query.join(User).all()

        # Serialize all orders
        orders_data = [order.serialize() for order in orders]

        return jsonify({
            "success": True,
            "total": len(orders_data),
            "orders": orders_data,
            "exported_at": datetime.now().isoformat()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/orders/batch', methods=['POST'])
def batch_create_orders():
    """Create multiple orders from JSON in batch"""
    try:
        body = request.get_json()

        # Validate request body
        if not body:
            return jsonify({"error": "Request body is required"}), 400

        if "orders" not in body or not isinstance(body["orders"], list):
            return jsonify({"error": "orders array is required"}), 400

        if len(body["orders"]) == 0:
            return jsonify({"error": "orders array cannot be empty"}), 400

        # Limit batch size to prevent overload
        if len(body["orders"]) > 1000:
            return jsonify({"error": "Maximum 1000 orders per batch"}), 400

        created_orders = []
        errors = []

        # Process each order
        for index, order_data in enumerate(body["orders"]):
            try:
                # Validate required fields
                if "user_id" not in order_data:
                    errors.append({
                        "index": index,
                        "error": "user_id is required"
                    })
                    continue

                if "product_name" not in order_data or not str(order_data["product_name"]).strip():
                    errors.append({
                        "index": index,
                        "error": "product_name is required"
                    })
                    continue

                if "amount" not in order_data:
                    errors.append({
                        "index": index,
                        "error": "amount is required"
                    })
                    continue

                # Validate amount
                try:
                    amount = float(order_data["amount"])
                    if amount <= 0:
                        errors.append({
                            "index": index,
                            "error": "amount must be greater than 0"
                        })
                        continue
                except (ValueError, TypeError):
                    errors.append({
                        "index": index,
                        "error": "amount must be a valid number"
                    })
                    continue

                # Check if user exists
                user = User.query.get(order_data["user_id"])
                if not user:
                    errors.append({
                        "index": index,
                        "error": f"User with id {order_data['user_id']} not found"
                    })
                    continue

                # Create new order
                new_order = Order(
                    user_id=order_data["user_id"],
                    product_name=str(order_data["product_name"]).strip(),
                    amount=amount
                )

                db.session.add(new_order)
                created_orders.append(new_order)

            except Exception as e:
                errors.append({
                    "index": index,
                    "error": str(e)
                })

        # Commit all valid orders
        if created_orders:
            db.session.commit()

        # Prepare response
        response = {
            "success": True,
            "created": len(created_orders),
            "failed": len(errors),
            "total_processed": len(body["orders"]),
            "orders": [order.serialize() for order in created_orders]
        }

        if errors:
            response["errors"] = errors

        status_code = 201 if created_orders else 400

        return jsonify(response), status_code

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/orders/<int:order_id>', methods=['PATCH'])
def update_order_status(order_id):
    """Update order status (pending, completed, cancelled)"""
    try:
        # Check if order exists
        order = Order.query.get(order_id)
        if not order:
            return jsonify({"error": "Order not found"}), 404

        body = request.get_json()
        if not body:
            return jsonify({"error": "Request body is required"}), 400

        if "status" not in body:
            return jsonify({"error": "Status is required"}), 400

        # Validate status value
        valid_statuses = ["pending", "completed", "cancelled"]
        new_status = body["status"].lower()

        if new_status not in valid_statuses:
            return jsonify({
                "error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            }), 400

        # Update status
        order.status = new_status
        db.session.commit()

        return jsonify(order.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
