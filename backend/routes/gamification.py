from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Achievement, UserAchievement
from utils.helpers import success_response, error_response
from datetime import date, timedelta

gamification_bp = Blueprint('gamification', __name__)

@gamification_bp.route('/achievements', methods=['GET'])
@jwt_required()
def get_all_achievements():
    """Tüm başarımları listele"""
    achievements = Achievement.query.all()
    return success_response(data=[a.to_dict() for a in achievements])

@gamification_bp.route('/my-achievements', methods=['GET'])
@jwt_required()
def get_user_achievements():
    """Kullanıcının kazandığı başarımları listele"""
    user_id = get_jwt_identity()
    user_achievements = UserAchievement.query.filter_by(user_id=user_id).all()
    return success_response(data=[ua.to_dict() for ua in user_achievements])

@gamification_bp.route('/streak', methods=['GET'])
@jwt_required()
def get_streak():
    """Kullanıcının güncel streak durumunu getir"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Streak kontrolü ve güncellemesi (basit mantık)
    today = date.today()
    if user.last_activity_date:
        if user.last_activity_date == today:
            pass # Zaten bugün işlem yapmış
        elif user.last_activity_date == today - timedelta(days=1):
            # Dün işlem yapmış, streak devam ediyor (burada artırmıyoruz, 
            # artırma işlemini bir aktivite endpoint'inde yapacağız)
            pass
        else:
            # Arada gün geçmiş, streak sıfırlandı
            user.streak_count = 0
            db.session.commit()
            
    return success_response(data={
        "streak_count": user.streak_count,
        "last_activity_date": user.last_activity_date.isoformat() if user.last_activity_date else None
    })

@gamification_bp.route('/activity', methods=['POST'])
@jwt_required()
def log_activity():
    """Kullanıcı aktivitesini kaydet ve streak güncelle"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    today = date.today()
    
    if not user.last_activity_date:
        user.streak_count = 1
    elif user.last_activity_date == today - timedelta(days=1):
        user.streak_count += 1
    elif user.last_activity_date < today - timedelta(days=1):
        user.streak_count = 1
        
    user.last_activity_date = today
    db.session.commit()
    
    return success_response(data={"streak_count": user.streak_count}, message="Activity logged.")
