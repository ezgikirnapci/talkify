"""
Progress routes for the Talkify API
"""
import logging
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from models import db, User, UserProgress, LearningSession, TestResult, Word
from utils.helpers import success_response, error_response, require_json
from utils.validators import validate_pagination

logger = logging.getLogger(__name__)

progress_bp = Blueprint('progress', __name__)


@progress_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Kullanıcının genel istatistiklerini getir"""
    user_id = get_jwt_identity()
    
    # Öğrenilen kelime sayısı
    learned_words = UserProgress.query.filter_by(
        user_id=user_id, 
        learned=True
    ).count()
    
    # Toplam incelenen kelime sayısı
    total_reviewed = UserProgress.query.filter_by(user_id=user_id).count()
    
    # Quiz istatistikleri
    quiz_results = TestResult.query.filter_by(user_id=user_id).all()
    total_quizzes = len(quiz_results)
    average_score = 0
    if quiz_results:
        average_score = sum(r.percentage or 0 for r in quiz_results) / total_quizzes
    
    # Oturum istatistikleri
    sessions = LearningSession.query.filter_by(user_id=user_id).all()
    total_sessions = len(sessions)
    total_time = sum(s.duration_seconds or 0 for s in sessions)
    
    # Kullanıcı seviyesi
    user = User.query.get(user_id)
    
    return success_response(data={
        'stats': {
            'learned_words': learned_words,
            'total_reviewed': total_reviewed,
            'total_quizzes': total_quizzes,
            'average_quiz_score': round(average_score, 1),
            'total_sessions': total_sessions,
            'total_learning_time_minutes': round(total_time / 60, 1),
            'current_level': user.language_level if user else 'A1',
            'daily_goal': user.daily_goal if user else 10
        }
    })


@progress_bp.route('/words', methods=['GET'])
@jwt_required()
def get_learned_words():
    """Öğrenilen kelimeleri listele"""
    user_id = get_jwt_identity()
    
    page, per_page = validate_pagination(
        request.args.get('page'),
        request.args.get('per_page')
    )
    
    # Öğrenilen kelimeleri join ile getir
    progress_items = db.session.query(UserProgress, Word).join(
        Word, UserProgress.word_id == Word.id
    ).filter(
        UserProgress.user_id == user_id,
        UserProgress.learned == True
    ).order_by(
        UserProgress.last_reviewed.desc()
    ).paginate(page=page, per_page=per_page, error_out=False)
    
    words = [{
        'word': word.to_dict(),
        'progress': progress.to_dict()
    } for progress, word in progress_items.items]
    
    return success_response(data={
        'learned_words': words,
        'pagination': {
            'page': progress_items.page,
            'per_page': progress_items.per_page,
            'total_pages': progress_items.pages,
            'total_items': progress_items.total
        }
    })


@progress_bp.route('/sessions', methods=['GET'])
@jwt_required()
def get_sessions():
    """Oturum geçmişini getir"""
    user_id = get_jwt_identity()
    
    page, per_page = validate_pagination(
        request.args.get('page'),
        request.args.get('per_page')
    )
    
    sessions = LearningSession.query.filter_by(user_id=user_id).order_by(
        LearningSession.started_at.desc()
    ).paginate(page=page, per_page=per_page, error_out=False)
    
    return success_response(data={
        'sessions': [s.to_dict() for s in sessions.items],
        'pagination': {
            'page': sessions.page,
            'per_page': sessions.per_page,
            'total_pages': sessions.pages,
            'total_items': sessions.total
        }
    })


@progress_bp.route('/sessions', methods=['POST'])
@jwt_required()
@require_json
def create_session():
    """Yeni öğrenme oturumu başlat"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    session_type = data.get('session_type')
    
    if not session_type:
        return error_response("session_type gereklidir.")
    
    valid_types = ['flashcard', 'quiz', 'grammar', 'vocabulary']
    if session_type not in valid_types:
        return error_response(f"Geçersiz session_type. Geçerli: {', '.join(valid_types)}")
    
    session = LearningSession(
        user_id=user_id,
        session_type=session_type,
        started_at=datetime.utcnow()
    )
    
    db.session.add(session)
    db.session.commit()
    
    return success_response(
        data={'session': session.to_dict()},
        message="Oturum başlatıldı.",
        status_code=201
    )


@progress_bp.route('/sessions/<int:session_id>', methods=['PUT'])
@jwt_required()
@require_json
def update_session(session_id):
    """Oturumu güncelleveya tamamla"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    session = LearningSession.query.filter_by(
        id=session_id,
        user_id=user_id
    ).first()
    
    if not session:
        return error_response("Oturum bulunamadı.", 404)
    
    if 'score' in data:
        session.score = data['score']
    
    if 'total_items' in data:
        session.total_items = data['total_items']
    
    if 'duration_seconds' in data:
        session.duration_seconds = data['duration_seconds']
    
    if data.get('completed'):
        session.completed_at = datetime.utcnow()
        if not session.duration_seconds:
            # Süreyi hesapla
            delta = session.completed_at - session.started_at
            session.duration_seconds = int(delta.total_seconds())
    
    db.session.commit()
    
    return success_response(
        data={'session': session.to_dict()},
        message="Oturum güncellendi."
    )


@progress_bp.route('/daily', methods=['GET'])
@jwt_required()
def get_daily_progress():
    """Bugünkü ilerlemeyi getir"""
    user_id = get_jwt_identity()
    today = datetime.utcnow().date()
    
    # Bugün öğrenilen kelimeler
    learned_today = UserProgress.query.filter(
        UserProgress.user_id == user_id,
        UserProgress.learned == True,
        db.func.date(UserProgress.updated_at) == today
    ).count()
    
    # Bugünkü quizler
    quizzes_today = TestResult.query.filter(
        TestResult.user_id == user_id,
        db.func.date(TestResult.completed_at) == today
    ).count()
    
    # Kullanıcının hedefi
    user = User.query.get(user_id)
    daily_goal = user.daily_goal if user else 10
    
    return success_response(data={
        'daily': {
            'learned_words': learned_today,
            'quizzes_completed': quizzes_today,
            'daily_goal': daily_goal,
            'goal_progress': round((learned_today / daily_goal) * 100, 1) if daily_goal > 0 else 0
        }
    })
