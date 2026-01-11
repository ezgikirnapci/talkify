"""
Word routes for the Talkify API
"""
import logging
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from models import db, Word, UserProgress, DailyWord
from utils.helpers import success_response, error_response, paginate_query, require_json
from utils.validators import validate_pagination, validate_level

logger = logging.getLogger(__name__)

words_bp = Blueprint('words', __name__)


@words_bp.route('', methods=['GET'])
def get_words():
    """Kelimeleri listele (filtreleme ve sayfalama destekli)"""
    # Query parameters
    level = request.args.get('level')
    category = request.args.get('category')
    page, per_page = validate_pagination(
        request.args.get('page'),
        request.args.get('per_page')
    )
    
    # Build query
    query = Word.query
    
    if level:
        is_valid, result = validate_level(level)
        if is_valid:
            query = query.filter_by(level=result)
    
    if category:
        query = query.filter_by(category=category)
    
    query = query.order_by(Word.id)
    
    # Paginate
    result = paginate_query(query, page=page, per_page=per_page)
    
    return success_response(data={
        'words': [word.to_dict() for word in result['items']],
        'pagination': result['pagination']
    })


@words_bp.route('/<int:word_id>', methods=['GET'])
def get_word(word_id):
    """Tek bir kelimeyi getir"""
    word = Word.query.get(word_id)
    
    if not word:
        return error_response("Kelime bulunamadı.", 404)
    
    return success_response(data={'word': word.to_dict()})


@words_bp.route('/daily', methods=['GET'])
def get_daily_word():
    """Günün kelimesini getir"""
    daily = DailyWord.get_today()
    
    if not daily or not daily.word:
        # Fallback: Rastgele bir kelime
        word = Word.query.order_by(db.func.random()).first()
        if not word:
            return error_response("Henüz kelime eklenmemiş.", 404)
        return success_response(data={'word': word.to_dict()})
    
    return success_response(data={'word': daily.word.to_dict()})


@words_bp.route('/categories', methods=['GET'])
def get_categories():
    """Mevcut kategorileri listele"""
    categories = db.session.query(Word.category).distinct().filter(
        Word.category.isnot(None)
    ).all()
    
    return success_response(data={
        'categories': [c[0] for c in categories if c[0]]
    })


@words_bp.route('/levels', methods=['GET'])
def get_levels():
    """Mevcut seviyeleri listele"""
    levels = db.session.query(Word.level).distinct().filter(
        Word.level.isnot(None)
    ).order_by(Word.level).all()
    
    return success_response(data={
        'levels': [l[0] for l in levels if l[0]]
    })


@words_bp.route('/progress', methods=['POST'])
@jwt_required()
@require_json
def update_word_progress():
    """Kelime öğrenme durumunu kaydet"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    word_id = data.get('word_id')
    learned = data.get('learned', False)
    correct = data.get('correct', True)
    
    if not word_id:
        return error_response("word_id gereklidir.")
    
    # Check if word exists
    word = Word.query.get(word_id)
    if not word:
        return error_response("Kelime bulunamadı.", 404)
    
    # Get or create progress
    progress = UserProgress.query.filter_by(
        user_id=user_id,
        word_id=word_id
    ).first()
    
    if not progress:
        progress = UserProgress(user_id=user_id, word_id=word_id)
        db.session.add(progress)
    
    # Update progress
    progress.review_count += 1
    if correct:
        progress.correct_count += 1
    progress.learned = learned
    progress.last_reviewed = datetime.utcnow()
    
    db.session.commit()
    
    logger.info(f"User {user_id} updated progress for word {word_id}")
    
    return success_response(
        data={'progress': progress.to_dict()},
        message="İlerleme kaydedildi."
    )


@words_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_word_progress():
    """Kullanıcının kelime ilerlemesini getir"""
    user_id = get_jwt_identity()
    
    learned_only = request.args.get('learned') == 'true'
    page, per_page = validate_pagination(
        request.args.get('page'),
        request.args.get('per_page')
    )
    
    query = UserProgress.query.filter_by(user_id=user_id)
    
    if learned_only:
        query = query.filter_by(learned=True)
    
    result = paginate_query(query, page=page, per_page=per_page)
    
    return success_response(data={
        'progress': [p.to_dict() for p in result['items']],
        'pagination': result['pagination']
    })
