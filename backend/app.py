"""
Talkify API - Flask Application Entry Point
"""
import os
import logging
from logging.handlers import RotatingFileHandler

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from dotenv import load_dotenv

from config import get_config
from models import db

# Load environment variables
load_dotenv()


def create_app(config_class=None):
    """
    Application factory function
    
    Args:
        config_class: Configuration class to use (optional)
        
    Returns:
        Flask application instance
    """
    app = Flask(__name__)
    
    # Load configuration
    if config_class:
        app.config.from_object(config_class)
    else:
        app.config.from_object(get_config())
    
    # Setup logging
    setup_logging(app)
    
    # Initialize Extensions
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config.get('CORS_ORIGINS', '*'),
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'message': 'Oturum süresi doldu. Lütfen tekrar giriş yapın.'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'success': False,
            'message': 'Geçersiz token.'
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'success': False,
            'message': 'Yetkilendirme gerekli.'
        }), 401
    
    # Register Blueprints
    from routes import register_blueprints
    register_blueprints(app)
    
    # Legacy routes for backward compatibility
    register_legacy_routes(app)
    
    # Admin panel static files
    register_admin_routes(app)
    
    # Error handlers
    register_error_handlers(app)
    
    # Create Database tables
    with app.app_context():
        db.create_all()
        app.logger.info("Database tables created successfully")
    
    app.logger.info("Talkify API initialized successfully")
    
    return app


def setup_logging(app):
    """Setup logging configuration"""
    log_level = getattr(logging, app.config.get('LOG_LEVEL', 'INFO'))
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(log_level)
    console_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(console_formatter)
    
    # File handler (optional, in logs directory)
    logs_dir = os.path.join(os.path.dirname(__file__), 'logs')
    if not os.path.exists(logs_dir):
        os.makedirs(logs_dir)
    
    file_handler = RotatingFileHandler(
        os.path.join(logs_dir, 'talkify.log'),
        maxBytes=1024 * 1024,  # 1MB
        backupCount=10
    )
    file_handler.setLevel(log_level)
    file_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    file_handler.setFormatter(file_formatter)
    
    # Apply to app logger
    app.logger.addHandler(console_handler)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(log_level)
    
    # Apply to root logger for other modules
    logging.getLogger().addHandler(console_handler)
    logging.getLogger().setLevel(log_level)


def register_legacy_routes(app):
    """Register legacy routes for backward compatibility with existing frontend"""
    from flask import Blueprint, request
    from flask_jwt_extended import jwt_required, get_jwt_identity
    from datetime import datetime
    from models import User, Content, TestResult
    from utils.helpers import success_response, error_response
    
    legacy_bp = Blueprint('legacy', __name__)
    
    @legacy_bp.route('/get-content', methods=['GET'])
    def get_content():
        """Legacy content endpoint"""
        difficulty = request.args.get('difficulty')
        content_type = request.args.get('type')
        
        query = Content.query
        if difficulty:
            query = query.filter_by(difficulty=difficulty)
        if content_type:
            query = query.filter_by(type=content_type)
        
        contents = query.all()
        return jsonify([c.to_dict() for c in contents]), 200
    
    @legacy_bp.route('/sync-results', methods=['POST'])
    @jwt_required()
    def sync_results():
        """Legacy results sync endpoint"""
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not isinstance(data, list):
            return jsonify({"msg": "Input should be a list of results"}), 400
        
        results_added = 0
        for item in data:
            new_result = TestResult(
                user_id=user_id,
                score=item.get('score', 0),
                total_questions=item.get('total_questions', 1),
                completed_at=datetime.strptime(
                    item.get('completed_at'), '%Y-%m-%dT%H:%M:%S'
                ) if item.get('completed_at') else datetime.utcnow()
            )
            db.session.add(new_result)
            results_added += 1
        
        db.session.commit()
        return jsonify({"msg": f"Successfully synced {results_added} results"}), 201
    
    # Debug routes (only in development)
    if app.debug:
        @legacy_bp.route('/debug/config', methods=['GET'])
        def debug_config():
            return jsonify({
                "SQLALCHEMY_DATABASE_URI": app.config.get('SQLALCHEMY_DATABASE_URI')
            }), 200
        
        @legacy_bp.route('/debug/users', methods=['GET'])
        def debug_users():
            users = User.query.all()
            return jsonify([{
                "id": u.id,
                "email": u.email,
                "username": u.username,
                "firebase_uid": u.firebase_uid
            } for u in users]), 200
    
    app.register_blueprint(legacy_bp, url_prefix='/api')


def register_error_handlers(app):
    """Register global error handlers"""
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'success': False,
            'message': 'Geçersiz istek.'
        }), 400
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'message': 'Kaynak bulunamadı.'
        }), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            'success': False,
            'message': 'Bu HTTP metodu desteklenmiyor.'
        }), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        app.logger.error(f"Internal server error: {error}")
        return jsonify({
            'success': False,
            'message': 'Sunucu hatası oluştu.'
        }), 500


def register_admin_routes(app):
    """Register admin panel static file routes"""
    from flask import send_from_directory
    
    admin_folder = os.path.join(os.path.dirname(__file__), 'admin')
    
    @app.route('/admin/')
    @app.route('/admin/<path:filename>')
    def serve_admin(filename='index.html'):
        """Serve admin panel static files"""
        return send_from_directory(admin_folder, filename)
    
    @app.route('/admin/css/<path:filename>')
    def serve_admin_css(filename):
        """Serve admin CSS files"""
        return send_from_directory(os.path.join(admin_folder, 'css'), filename)
    
    @app.route('/admin/js/<path:filename>')
    def serve_admin_js(filename):
        """Serve admin JS files"""
        return send_from_directory(os.path.join(admin_folder, 'js'), filename)


# Create app instance
app = create_app()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
