"""
Quiz routes for the Talkify API
"""
import logging
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from models import db, Quiz, QuizQuestion, TestResult
from utils.helpers import success_response, error_response, paginate_query, require_json
from utils.validators import validate_pagination, validate_level

logger = logging.getLogger(__name__)

quiz_bp = Blueprint('quiz', __name__)


@quiz_bp.route('', methods=['GET'])
def get_quizzes():
    """Quiz listesini getir"""
    level = request.args.get('level')
    category = request.args.get('category')
    page, per_page = validate_pagination(
        request.args.get('page'),
        request.args.get('per_page')
    )
    
    query = Quiz.query.filter_by(is_active=True)
    
    if level:
        is_valid, result = validate_level(level)
        if is_valid:
            query = query.filter_by(level=result)
    
    if category:
        query = query.filter_by(category=category)
    
    query = query.order_by(Quiz.id)
    
    result = paginate_query(query, page=page, per_page=per_page)
    
    return success_response(data={
        'quizzes': [quiz.to_dict() for quiz in result['items']],
        'pagination': result['pagination']
    })


@quiz_bp.route('/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    """Tek bir quiz'i getir (sorularla birlikte)"""
    quiz = Quiz.query.get(quiz_id)
    
    if not quiz:
        return error_response("Quiz bulunamadı.", 404)
    
    return success_response(data={
        'quiz': quiz.to_dict(include_questions=True)
    })


@quiz_bp.route('/<int:quiz_id>/questions', methods=['GET'])
def get_quiz_questions(quiz_id):
    """Quiz sorularını getir (cevapsız - sınav modu)"""
    quiz = Quiz.query.get(quiz_id)
    
    if not quiz:
        return error_response("Quiz bulunamadı.", 404)
    
    hide_answers = request.args.get('exam_mode') == 'true'
    
    return success_response(data={
        'quiz_id': quiz_id,
        'title': quiz.title,
        'questions': [q.to_dict(hide_answer=hide_answers) for q in quiz.questions]
    })


@quiz_bp.route('/submit', methods=['POST'])
@jwt_required()
@require_json
def submit_quiz():
    """Quiz sonucunu kaydet"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    quiz_id = data.get('quiz_id')
    score = data.get('score')
    total_questions = data.get('total_questions')
    test_type = data.get('test_type', 'quiz')
    
    if score is None or total_questions is None:
        return error_response("score ve total_questions gereklidir.")
    
    try:
        score = int(score)
        total_questions = int(total_questions)
        
        if score < 0 or total_questions < 1:
            return error_response("Geçersiz score veya total_questions değeri.")
        
        if score > total_questions:
            return error_response("Score, toplam soru sayısından büyük olamaz.")
    except ValueError:
        return error_response("Geçersiz sayısal değerler.")
    
    # Verify quiz exists if quiz_id provided
    if quiz_id:
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return error_response("Quiz bulunamadı.", 404)
    
    # Save result
    result = TestResult(
        user_id=user_id,
        quiz_id=quiz_id,
        test_type=test_type,
        score=score,
        total_questions=total_questions,
        percentage=(score / total_questions * 100) if total_questions > 0 else 0,
        completed_at=datetime.utcnow()
    )
    
    db.session.add(result)
    db.session.commit()
    
    logger.info(f"User {user_id} submitted quiz result: {score}/{total_questions}")
    
    return success_response(
        data={'result': result.to_dict()},
        message="Quiz sonucu kaydedildi.",
        status_code=201
    )


@quiz_bp.route('/history', methods=['GET'])
@jwt_required()
def get_quiz_history():
    """Kullanıcının quiz geçmişini getir"""
    user_id = get_jwt_identity()
    
    page, per_page = validate_pagination(
        request.args.get('page'),
        request.args.get('per_page')
    )
    
    query = TestResult.query.filter_by(user_id=user_id).order_by(
        TestResult.completed_at.desc()
    )
    
    result = paginate_query(query, page=page, per_page=per_page)
    
    return success_response(data={
        'history': [r.to_dict() for r in result['items']],
        'pagination': result['pagination']
    })


@quiz_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_quiz_stats():
    """Kullanıcının quiz istatistiklerini getir"""
    user_id = get_jwt_identity()
    
    results = TestResult.query.filter_by(user_id=user_id).all()
    
    if not results:
        return success_response(data={
            'stats': {
                'total_quizzes': 0,
                'average_score': 0,
                'best_score': 0,
                'total_questions_answered': 0
            }
        })
    
    total_quizzes = len(results)
    total_score = sum(r.score for r in results)
    total_questions = sum(r.total_questions for r in results)
    average_percentage = sum(r.percentage or 0 for r in results) / total_quizzes
    best_percentage = max(r.percentage or 0 for r in results)
    
    return success_response(data={
        'stats': {
            'total_quizzes': total_quizzes,
            'average_score': round(average_percentage, 1),
            'best_score': round(best_percentage, 1),
            'total_questions_answered': total_questions,
            'total_correct': total_score
        }
    })
