"""
Input validation utilities for the Talkify API
"""
import re


def validate_email(email):
    """
    E-posta adresini doğrula
    
    Args:
        email: Doğrulanacak e-posta
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not email:
        return False, "E-posta adresi gereklidir."
    
    email = email.strip().lower()
    
    # Basit regex kontrolü
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        return False, "Geçersiz e-posta formatı."
    
    if len(email) > 120:
        return False, "E-posta adresi çok uzun (maks. 120 karakter)."
    
    return True, None


def validate_password(password, min_length=6):
    """
    Şifreyi doğrula
    
    Args:
        password: Doğrulanacak şifre
        min_length: Minimum uzunluk (default 6)
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not password:
        return False, "Şifre gereklidir."
    
    if len(password) < min_length:
        return False, f"Şifre en az {min_length} karakter olmalıdır."
    
    if len(password) > 128:
        return False, "Şifre çok uzun (maks. 128 karakter)."
    
    # En az bir harf ve bir rakam
    if not re.search(r'[A-Za-z]', password):
        return False, "Şifre en az bir harf içermelidir."
    
    if not re.search(r'[0-9]', password):
        return False, "Şifre en az bir rakam içermelidir."
    
    return True, None


def validate_username(username):
    """
    Kullanıcı adını doğrula
    
    Args:
        username: Doğrulanacak kullanıcı adı
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not username:
        return True, None  # Kullanıcı adı opsiyonel
    
    username = username.strip()
    
    if len(username) < 2:
        return False, "Kullanıcı adı en az 2 karakter olmalıdır."
    
    if len(username) > 80:
        return False, "Kullanıcı adı çok uzun (maks. 80 karakter)."
    
    # Sadece harf, rakam, alt çizgi ve tire
    if not re.match(r'^[a-zA-Z0-9_-]+$', username):
        return False, "Kullanıcı adı sadece harf, rakam, alt çizgi ve tire içerebilir."
    
    return True, None


def validate_pagination(page, per_page, max_per_page=100):
    """
    Sayfalama parametrelerini doğrula ve düzelt
    
    Args:
        page: Sayfa numarası
        per_page: Sayfa başına öğe
        max_per_page: Maksimum sayfa başına öğe
        
    Returns:
        tuple: (page, per_page)
    """
    try:
        page = int(page) if page else 1
        page = max(1, page)
    except (ValueError, TypeError):
        page = 1
    
    try:
        per_page = int(per_page) if per_page else 20
        per_page = min(max(1, per_page), max_per_page)
    except (ValueError, TypeError):
        per_page = 20
    
    return page, per_page


def validate_level(level):
    """
    Dil seviyesini doğrula
    
    Args:
        level: Dil seviyesi (A1, A2, B1, B2, C1, C2)
        
    Returns:
        tuple: (is_valid, normalized_level or error_message)
    """
    valid_levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    
    if not level:
        return True, 'A1'  # Default
    
    level = level.upper().strip()
    
    if level not in valid_levels:
        return False, f"Geçersiz seviye. Geçerli seviyeler: {', '.join(valid_levels)}"
    
    return True, level
