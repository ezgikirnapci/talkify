import os
import sys

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models import db
from sqlalchemy import text

app = create_app()

def update_database():
    with app.app_context():
        print("Starting database update...")
        
        # 1. Ensure all new tables are created
        db.create_all()
        print("New tables created if they didn't exist.")
        
        # 2. Add missing columns to 'users' table (SQLite manual update)
        # Note: SQLite doesn't support IF NOT EXISTS in ALTER TABLE ADD COLUMN
        # so we check if columns exist first.
        
        engine = db.engine
        with engine.connect() as conn:
            # Check for streak_count
            result = conn.execute(text("PRAGMA table_info(users)"))
            columns = [row[1] for row in result]
            
            if 'streak_count' not in columns:
                print("Adding 'streak_count' to 'users' table...")
                conn.execute(text("ALTER TABLE users ADD COLUMN streak_count INTEGER DEFAULT 0"))
            
            if 'last_activity_date' not in columns:
                print("Adding 'last_activity_date' to 'users' table...")
                conn.execute(text("ALTER TABLE users ADD COLUMN last_activity_date DATE"))
            
            if 'is_admin' not in columns:
                print("Adding 'is_admin' to 'users' table...")
                conn.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0"))

            # Check for user_progress
            result = conn.execute(text("PRAGMA table_info(user_progress)"))
            columns = [row[1] for row in result]

            if 'note' not in columns:
                print("Adding 'note' to 'user_progress' table...")
                conn.execute(text("ALTER TABLE user_progress ADD COLUMN note TEXT"))
            
            conn.commit()
            
        print("Database update completed successfully!")

if __name__ == "__main__":
    update_database()
