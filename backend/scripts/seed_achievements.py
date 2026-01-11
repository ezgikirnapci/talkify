import os
import sys

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models import db, Achievement

app = create_app()

def seed_achievements():
    with app.app_context():
        print("Seeding achievements...")
        
        achievements = [
            {
                "name": "First Steps",
                "description": "Learn your first 10 words.",
                "icon_url": "https://img.icons8.com/color/96/000000/baby-feet.png",
                "requirement_type": "word_count",
                "requirement_value": 10
            },
            {
                "name": "Word Master",
                "description": "Learn 100 words.",
                "icon_url": "https://img.icons8.com/color/96/000000/medal-first-place.png",
                "requirement_type": "word_count",
                "requirement_value": 100
            },
            {
                "name": "Early Bird",
                "description": "Maintain a 3-day learning streak.",
                "icon_url": "https://img.icons8.com/color/96/000000/sun.png",
                "requirement_type": "streak_days",
                "requirement_value": 3
            },
            {
                "name": "Unstoppable",
                "description": "Maintain a 7-day learning streak.",
                "icon_url": "https://img.icons8.com/color/96/000000/fire-element.png",
                "requirement_type": "streak_days",
                "requirement_value": 7
            },
            {
                "name": "Quiz King",
                "description": "Complete 5 quizzes with perfect score.",
                "icon_url": "https://img.icons8.com/color/96/000000/crown.png",
                "requirement_type": "quiz_perfect",
                "requirement_value": 5
            }
        ]
        
        for ach_data in achievements:
            existing = Achievement.query.filter_by(name=ach_data['name']).first()
            if not existing:
                ach = Achievement(**ach_data)
                db.session.add(ach)
                print(f"Added achievement: {ach_data['name']}")
            else:
                print(f"Achievement already exists: {ach_data['name']}")
        
        db.session.commit()
        print("Seeding completed successfully!")

if __name__ == "__main__":
    seed_achievements()
