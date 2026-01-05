from app import app
from models import db, Content

def seed_data():
    with app.app_context():
        # Force seed
        pass

        # Add some sample content
        contents = [
            Content(
                type="vocabulary",
                title="Greetings",
                data={"word": "Hello", "meaning": "Merhaba", "example": "Hello, how are you?"},
                difficulty="A1"
            ),
            Content(
                type="grammar",
                title="Present Simple",
                data={"rule": "Used for habits and general truths.", "structure": "Subject + Verb(s/es)"},
                difficulty="A1"
            ),
            Content(
                type="vocabulary",
                title="Advanced Adjectives",
                data={"word": "Breathtaking", "meaning": "Nefes kesici", "example": "The scenery was breathtaking."},
                difficulty="B2"
            ),
            Content(
                type="test",
                title="Mini Quiz A1",
                data={
                    "questions": [
                        {"q": "How do you say 'Book' in Turkish?", "a": "Kitap"},
                        {"q": "What is the past form of 'go'?", "a": "went"}
                    ]
                },
                difficulty="A1"
            )
        ]

        from models import User
        test_user = User(email="test@gmail.com", username="testuser")
        test_user.set_password("Test1234!")
        db.session.add(test_user)
        
        db.session.add_all(contents)
        db.session.commit()
        print("Database seeded with sample content and test user successfully!")

if __name__ == "__main__":
    seed_data()
