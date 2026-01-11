"""
Seed data script for the Talkify database
Creates sample data for testing and development
"""
from datetime import date
from app import create_app
from models import db, User, Word, GrammarContent, Quiz, QuizQuestion, Content


def seed_data():
    """Seed the database with sample data"""
    app = create_app()
    
    with app.app_context():
        print("Starting database seeding...")
        
        # Clear existing data (optional, comment out in production)
        # db.drop_all()
        # db.create_all()
        
        # Seed words
        seed_words()
        
        # Seed grammar content
        seed_grammar()
        
        # Seed quizzes
        seed_quizzes()
        
        # Seed legacy content
        seed_legacy_content()
        
        # Seed test user
        seed_test_user()
        
        print("Database seeded successfully!")


def seed_words():
    """Seed vocabulary words"""
    words = [
        # A1 Level - Greetings
        {"word": "Hello", "meaning": "Merhaba", "category": "Greeting", "level": "A1", 
         "example_sentence": "Hello, how are you?", "example_translation": "Merhaba, nasılsın?"},
        {"word": "Goodbye", "meaning": "Hoşça kal / Güle güle", "category": "Greeting", "level": "A1",
         "example_sentence": "Goodbye, see you tomorrow!", "example_translation": "Hoşça kal, yarın görüşürüz!"},
        {"word": "Thank you", "meaning": "Teşekkür ederim", "category": "Greeting", "level": "A1",
         "example_sentence": "Thank you for your help.", "example_translation": "Yardımın için teşekkür ederim."},
        {"word": "Please", "meaning": "Lütfen", "category": "Greeting", "level": "A1",
         "example_sentence": "Please sit down.", "example_translation": "Lütfen oturun."},
        {"word": "Sorry", "meaning": "Özür dilerim", "category": "Greeting", "level": "A1",
         "example_sentence": "I'm sorry for being late.", "example_translation": "Geç kaldığım için özür dilerim."},
        
        # A1 Level - Objects
        {"word": "Book", "meaning": "Kitap", "category": "Object", "level": "A1",
         "example_sentence": "I love reading books.", "example_translation": "Kitap okumayı seviyorum."},
        {"word": "Water", "meaning": "Su", "category": "Nature", "level": "A1",
         "example_sentence": "Please give me a glass of water.", "example_translation": "Lütfen bana bir bardak su verin."},
        {"word": "Food", "meaning": "Yemek", "category": "Object", "level": "A1",
         "example_sentence": "The food is delicious.", "example_translation": "Yemek lezzetli."},
        {"word": "House", "meaning": "Ev", "category": "Place", "level": "A1",
         "example_sentence": "This is my house.", "example_translation": "Bu benim evim."},
        {"word": "School", "meaning": "Okul", "category": "Place", "level": "A1",
         "example_sentence": "I go to school every day.", "example_translation": "Her gün okula giderim."},
        
        # A2 Level - Emotions
        {"word": "Happy", "meaning": "Mutlu", "category": "Emotion", "level": "A2",
         "example_sentence": "I'm happy to see you.", "example_translation": "Seni gördüğüme mutluyum."},
        {"word": "Sad", "meaning": "Üzgün", "category": "Emotion", "level": "A2",
         "example_sentence": "She looks sad today.", "example_translation": "Bugün üzgün görünüyor."},
        {"word": "Angry", "meaning": "Kızgın", "category": "Emotion", "level": "A2",
         "example_sentence": "Don't be angry with me.", "example_translation": "Bana kızma."},
        {"word": "Tired", "meaning": "Yorgun", "category": "Emotion", "level": "A2",
         "example_sentence": "I'm very tired today.", "example_translation": "Bugün çok yorgunum."},
        {"word": "Excited", "meaning": "Heyecanlı", "category": "Emotion", "level": "A2",
         "example_sentence": "I'm excited about the trip.", "example_translation": "Gezi için heyecanlıyım."},
        
        # B1 Level - Abstract
        {"word": "Freedom", "meaning": "Özgürlük", "category": "Abstract", "level": "B1",
         "example_sentence": "Freedom is a fundamental human right.", "example_translation": "Özgürlük temel bir insan hakkıdır."},
        {"word": "Courage", "meaning": "Cesaret", "category": "Character", "level": "B1",
         "example_sentence": "It takes courage to speak the truth.", "example_translation": "Doğruyu söylemek cesaret gerektirir."},
        {"word": "Persistence", "meaning": "Azim, kararlılık", "category": "Character", "level": "B1",
         "example_sentence": "Success requires persistence.", "example_translation": "Başarı azim gerektirir."},
        {"word": "Wisdom", "meaning": "Bilgelik", "category": "Abstract", "level": "B1",
         "example_sentence": "Wisdom comes with experience.", "example_translation": "Bilgelik deneyimle gelir."},
        {"word": "Hope", "meaning": "Umut", "category": "Emotion", "level": "B1",
         "example_sentence": "Never lose hope.", "example_translation": "Umudunu asla kaybetme."},
        
        # B1 Level - Adjectives
        {"word": "Beautiful", "meaning": "Güzel", "category": "Adjective", "level": "B1",
         "example_sentence": "She has a beautiful smile.", "example_translation": "Onun güzel bir gülümsemesi var."},
        {"word": "Intelligent", "meaning": "Zeki", "category": "Adjective", "level": "B1",
         "example_sentence": "He is an intelligent student.", "example_translation": "O zeki bir öğrenci."},
        {"word": "Generous", "meaning": "Cömert", "category": "Character", "level": "B1",
         "example_sentence": "She is a generous person.", "example_translation": "O cömert bir insan."},
        
        # B2 Level - Advanced
        {"word": "Sophisticated", "meaning": "Sofistike, karmaşık", "category": "Adjective", "level": "B2",
         "example_sentence": "This is a sophisticated system.", "example_translation": "Bu sofistike bir sistem."},
        {"word": "Ambiguous", "meaning": "Belirsiz, muğlak", "category": "Adjective", "level": "B2",
         "example_sentence": "The answer was ambiguous.", "example_translation": "Cevap belirsizdi."},
        {"word": "Comprehensive", "meaning": "Kapsamlı", "category": "Adjective", "level": "B2",
         "example_sentence": "We need a comprehensive plan.", "example_translation": "Kapsamlı bir plana ihtiyacımız var."},
        {"word": "Inevitable", "meaning": "Kaçınılmaz", "category": "Adjective", "level": "B2",
         "example_sentence": "Change is inevitable.", "example_translation": "Değişim kaçınılmazdır."},
        {"word": "Resilience", "meaning": "Dayanıklılık", "category": "Abstract", "level": "B2",
         "example_sentence": "Resilience helps us overcome challenges.", "example_translation": "Dayanıklılık zorlukları aşmamıza yardımcı olur."},
        
        # C1 Level - Academic
        {"word": "Paradigm", "meaning": "Paradigma, model", "category": "Academic", "level": "C1",
         "example_sentence": "This represents a paradigm shift.", "example_translation": "Bu bir paradigma değişikliğini temsil ediyor."},
        {"word": "Juxtaposition", "meaning": "Yan yana koyma", "category": "Academic", "level": "C1",
         "example_sentence": "The juxtaposition of ideas is interesting.", "example_translation": "Fikirlerin yan yana konulması ilginç."},
        {"word": "Ubiquitous", "meaning": "Her yerde bulunan", "category": "Adjective", "level": "C1",
         "example_sentence": "Smartphones are now ubiquitous.", "example_translation": "Akıllı telefonlar artık her yerde."},
    ]
    
    for word_data in words:
        existing = Word.query.filter_by(word=word_data['word']).first()
        if not existing:
            word = Word(**word_data)
            db.session.add(word)
    
    db.session.commit()
    print(f"Seeded {len(words)} words")


def seed_grammar():
    """Seed grammar content"""
    grammar_items = [
        {
            "title": "Present Simple Tense",
            "level": "A1",
            "category": "Tense",
            "content": """
Present Simple, alışkanlıklar, genel doğrular ve tekrarlayan eylemler için kullanılır.

**Yapı:** Subject + Verb (+ s/es for he/she/it)

**Örnekler:**
- I go to school every day. (Her gün okula giderim.)
- She works in a hospital. (O bir hastanede çalışır.)
- Water boils at 100°C. (Su 100°C'de kaynar.)

**Zaman Zarfları:** always, usually, often, sometimes, never, every day/week/month
            """
        },
        {
            "title": "Present Continuous Tense",
            "level": "A1",
            "category": "Tense",
            "content": """
Present Continuous, şu anda gerçekleşen veya geçici durumlar için kullanılır.

**Yapı:** Subject + am/is/are + Verb-ing

**Örnekler:**
- I am reading a book. (Bir kitap okuyorum.)
- They are playing football. (Futbol oynuyorlar.)
- She is studying English this semester. (Bu dönem İngilizce çalışıyor.)

**Zaman Zarfları:** now, right now, at the moment, currently
            """
        },
        {
            "title": "Past Simple Tense",
            "level": "A2",
            "category": "Tense",
            "content": """
Past Simple, geçmişte tamamlanmış eylemler için kullanılır.

**Yapı:** Subject + Verb-ed (regular) / V2 (irregular)

**Örnekler:**
- I visited my grandmother last week. (Geçen hafta babaannemi ziyaret ettim.)
- She went to Paris in 2019. (2019'da Paris'e gitti.)
- They didn't come to the party. (Partiye gelmediler.)

**Düzensiz Fiiller:** go-went, see-saw, eat-ate, buy-bought
            """
        },
        {
            "title": "Modal Verbs",
            "level": "B1",
            "category": "Modal",
            "content": """
Modal fiiller, olasılık, yetenek, izin ve zorunluluk ifade eder.

**Can:** Yetenek veya izin
- I can swim. (Yüzebilirim.)
- Can I go now? (Şimdi gidebilir miyim?)

**Must:** Zorunluluk
- You must wear a seatbelt. (Emniyet kemeri takmalısın.)

**Should:** Tavsiye
- You should study more. (Daha çok çalışmalısın.)

**May/Might:** Olasılık
- It might rain tomorrow. (Yarın yağmur yağabilir.)
            """
        },
    ]
    
    for item in grammar_items:
        existing = GrammarContent.query.filter_by(title=item['title']).first()
        if not existing:
            grammar = GrammarContent(**item)
            db.session.add(grammar)
    
    db.session.commit()
    print(f"Seeded {len(grammar_items)} grammar items")


def seed_quizzes():
    """Seed quizzes and questions"""
    # Create vocabulary quiz
    vocab_quiz = Quiz.query.filter_by(title="Temel Kelimeler Testi").first()
    if not vocab_quiz:
        vocab_quiz = Quiz(
            title="Temel Kelimeler Testi",
            description="A1-A2 seviye temel kelime bilginizi test edin.",
            level="A1",
            category="Vocabulary"
        )
        db.session.add(vocab_quiz)
        db.session.commit()
        
        vocab_questions = [
            {
                "question": "'Hello' kelimesi ne anlama gelir?",
                "options": ["Güle güle", "Merhaba", "Teşekkürler", "Özür dilerim"],
                "correct_answer": 1,
                "explanation": "'Hello' İngilizce'de selamlama için kullanılır ve Türkçe'de 'Merhaba' anlamına gelir."
            },
            {
                "question": "'Book' kelimesinin Türkçe karşılığı nedir?",
                "options": ["Masa", "Kitap", "Kalem", "Defter"],
                "correct_answer": 1,
                "explanation": "'Book' İngilizce'de 'Kitap' anlamına gelir."
            },
            {
                "question": "'Thank you' ne zaman kullanılır?",
                "options": ["Özür dilemek için", "Selamlamak için", "Teşekkür etmek için", "Vedalaşmak için"],
                "correct_answer": 2,
                "explanation": "'Thank you' birine teşekkür etmek için kullanılır."
            },
            {
                "question": "'Goodbye' kelimesinin doğru çevirisi hangisidir?",
                "options": ["Merhaba", "Güle güle", "Teşekkürler", "Lütfen"],
                "correct_answer": 1,
                "explanation": "'Goodbye' vedalaşırken kullanılır ve 'Güle güle' anlamına gelir."
            },
            {
                "question": "Hangi kelime 'Happy' anlamına gelir?",
                "options": ["Üzgün", "Mutlu", "Kızgın", "Yorgun"],
                "correct_answer": 1,
                "explanation": "'Happy' duygusal bir sıfat olup 'Mutlu' anlamına gelir."
            },
        ]
        
        for q_data in vocab_questions:
            question = QuizQuestion(quiz_id=vocab_quiz.id, **q_data)
            db.session.add(question)
    
    # Create B1 level quiz
    b1_quiz = Quiz.query.filter_by(title="Orta Seviye Sınav").first()
    if not b1_quiz:
        b1_quiz = Quiz(
            title="Orta Seviye Sınav",
            description="B1 seviye kelime ve kavram bilginizi test edin.",
            level="B1",
            category="Vocabulary"
        )
        db.session.add(b1_quiz)
        db.session.commit()
        
        b1_questions = [
            {
                "question": "'Persistence' kelimesi ne anlama gelir?",
                "options": ["Sabırsızlık", "Azim, kararlılık", "Kayıtsızlık", "Tembellik"],
                "correct_answer": 1,
                "explanation": "'Persistence' zorluklara rağmen devam etme anlamında 'Azim' veya 'Kararlılık' olarak çevrilir."
            },
            {
                "question": "'Courage' kelimesinin Türkçe karşılığı nedir?",
                "options": ["Korku", "Cesaret", "Üzüntü", "Mutluluk"],
                "correct_answer": 1,
                "explanation": "'Courage' korkutucu şeyleri yapabilme gücü anlamında 'Cesaret' olarak çevrilir."
            },
            {
                "question": "'Freedom' ne demektir?",
                "options": ["Esaret", "Özgürlük", "Bağımlılık", "Kısıtlama"],
                "correct_answer": 1,
                "explanation": "'Freedom' istediği gibi hareket etme hakkı anlamında 'Özgürlük' demektir."
            },
            {
                "question": "'Wisdom' kelimesi hangi anlama gelir?",
                "options": ["Aptallık", "Bilgelik", "Gençlik", "Cahillik"],
                "correct_answer": 1,
                "explanation": "'Wisdom' deneyim ve bilgiye dayalı doğru karar verme yeteneği anlamında 'Bilgelik' demektir."
            },
            {
                "question": "'Generous' sıfatı ne anlama gelir?",
                "options": ["Cimri", "Cömert", "Kibirli", "Korkak"],
                "correct_answer": 1,
                "explanation": "'Generous' başkalarına verme eğiliminde olan kişileri tanımlar ve 'Cömert' anlamına gelir."
            },
        ]
        
        for q_data in b1_questions:
            question = QuizQuestion(quiz_id=b1_quiz.id, **q_data)
            db.session.add(question)
    
    db.session.commit()
    print("Seeded quizzes with questions")


def seed_legacy_content():
    """Seed legacy Content model for backward compatibility"""
    contents = [
        {
            "type": "vocabulary",
            "title": "Greetings",
            "data": {"word": "Hello", "meaning": "Merhaba", "example": "Hello, how are you?"},
            "difficulty": "A1"
        },
        {
            "type": "grammar",
            "title": "Present Simple",
            "data": {"rule": "Used for habits and general truths.", "structure": "Subject + Verb(s/es)"},
            "difficulty": "A1"
        },
        {
            "type": "vocabulary",
            "title": "Advanced Adjectives",
            "data": {"word": "Breathtaking", "meaning": "Nefes kesici", "example": "The scenery was breathtaking."},
            "difficulty": "B2"
        },
        {
            "type": "test",
            "title": "Mini Quiz A1",
            "data": {
                "questions": [
                    {"q": "How do you say 'Book' in Turkish?", "a": "Kitap"},
                    {"q": "What is the past form of 'go'?", "a": "went"}
                ]
            },
            "difficulty": "A1"
        }
    ]
    
    for content_data in contents:
        existing = Content.query.filter_by(title=content_data['title']).first()
        if not existing:
            content = Content(**content_data)
            db.session.add(content)
    
    db.session.commit()
    print(f"Seeded {len(contents)} legacy content items")


def seed_test_user():
    """Create a test user for development"""
    test_user = User.query.filter_by(email="test@gmail.com").first()
    if not test_user:
        test_user = User(
            email="test@gmail.com",
            username="testuser",
            language_level="A1",
            daily_goal=10
        )
        test_user.set_password("Test1234!")
        db.session.add(test_user)
        db.session.commit()
        print("Created test user: test@gmail.com / Test1234!")
    else:
        print("Test user already exists")


if __name__ == "__main__":
    seed_data()
