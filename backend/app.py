import warnings
# Suppress the specific get_engine deprecation until Flask-SQLAlchemy/SQLAlchemy are upgraded
warnings.filterwarnings(
    "ignore",
    category=DeprecationWarning,
    message=r".*get_engine.*deprecated.*"
)

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from routes import api

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    jwt = JWTManager(app)

    # Register Blueprints
    app.register_blueprint(api, url_prefix='/api')

    # Create Database tables
    with app.app_context():
        db.create_all()
        # Try to add firebase_uid column for existing DBs if missing (safe for SQLite/Postgres)
        try:
            # Use the engine property (db.get_engine() is deprecated in newer Flask-SQLAlchemy)
            engine = db.engine
            from sqlalchemy import text

            # Use a transaction/connection and SQLAlchemy's text() to execute DDL safely
            if engine.dialect.name == 'sqlite':
                try:
                    with engine.begin() as conn:
                        conn.execute(text('ALTER TABLE users ADD COLUMN firebase_uid VARCHAR(128)'))
                    app.logger.info('Added firebase_uid column to users table')
                except Exception:
                    # Column probably exists; ignore
                    pass
            else:
                try:
                    with engine.begin() as conn:
                        conn.execute(text('ALTER TABLE users ADD COLUMN firebase_uid VARCHAR(128)'))
                    app.logger.info('Added firebase_uid column to users table')
                except Exception:
                    pass
        except Exception as e:
            app.logger.error(f'Error while ensuring firebase_uid column exists: {e}')

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
