from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Conversation, ChatMessage
from utils.helpers import success_response, error_response

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/conversations', methods=['GET'])
@jwt_required()
def get_conversations():
    """Kullanıcının tüm sohbet geçmişini listele"""
    user_id = get_jwt_identity()
    conversations = Conversation.query.filter_by(user_id=user_id).order_by(Conversation.updated_at.desc()).all()
    return success_response(data=[c.to_dict() for c in conversations])

@chat_bp.route('/conversations', methods=['POST'])
@jwt_required()
def create_conversation():
    """Yeni bir sohbet başlat"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    title = data.get('title', 'New English Practice')
    
    conv = Conversation(user_id=user_id, title=title)
    db.session.add(conv)
    db.session.commit()
    
    return success_response(data=conv.to_dict(), message="New conversation started.")

@chat_bp.route('/conversations/<int:conv_id>/messages', methods=['GET'])
@jwt_required()
def get_messages(conv_id):
    """Bir sohbete ait mesajları getir"""
    user_id = get_jwt_identity()
    conv = Conversation.query.filter_by(id=conv_id, user_id=user_id).first()
    
    if not conv:
        return error_response("Sohbet bulunamadı.", 404)
        
    messages = ChatMessage.query.filter_by(conversation_id=conv_id).order_by(ChatMessage.created_at.asc()).all()
    return success_response(data=[m.to_dict() for m in messages])

@chat_bp.route('/conversations/<int:conv_id>/messages', methods=['POST'])
@jwt_required()
def add_message(conv_id):
    """Sohbete yeni mesaj ekle"""
    user_id = get_jwt_identity()
    conv = Conversation.query.filter_by(id=conv_id, user_id=user_id).first()
    
    if not conv:
        return error_response("Sohbet bulunamadı.", 404)
        
    data = request.get_json()
    role = data.get('role')  # 'user' or 'assistant'
    content = data.get('content')
    
    if not role or not content:
        return error_response("Eksik veri.", 400)
        
    msg = ChatMessage(conversation_id=conv_id, role=role, content=content)
    db.session.add(msg)
    
    # Update conversation timestamp
    conv.updated_at = db.func.now()
    
    db.session.commit()
    
    return success_response(data=msg.to_dict())
