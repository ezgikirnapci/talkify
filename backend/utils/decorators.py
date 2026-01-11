"""
Security decorators for the Talkify API
"""
import os
import logging
from functools import wraps
from flask import request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from utils.helpers import error_response

logger = logging.getLogger(__name__)

# Admin key for simple authentication (set in .env)
ADMIN_SECRET_KEY = os.environ.get('ADMIN_SECRET_KEY', 'admin-dev-key-change-in-production')


def admin_required(f):
    """
    Decorator to require admin authentication.
    Checks for either:
    1. X-Admin-Key header with correct admin secret
    2. JWT token from an admin user (optional, for future use)
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check for admin key in header
        admin_key = request.headers.get('X-Admin-Key')
        
        if admin_key and admin_key == ADMIN_SECRET_KEY:
            return f(*args, **kwargs)
        
        # If no admin key, check for JWT (optional future enhancement)
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            # Here you could check if user is admin in database
            # For now, JWT alone is not sufficient for admin access
            logger.warning(f"Admin access attempt with JWT by user {user_id}")
        except:
            pass
        
        logger.warning(f"Unauthorized admin access attempt from {request.remote_addr}")
        return error_response("Yetkisiz erişim. Admin anahtarı gerekli.", 403)
    
    return decorated_function


def rate_limit(max_requests=60, per_seconds=60):
    """
    Simple rate limiting decorator (in-memory, for development)
    For production, use flask-limiter with Redis
    """
    requests = {}
    
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            from datetime import datetime, timedelta
            
            client_ip = request.remote_addr
            now = datetime.utcnow()
            
            # Clean old entries
            cutoff = now - timedelta(seconds=per_seconds)
            requests[client_ip] = [
                t for t in requests.get(client_ip, [])
                if t > cutoff
            ]
            
            # Check limit
            if len(requests.get(client_ip, [])) >= max_requests:
                return error_response("Çok fazla istek. Lütfen bekleyin.", 429)
            
            # Record request
            if client_ip not in requests:
                requests[client_ip] = []
            requests[client_ip].append(now)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
