"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Order
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
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
        
        # Validate pagination parameters
        if page < 1:
            return jsonify({"error": "Page must be greater than 0"}), 400
        if per_page < 1 or per_page > 100:
            return jsonify({"error": "Per page must be between 1 and 100"}), 400
        
        # Query with join to include user information
        orders_pagination = Order.query.join(User).paginate(
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
