from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    """Kullanıcı modeli - Firebase ve local auth desteği"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), nullable=True)
    password_hash = db.Column(db.String(256), nullable=True)
    firebase_uid = db.Column(db.String(128), unique=True, nullable=True, index=True)
    is_admin = db.Column(db.Boolean, default=False)
    
    # Profile fields
    avatar_url = db.Column(db.String(500), nullable=True)
    language_level = db.Column(db.String(10), default='A1')  # A1, A2, B1, B2, C1, C2
    daily_goal = db.Column(db.Integer, default=10)  # Günlük kelime hedefi
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    
    # Gamification
    streak_count = db.Column(db.Integer, default=0)
    last_activity_date = db.Column(db.Date, nullable=True)
    
    # Relationships
    test_results = db.relationship('TestResult', backref='user', lazy=True, cascade='all, delete-orphan')
    progress = db.relationship('UserProgress', backref='user', lazy=True, cascade='all, delete-orphan')
    sessions = db.relationship('LearningSession', backref='user', lazy=True, cascade='all, delete-orphan')
    conversations = db.relationship('Conversation', backref='user', lazy=True, cascade='all, delete-orphan')
    achievements = db.relationship('UserAchievement', backref='user', lazy=True, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'avatar_url': self.avatar_url,
            'language_level': self.language_level,
            'daily_goal': self.daily_goal,
            'streak_count': self.streak_count,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Word(db.Model):
    """Kelime kartları modeli"""
    __tablename__ = 'words'
    
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(100), nullable=False, index=True)
    meaning = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50), nullable=True, index=True)  # Greeting, Emotion, etc.
    level = db.Column(db.String(10), default='A1', index=True)  # A1-C2
    example_sentence = db.Column(db.Text, nullable=True)
    example_translation = db.Column(db.Text, nullable=True)
    pronunciation = db.Column(db.String(200), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    progress = db.relationship('UserProgress', backref='word', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'word': self.word,
            'meaning': self.meaning,
            'category': self.category,
            'level': self.level,
            'example_sentence': self.example_sentence,
            'example_translation': self.example_translation,
            'pronunciation': self.pronunciation
        }


class GrammarContent(db.Model):
    """Gramer içerikleri modeli"""
    __tablename__ = 'grammar_content'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    level = db.Column(db.String(10), default='A1', index=True)
    category = db.Column(db.String(50), nullable=True)  # Tense, Modal, etc.
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'level': self.level,
            'category': self.category
        }


class Quiz(db.Model):
    """Quiz tanımları modeli"""
    __tablename__ = 'quizzes'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    level = db.Column(db.String(10), default='A1', index=True)
    category = db.Column(db.String(50), nullable=True)  # Vocabulary, Grammar, etc.
    is_active = db.Column(db.Boolean, default=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    questions = db.relationship('QuizQuestion', backref='quiz', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_questions=False):
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'level': self.level,
            'category': self.category,
            'question_count': len(self.questions) if self.questions else 0
        }
        if include_questions:
            data['questions'] = [q.to_dict() for q in self.questions]
        return data


class QuizQuestion(db.Model):
    """Quiz soruları modeli"""
    __tablename__ = 'quiz_questions'
    
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False, index=True)
    question = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=False)  # ["option1", "option2", ...]
    correct_answer = db.Column(db.Integer, nullable=False)  # Index of correct option
    explanation = db.Column(db.Text, nullable=True)
    
    def to_dict(self, hide_answer=False):
        data = {
            'id': self.id,
            'question': self.question,
            'options': self.options,
            'explanation': self.explanation
        }
        if not hide_answer:
            data['correct_answer'] = self.correct_answer
        return data


class TestResult(db.Model):
    """Test sonuçları modeli (legacy uyumluluk için)"""
    __tablename__ = 'test_results'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=True)
    test_type = db.Column(db.String(50), nullable=True)  # vocabulary, grammar, etc.
    score = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    percentage = db.Column(db.Float, nullable=True)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    synced = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'quiz_id': self.quiz_id,
            'test_type': self.test_type,
            'score': self.score,
            'total_questions': self.total_questions,
            'percentage': self.percentage or (self.score / self.total_questions * 100 if self.total_questions else 0),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }


class UserProgress(db.Model):
    """Kullanıcının kelime öğrenme ilerlemesi"""
    __tablename__ = 'user_progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    word_id = db.Column(db.Integer, db.ForeignKey('words.id'), nullable=False, index=True)
    
    learned = db.Column(db.Boolean, default=False)
    review_count = db.Column(db.Integer, default=0)
    correct_count = db.Column(db.Integer, default=0)
    last_reviewed = db.Column(db.DateTime, nullable=True)
    next_review = db.Column(db.DateTime, nullable=True)  # Spaced repetition için
    note = db.Column(db.Text, nullable=True)  # Kullanıcı notu
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'word_id', name='unique_user_word'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'word_id': self.word_id,
            'learned': self.learned,
            'review_count': self.review_count,
            'correct_count': self.correct_count,
            'last_reviewed': self.last_reviewed.isoformat() if self.last_reviewed else None
        }


class LearningSession(db.Model):
    """Öğrenme oturumu takibi"""
    __tablename__ = 'learning_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    session_type = db.Column(db.String(50), nullable=False)  # flashcard, quiz, grammar
    
    score = db.Column(db.Integer, nullable=True)
    total_items = db.Column(db.Integer, nullable=True)
    duration_seconds = db.Column(db.Integer, nullable=True)
    
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_type': self.session_type,
            'score': self.score,
            'total_items': self.total_items,
            'duration_seconds': self.duration_seconds,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }


class DailyWord(db.Model):
    """Günün kelimesi"""
    __tablename__ = 'daily_words'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, unique=True, index=True)
    word_id = db.Column(db.Integer, db.ForeignKey('words.id'), nullable=False)
    
    word = db.relationship('Word', backref='daily_word_entries')
    
    @classmethod
    def get_today(cls):
        """Bugünün kelimesini getir, yoksa rastgele ata"""
        today = date.today()
        daily = cls.query.filter_by(date=today).first()
        if not daily:
            # Rastgele bir kelime seç
            random_word = Word.query.order_by(db.func.random()).first()
            if random_word:
                daily = cls(date=today, word_id=random_word.id)
                db.session.add(daily)
                db.session.commit()
        return daily


# Legacy uyumluluk için Content modeli
class Content(db.Model):
    """Eski Content modeli - geriye uyumluluk için"""
    __tablename__ = 'contents'
    
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    data = db.Column(db.JSON, nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'title': self.title,
            'data': self.data,
            'difficulty': self.difficulty
        }


# ==================== NEW MODELS ====================

class Conversation(db.Model):
    """AI Chat Sohbet Grubu"""
    __tablename__ = 'conversations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    title = db.Column(db.String(255), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    messages = db.relationship('ChatMessage', backref='conversation', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'message_count': len(self.messages)
        }


class ChatMessage(db.Model):
    """AI Chat Bireysel Mesaj"""
    __tablename__ = 'chat_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'), nullable=False, index=True)
    role = db.Column(db.String(20), nullable=False)  # 'user' veya 'assistant'
    content = db.Column(db.Text, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'role': self.role,
            'content': self.content,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Achievement(db.Model):
    """Başarı / Rozet Tanımları"""
    __tablename__ = 'achievements'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    icon_url = db.Column(db.String(500), nullable=True)
    
    requirement_type = db.Column(db.String(50), nullable=False)  # 'word_count', 'streak_days', etc.
    requirement_value = db.Column(db.Integer, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon_url': self.icon_url
        }


class UserAchievement(db.Model):
    """Kullanıcının kazandığı başarılar"""
    __tablename__ = 'user_achievements'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    achievement_id = db.Column(db.Integer, db.ForeignKey('achievements.id'), nullable=False)
    
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    achievement = db.relationship('Achievement')
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'achievement_id', name='unique_user_achievement'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'achievement': self.achievement.to_dict(),
            'earned_at': self.earned_at.isoformat() if self.earned_at else None
        }


class Notification(db.Model):
    """Kullanıcı bildirimleri"""
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
