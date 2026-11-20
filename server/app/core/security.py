import hashlib
import hmac
import base64
import json
import time
from datetime import datetime, timedelta
from typing import Optional
from app.core.config import settings

def get_password_hash(password: str) -> str:
    salt = "medicare_salt"
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return key.hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hmac.compare_digest(get_password_hash(plain_password), hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": int(expire.timestamp())})
    
    # Standard header and payload
    header = {"alg": "HS256", "typ": "JWT"}
    h_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip('=')
    p_b64 = base64.urlsafe_b64encode(json.dumps(to_encode).encode()).decode().rstrip('=')
    
    msg = f"{h_b64}.{p_b64}"
    sig = hmac.new(settings.SECRET_KEY.encode(), msg.encode(), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(sig).decode().rstrip('=')
    
    return f"{msg}.{sig_b64}"

def decode_access_token(token: str) -> Optional[dict]:
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        h_b64, p_b64, sig_b64 = parts
        
        # Verify signature
        msg = f"{h_b64}.{p_b64}"
        expected_sig = hmac.new(settings.SECRET_KEY.encode(), msg.encode(), hashlib.sha256).digest()
        pad = '=' * (-len(sig_b64) % 4)
        actual_sig = base64.urlsafe_b64decode(sig_b64 + pad)
        
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
            
        pad_p = '=' * (-len(p_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(p_b64 + pad_p).decode())
        
        if "exp" in payload and payload["exp"] < time.time():
            return None
        return payload
    except Exception:
        return None
