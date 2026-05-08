import os
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db

SECRET_KEY = os.getenv('SECRET_KEY', 'ecotrack-ai-parth-2026')

def register_user(name, email, password):
    conn = get_db()
    try:
        existing = conn.execute('SELECT id FROM users WHERE email = ?', (email,)).fetchone()
        if existing:
            return None, None, 'Email already registered'

        hashed = generate_password_hash(password)
        conn.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', (name, email, hashed))
        conn.commit()
        user_id = conn.execute('SELECT id FROM users WHERE email = ?', (email,)).fetchone()['id']
        token = _make_token(user_id, name, email)
        return token, {'id': user_id, 'name': name, 'email': email}, None
    except Exception as e:
        return None, None, str(e)
    finally:
        conn.close()

def login_user(email, password):
    conn = get_db()
    try:
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        if not user:
            return None, None, 'No account found with this email'
        if not check_password_hash(user['password'], password):
            return None, None, 'Incorrect password'
        token = _make_token(user['id'], user['name'], user['email'])
        return token, {'id': user['id'], 'name': user['name'], 'email': user['email']}, None
    except Exception as e:
        return None, None, str(e)
    finally:
        conn.close()

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, 'Token expired'
    except jwt.InvalidTokenError:
        return None, 'Invalid token'

def reset_password(email, new_password):
    conn = get_db()
    try:
        user = conn.execute('SELECT id FROM users WHERE email = ?', (email,)).fetchone()
        if not user:
            return False, 'No account found with this email'
        
        hashed = generate_password_hash(new_password)
        conn.execute('UPDATE users SET password = ? WHERE email = ?', (hashed, email))
        conn.commit()
        return True, None
    except Exception as e:
        return False, str(e)
    finally:
        conn.close()

def _make_token(user_id, name, email):
    payload = {
        'user_id': user_id,
        'name': name,
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')
