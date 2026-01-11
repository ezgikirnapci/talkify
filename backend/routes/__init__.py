"""
Routes package for the Talkify API
Registers all blueprints for modular routing
"""
from flask import Blueprint

from routes.auth import auth_bp
from routes.words import words_bp
from routes.quiz import quiz_bp
from routes.progress import progress_bp
from routes.admin import admin_bp
from routes.chat import chat_bp
from routes.gamification import gamification_bp


def register_blueprints(app):
    """Register all blueprints with the Flask app"""
    
    # API prefix
    api_prefix = '/api'
    
    # Register auth routes
    app.register_blueprint(auth_bp, url_prefix=f'{api_prefix}/auth')
    
    # Register words routes
    app.register_blueprint(words_bp, url_prefix=f'{api_prefix}/words')
    
    # Register quiz routes
    app.register_blueprint(quiz_bp, url_prefix=f'{api_prefix}/quiz')
    
    # Register progress routes
    app.register_blueprint(progress_bp, url_prefix=f'{api_prefix}/progress')
    
    # Register admin routes
    app.register_blueprint(admin_bp, url_prefix=f'{api_prefix}/admin')
    
    # Register chat routes
    app.register_blueprint(chat_bp, url_prefix=f'{api_prefix}/chat')
    
    # Register gamification routes
    app.register_blueprint(gamification_bp, url_prefix=f'{api_prefix}/gamification')


__all__ = [
    'register_blueprints',
    'auth_bp',
    'words_bp',
    'quiz_bp',
    'progress_bp',
    'admin_bp'
]

