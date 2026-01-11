"""
Legacy routes module - kept for backward compatibility
All routes have been moved to the routes package.
This file is deprecated and will be removed in future versions.
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
import logging

from models import db, User, Content, TestResult
from utils.helpers import success_response, error_response

logger = logging.getLogger(__name__)

# Create a legacy blueprint for backward compatibility
api = Blueprint('api_legacy', __name__)


@api.route('/auth/register', methods=['POST'])
def register():
    """Legacy register endpoint - redirects to new auth module logic"""
    data = request.get_json()
    logger.info(f"Legacy register endpoint called for: {data.get('email')}")
    
    email = data.get('email', '').strip().lower()
    password = data.get('password')
    username = data.get('username')
    firebase_uid = data.get('firebase_uid')

    if not email or not password:
        return jsonify({"msg": "E-posta ve şifre gereklidir."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Bu e-posta adresi zaten kayıtlı."}), 400

    new_user = User(email=email, username=username, firebase_uid=firebase_uid)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    logger.info(f"User registered via legacy endpoint: {email}")

    return jsonify({"msg": "Kullanıcı başarıyla kaydedildi."}), 201


@api.route('/auth/login', methods=['POST'])
def login():
    """Legacy login endpoint - maintains backward compatibility"""
    data = request.get_json()
    logger.info(f"Legacy login endpoint called for: {data.get('email')}")
    
    email = data.get('email', '').strip().lower()
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "E-posta ve şifre girilmelidir."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        logger.warning(f"Login failed: User not found - {email}")
        return jsonify({"msg": "Şifre veya e-posta yanlış."}), 401
    
    if not user.check_password(password):
        logger.warning(f"Login failed: Incorrect password - {email}")
        return jsonify({"msg": "Şifre veya e-posta yanlış."}), 401

    # Update last login
    user.last_login = datetime.utcnow()
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    logger.info(f"User logged in via legacy endpoint: {email}")
    
    return jsonify({
        "access_token": access_token,
        "user": user.to_dict()
    }), 200


@api.route('/debug/config', methods=['GET'])
def debug_config():
    """Debug endpoint - only available in development"""
    if not current_app.debug:
        return jsonify({"msg": "Not available in production"}), 403
    return jsonify({
        "SQLALCHEMY_DATABASE_URI": current_app.config.get('SQLALCHEMY_DATABASE_URI')
    }), 200


@api.route('/debug/users', methods=['GET'])
def debug_users():
    """Debug endpoint - list all users (development only)"""
    if not current_app.debug:
        return jsonify({"msg": "Not available in production"}), 403
    users = User.query.all()
    return jsonify([{
        "id": u.id,
        "email": u.email,
        "username": u.username,
        "firebase_uid": u.firebase_uid
    } for u in users]), 200


@api.route('/get-content', methods=['GET'])
def get_content():
    """Legacy content endpoint"""
    difficulty = request.args.get('difficulty')
    content_type = request.args.get('type')
    
    query = Content.query
    if difficulty:
        query = query.filter_by(difficulty=difficulty)
    if content_type:
        query = query.filter_by(type=content_type)
    
    contents = query.all()
    return jsonify([c.to_dict() for c in contents]), 200


@api.route('/sync-results', methods=['POST'])
@jwt_required()
def sync_results():
    """Legacy sync results endpoint"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not isinstance(data, list):
        return jsonify({"msg": "Input should be a list of results"}), 400

    results_added = 0
    for item in data:
        new_result = TestResult(
            user_id=user_id,
            score=item.get('score', 0),
            total_questions=item.get('total_questions', 1),
            completed_at=datetime.strptime(
                item.get('completed_at'), '%Y-%m-%dT%H:%M:%S'
            ) if item.get('completed_at') else datetime.utcnow(),
            synced=True
        )
        db.session.add(new_result)
        results_added += 1
    
    db.session.commit()
    return jsonify({"msg": f"Successfully synced {results_added} results"}), 201
