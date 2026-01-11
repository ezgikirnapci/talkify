"""
Utility helper functions for the Talkify API
"""
from flask import jsonify
from functools import wraps


def success_response(data=None, message=None, status_code=200):
    """
    Standart başarı response formatı
    
    Args:
        data: Döndürülecek veri
        message: Opsiyonel mesaj
        status_code: HTTP status code (default 200)
    
    Returns:
        Flask JSON response
    """
    response = {'success': True}
    if message:
        response['message'] = message
    if data is not None:
        response['data'] = data
    return jsonify(response), status_code


def error_response(message, status_code=400, errors=None):
    """
    Standart hata response formatı
    
    Args:
        message: Hata mesajı
        status_code: HTTP status code (default 400)
        errors: Opsiyonel detaylı hata listesi
    
    Returns:
        Flask JSON response
    """
    response = {
        'success': False,
        'message': message
    }
    if errors:
        response['errors'] = errors
    return jsonify(response), status_code


def paginate_query(query, page=1, per_page=20, max_per_page=100):
    """
    SQLAlchemy sorgusunu sayfalandır
    
    Args:
        query: SQLAlchemy query object
        page: Sayfa numarası (1'den başlar)
        per_page: Sayfa başına öğe sayısı
        max_per_page: Maksimum sayfa başına öğe
    
    Returns:
        dict: Sayfalandırılmış sonuçlar ve meta bilgiler
    """
    # Sınırları kontrol et
    page = max(1, page)
    per_page = min(max(1, per_page), max_per_page)
    
    # Sayfalandır
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return {
        'items': pagination.items,
        'pagination': {
            'page': pagination.page,
            'per_page': pagination.per_page,
            'total_pages': pagination.pages,
            'total_items': pagination.total,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    }


def require_json(f):
    """
    Decorator: İstek JSON içermeli
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from flask import request
        if not request.is_json:
            return error_response("İstek JSON formatında olmalıdır.", 415)
        return f(*args, **kwargs)
    return decorated_function
