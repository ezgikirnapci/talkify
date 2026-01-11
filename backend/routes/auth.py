"""
Authentication routes for the Talkify API
"""
import logging
from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

from models import db, User
from utils.helpers import success_response, error_response, require_json
from utils.validators import validate_email, validate_password, validate_username

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
@require_json
def register():
    """Yeni kullanıcı kaydı"""
    data = request.get_json()
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    username = data.get('username')
    firebase_uid = data.get('firebase_uid')
    
    # Validation
    is_valid, error = validate_email(email)
    if not is_valid:
        return error_response(error)
    
    is_valid, error = validate_password(password)
    if not is_valid:
        return error_response(error)
    
    is_valid, error = validate_username(username)
    if not is_valid:
        return error_response(error)
    
    # Check if user exists
    if User.query.filter_by(email=email).first():
        return error_response("Bu e-posta adresi zaten kayıtlı.", 409)
    
    if firebase_uid and User.query.filter_by(firebase_uid=firebase_uid).first():
        return error_response("Bu Firebase hesabı zaten kayıtlı.", 409)
    
    # Create user
    try:
        new_user = User(
            email=email,
            username=username or email.split('@')[0],
            firebase_uid=firebase_uid
        )
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        logger.info(f"New user registered: {email}")
        
        return success_response(
            data={'user': new_user.to_dict()},
            message="Kullanıcı başarıyla kaydedildi.",
            status_code=201
        )
    except Exception as e:
        db.session.rollback()
        logger.error(f"Registration error for {email}: {str(e)}")
        return error_response("Kayıt sırasında bir hata oluştu.", 500)


@auth_bp.route('/login', methods=['POST'])
@require_json
def login():
    """Kullanıcı girişi"""
    data = request.get_json()
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email or not password:
        return error_response("E-posta ve şifre girilmelidir.")
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not user.check_password(password):
        logger.warning(f"Failed login attempt for: {email}")
        return error_response("Şifre veya e-posta yanlış.", 401)
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    # Create access token
    access_token = create_access_token(identity=user.id)
    
    logger.info(f"User logged in: {email}")
    
    return success_response(data={
        'access_token': access_token,
        'user': user.to_dict()
    })


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Mevcut kullanıcı bilgilerini getir"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return error_response("Kullanıcı bulunamadı.", 404)
    
    return success_response(data={'user': user.to_dict()})


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
@require_json
def update_profile():
    """Kullanıcı profilini güncelle"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return error_response("Kullanıcı bulunamadı.", 404)
    
    data = request.get_json()
    
    # Update allowed fields
    if 'username' in data:
        is_valid, error = validate_username(data['username'])
        if not is_valid:
            return error_response(error)
        user.username = data['username']
    
    if 'language_level' in data:
        valid_levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
        if data['language_level'] not in valid_levels:
            return error_response(f"Geçersiz seviye. Geçerli: {', '.join(valid_levels)}")
        user.language_level = data['language_level']
    
    if 'daily_goal' in data:
        try:
            goal = int(data['daily_goal'])
            if goal < 1 or goal > 100:
                return error_response("Günlük hedef 1-100 arasında olmalı.")
            user.daily_goal = goal
        except ValueError:
            return error_response("Geçersiz günlük hedef.")
    
    if 'avatar_url' in data:
        user.avatar_url = data['avatar_url']
    
    db.session.commit()
    
    return success_response(
        data={'user': user.to_dict()},
        message="Profil güncellendi."
    )
