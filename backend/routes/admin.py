"""
Admin routes for the Talkify API
Provides dashboard stats and CRUD operations for management
"""
import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from sqlalchemy import func

from models import db, User, Word, Quiz, QuizQuestion, TestResult, UserProgress, LearningSession, GrammarContent
from utils.helpers import success_response, error_response, paginate_query, require_json
from utils.validators import validate_pagination
from utils.decorators import admin_required

logger = logging.getLogger(__name__)

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/dashboard', methods=['GET'])
def get_dashboard_stats():
    """Dashboard istatistiklerini getir"""
    # Kullanıcı istatistikleri
    total_users = User.query.count()
    today = datetime.utcnow().date()
    week_ago = today - timedelta(days=7)
    
    new_users_today = User.query.filter(
        func.date(User.created_at) == today
    ).count()
    
    new_users_week = User.query.filter(
        func.date(User.created_at) >= week_ago
    ).count()
    
    # İçerik istatistikleri
    total_words = Word.query.count()
    total_quizzes = Quiz.query.count()
    total_grammar = GrammarContent.query.count()
    
    # Öğrenme istatistikleri
    total_test_results = TestResult.query.count()
    total_progress = UserProgress.query.filter_by(learned=True).count()
    total_sessions = LearningSession.query.count()
    
    # Seviye dağılımı
    level_distribution = db.session.query(
        Word.level, func.count(Word.id)
    ).group_by(Word.level).all()
    
    # Son aktiviteler
    recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()
    recent_results = TestResult.query.order_by(
        TestResult.completed_at.desc()
    ).limit(5).all()
    
    return success_response(data={
        'users': {
            'total': total_users,
            'new_today': new_users_today,
            'new_this_week': new_users_week
        },
        'content': {
            'words': total_words,
            'quizzes': total_quizzes,
            'grammar': total_grammar
        },
        'learning': {
            'test_results': total_test_results,
            'words_learned': total_progress,
            'sessions': total_sessions
        },
        'level_distribution': {level: count for level, count in level_distribution},
        'recent_users': [u.to_dict() for u in recent_users],
        'recent_results': [r.to_dict() for r in recent_results]
    })


# ==================== USER MANAGEMENT ====================

@admin_bp.route('/users', methods=['GET'])
def get_users():
    """Kullanıcıları listele"""
    page, per_page = validate_pagination(
        request.args.get('page'),
        request.args.get('per_page', 20)
    )
    search = request.args.get('search', '')
    
    query = User.query
    
    if search:
        query = query.filter(
            (User.email.ilike(f'%{search}%')) |
            (User.username.ilike(f'%{search}%'))
        )
    
    query = query.order_by(User.created_at.desc())
    result = paginate_query(query, page=page, per_page=per_page)
    
    users = []
    for user in result['items']:
        user_dict = user.to_dict()
        user_dict['test_count'] = TestResult.query.filter_by(user_id=user.id).count()
        user_dict['words_learned'] = UserProgress.query.filter_by(
            user_id=user.id, learned=True
        ).count()
        users.append(user_dict)
    
    return success_response(data={
        'users': users,
        'pagination': result['pagination']
    })


@admin_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Tekil kullanıcı detayı"""
    user = User.query.get(user_id)
    if not user:
        return error_response("Kullanıcı bulunamadı.", 404)
    
    user_dict = user.to_dict()
    user_dict['test_results'] = [r.to_dict() for r in user.test_results[-10:]]
    user_dict['words_learned'] = UserProgress.query.filter_by(
        user_id=user.id, learned=True
    ).count()
    
    return success_response(data={'user': user_dict})


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    """Kullanıcı sil"""
    user = User.query.get(user_id)
    if not user:
        return error_response("Kullanıcı bulunamadı.", 404)
    
    email = user.email
    db.session.delete(user)
    db.session.commit()
    
    logger.info(f"Admin deleted user: {email}")
    return success_response(message=f"Kullanıcı '{email}' silindi.")


# ==================== WORD MANAGEMENT ====================

@admin_bp.route('/words', methods=['GET'])
def get_words():
    """Kelimeleri listele"""
    page, per_page = validate_pagination(
        request.args.get('page'),
        request.args.get('per_page', 20)
    )
    search = request.args.get('search', '')
    level = request.args.get('level')
    category = request.args.get('category')
    
    query = Word.query
    
    if search:
        query = query.filter(
            (Word.word.ilike(f'%{search}%')) |
            (Word.meaning.ilike(f'%{search}%'))
        )
    
    if level:
        query = query.filter_by(level=level)
    
    if category:
        query = query.filter_by(category=category)
    
    query = query.order_by(Word.id.desc())
    result = paginate_query(query, page=page, per_page=per_page)
    
    return success_response(data={
        'words': [w.to_dict() for w in result['items']],
        'pagination': result['pagination']
    })


@admin_bp.route('/words', methods=['POST'])
@admin_required
@require_json
def create_word():
    """Yeni kelime ekle"""
    data = request.get_json()
    
    word_text = data.get('word', '').strip()
    meaning = data.get('meaning', '').strip()
    
    if not word_text or not meaning:
        return error_response("Kelime ve anlam gereklidir.")
    
    # Check duplicate
    if Word.query.filter_by(word=word_text).first():
        return error_response("Bu kelime zaten mevcut.", 409)
    
    word = Word(
        word=word_text,
        meaning=meaning,
        category=data.get('category'),
        level=data.get('level', 'A1'),
        example_sentence=data.get('example_sentence'),
        example_translation=data.get('example_translation'),
        pronunciation=data.get('pronunciation')
    )
    
    db.session.add(word)
    db.session.commit()
    
    logger.info(f"Admin created word: {word_text}")
    return success_response(
        data={'word': word.to_dict()},
        message="Kelime eklendi.",
        status_code=201
    )


@admin_bp.route('/words/<int:word_id>', methods=['PUT'])
@admin_required
@require_json
def update_word(word_id):
    """Kelime güncelle"""
    word = Word.query.get(word_id)
    if not word:
        return error_response("Kelime bulunamadı.", 404)
    
    data = request.get_json()
    
    if 'word' in data:
        word.word = data['word'].strip()
    if 'meaning' in data:
        word.meaning = data['meaning'].strip()
    if 'category' in data:
        word.category = data['category']
    if 'level' in data:
        word.level = data['level']
    if 'example_sentence' in data:
        word.example_sentence = data['example_sentence']
    if 'example_translation' in data:
        word.example_translation = data['example_translation']
    if 'pronunciation' in data:
        word.pronunciation = data['pronunciation']
    
    db.session.commit()
    
    logger.info(f"Admin updated word: {word.word}")
    return success_response(
        data={'word': word.to_dict()},
        message="Kelime güncellendi."
    )


@admin_bp.route('/words/<int:word_id>', methods=['DELETE'])
@admin_required
def delete_word(word_id):
    """Kelime sil"""
    word = Word.query.get(word_id)
    if not word:
        return error_response("Kelime bulunamadı.", 404)
    
    word_text = word.word
    db.session.delete(word)
    db.session.commit()
    
    logger.info(f"Admin deleted word: {word_text}")
    return success_response(message=f"'{word_text}' kelimesi silindi.")


# ==================== QUIZ MANAGEMENT ====================

@admin_bp.route('/quizzes', methods=['GET'])
def get_quizzes():
    """Quizleri listele"""
    page, per_page = validate_pagination(
        request.args.get('page'),
        request.args.get('per_page', 20)
    )
    
    query = Quiz.query.order_by(Quiz.id.desc())
    result = paginate_query(query, page=page, per_page=per_page)
    
    quizzes = []
    for quiz in result['items']:
        quiz_dict = quiz.to_dict()
        quiz_dict['attempts'] = TestResult.query.filter_by(quiz_id=quiz.id).count()
        quizzes.append(quiz_dict)
    
    return success_response(data={
        'quizzes': quizzes,
        'pagination': result['pagination']
    })


@admin_bp.route('/quizzes/<int:quiz_id>', methods=['GET'])
def get_quiz_detail(quiz_id):
    """Quiz detayını getir"""
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return error_response("Quiz bulunamadı.", 404)
    
    return success_response(data={
        'quiz': quiz.to_dict(include_questions=True)
    })


@admin_bp.route('/quizzes', methods=['POST'])
@admin_required
@require_json
def create_quiz():
    """Yeni quiz oluştur"""
    data = request.get_json()
    
    title = data.get('title', '').strip()
    if not title:
        return error_response("Quiz başlığı gereklidir.")
    
    quiz = Quiz(
        title=title,
        description=data.get('description'),
        level=data.get('level', 'A1'),
        category=data.get('category', 'Vocabulary'),
        is_active=data.get('is_active', True)
    )
    
    db.session.add(quiz)
    db.session.commit()
    
    # Add questions if provided
    questions = data.get('questions', [])
    for q_data in questions:
        question = QuizQuestion(
            quiz_id=quiz.id,
            question=q_data.get('question'),
            options=q_data.get('options', []),
            correct_answer=q_data.get('correct_answer', 0),
            explanation=q_data.get('explanation')
        )
        db.session.add(question)
    
    db.session.commit()
    
    logger.info(f"Admin created quiz: {title}")
    return success_response(
        data={'quiz': quiz.to_dict(include_questions=True)},
        message="Quiz oluşturuldu.",
        status_code=201
    )


@admin_bp.route('/quizzes/<int:quiz_id>', methods=['DELETE'])
@admin_required
def delete_quiz(quiz_id):
    """Quiz sil"""
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return error_response("Quiz bulunamadı.", 404)
    
    title = quiz.title
    db.session.delete(quiz)
    db.session.commit()
    
    logger.info(f"Admin deleted quiz: {title}")
    return success_response(message=f"'{title}' quizi silindi.")


# ==================== CATEGORIES & LEVELS ====================

@admin_bp.route('/categories', methods=['GET'])
def get_all_categories():
    """Tüm kategorileri getir"""
    categories = db.session.query(Word.category).distinct().filter(
        Word.category.isnot(None)
    ).all()
    
    return success_response(data={
        'categories': [c[0] for c in categories if c[0]]
    })


@admin_bp.route('/levels', methods=['GET'])
def get_all_levels():
    """Tüm seviyeleri getir"""
    return success_response(data={
        'levels': ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    })


# ==================== DATABASE EXPLORER ====================

@admin_bp.route('/database/tables', methods=['GET'])
def get_database_tables():
    """Tüm veritabanı tablolarını listele"""
    from models import Content, DailyWord
    
    tables = [
        {
            'name': 'users',
            'display_name': 'Kullanıcılar',
            'count': User.query.count(),
            'icon': 'fa-users'
        },
        {
            'name': 'words',
            'display_name': 'Kelimeler',
            'count': Word.query.count(),
            'icon': 'fa-book'
        },
        {
            'name': 'grammar_content',
            'display_name': 'Gramer İçerikleri',
            'count': GrammarContent.query.count(),
            'icon': 'fa-spell-check'
        },
        {
            'name': 'quizzes',
            'display_name': 'Quizler',
            'count': Quiz.query.count(),
            'icon': 'fa-question-circle'
        },
        {
            'name': 'quiz_questions',
            'display_name': 'Quiz Soruları',
            'count': QuizQuestion.query.count(),
            'icon': 'fa-list-ol'
        },
        {
            'name': 'test_results',
            'display_name': 'Test Sonuçları',
            'count': TestResult.query.count(),
            'icon': 'fa-chart-bar'
        },
        {
            'name': 'user_progress',
            'display_name': 'Kullanıcı İlerlemesi',
            'count': UserProgress.query.count(),
            'icon': 'fa-tasks'
        },
        {
            'name': 'learning_sessions',
            'display_name': 'Öğrenme Oturumları',
            'count': LearningSession.query.count(),
            'icon': 'fa-clock'
        },
        {
            'name': 'daily_words',
            'display_name': 'Günün Kelimeleri',
            'count': DailyWord.query.count(),
            'icon': 'fa-calendar-day'
        },
        {
            'name': 'contents',
            'display_name': 'Legacy İçerikler',
            'count': Content.query.count(),
            'icon': 'fa-archive'
        }
    ]
    
    return success_response(data={'tables': tables})


@admin_bp.route('/database/<table_name>', methods=['GET'])
def get_table_data(table_name):
    """Belirli bir tablonun verilerini getir"""
    from models import Content, DailyWord
    
    page, per_page = validate_pagination(
        request.args.get('page'),
        request.args.get('per_page', 20)
    )
    
    # Table mapping
    table_map = {
        'users': User,
        'words': Word,
        'grammar_content': GrammarContent,
        'quizzes': Quiz,
        'quiz_questions': QuizQuestion,
        'test_results': TestResult,
        'user_progress': UserProgress,
        'learning_sessions': LearningSession,
        'daily_words': DailyWord,
        'contents': Content
    }
    
    if table_name not in table_map:
        return error_response("Tablo bulunamadı.", 404)
    
    model = table_map[table_name]
    
    # Get columns
    columns = [column.name for column in model.__table__.columns]
    
    # Query with pagination
    query = model.query.order_by(model.id.desc())
    result = paginate_query(query, page=page, per_page=per_page)
    
    # Convert to dict
    rows = []
    for item in result['items']:
        if hasattr(item, 'to_dict'):
            row = item.to_dict()
        else:
            row = {col: getattr(item, col) for col in columns}
            # Handle datetime serialization
            for key, value in row.items():
                if hasattr(value, 'isoformat'):
                    row[key] = value.isoformat()
        rows.append(row)
    
    return success_response(data={
        'table_name': table_name,
        'columns': columns,
        'rows': rows,
        'pagination': result['pagination']
    })


@admin_bp.route('/database/<table_name>/<int:row_id>', methods=['DELETE'])
def delete_table_row(table_name, row_id):
    """Tablodan satır sil"""
    from models import Content, DailyWord
    
    table_map = {
        'users': User,
        'words': Word,
        'grammar_content': GrammarContent,
        'quizzes': Quiz,
        'quiz_questions': QuizQuestion,
        'test_results': TestResult,
        'user_progress': UserProgress,
        'learning_sessions': LearningSession,
        'daily_words': DailyWord,
        'contents': Content
    }
    
    if table_name not in table_map:
        return error_response("Tablo bulunamadı.", 404)
    
    model = table_map[table_name]
    item = model.query.get(row_id)
    
    if not item:
        return error_response("Kayıt bulunamadı.", 404)
    
    db.session.delete(item)
    db.session.commit()
    
    logger.info(f"Admin deleted row {row_id} from {table_name}")
    return success_response(message=f"Kayıt silindi.")
