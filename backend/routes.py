from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Content, TestResult
from datetime import datetime

api = Blueprint('api', __name__)

@api.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    print(f"Registering user: {data}") # Debug log
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')

    if not email or not password:
        return jsonify({"msg": "E-posta ve şifre gereklidir."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Bu e-posta adresi zaten kayıtlı."}), 400

    firebase_uid = data.get('firebase_uid')
    new_user = User(email=email, username=username, firebase_uid=firebase_uid)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    print(f"User {email} registered successfully in DB (firebase_uid={firebase_uid})") # Debug log

    return jsonify({"msg": "Kullanıcı başarıyla kaydedildi."}), 201

@api.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    print(f"Login attempt: {data}") # Debug log
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "E-posta ve şifre girilmelidir."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        print(f"Login failed: User {email} not found") # Debug log
        return jsonify({"msg": "Şifre veya e-posta yanlış."}), 401
    
    if not user.check_password(password):
        print(f"Login failed: Incorrect password for {email}") # Debug log
        return jsonify({"msg": "Şifre veya e-posta yanlış."}), 401

    access_token = create_access_token(identity=user.id)
    print(f"Login successful for {email}") # Debug log
    return jsonify({
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username
        }
    }), 200

@api.route('/debug/config', methods=['GET'])
def debug_config():
    return jsonify({"SQLALCHEMY_DATABASE_URI": current_app.config.get('SQLALCHEMY_DATABASE_URI')}), 200


@api.route('/debug/users', methods=['GET'])
def debug_users():
    users = User.query.all()
    return jsonify([{
        "id": u.id,
        "email": u.email,
        "username": u.username,
        "firebase_uid": u.firebase_uid
    } for u in users]), 200


@api.route('/get-content', methods=['GET'])
def get_content():
    difficulty = request.args.get('difficulty')
    content_type = request.args.get('type')
    
    query = Content.query
    if difficulty:
        query = query.filter_by(difficulty=difficulty)
    if content_type:
        query = query.filter_by(type=content_type)
    
    contents = query.all()
    return jsonify([{
        "id": c.id,
        "type": c.type,
        "title": c.title,
        "data": c.data,
        "difficulty": c.difficulty
    } for c in contents]), 200

@api.route('/sync-results', methods=['POST'])
@jwt_required()
def sync_results():
    user_id = get_jwt_identity()
    data = request.get_json() # Should be a list of results
    
    if not isinstance(data, list):
        return jsonify({"msg": "Input should be a list of results"}), 400

    results_added = 0
    for item in data:
        new_result = TestResult(
            user_id=user_id,
            score=item.get('score'),
            completed_at=datetime.strptime(item.get('completed_at'), '%Y-%m-%dT%H:%M:%S') if item.get('completed_at') else datetime.utcnow(),
            synced=True
        )
        db.session.add(new_result)
        results_added += 1
    
    db.session.commit()
    return jsonify({"msg": f"Successfully synced {results_added} results"}), 201
