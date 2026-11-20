"""
MedICARE AI - Secure Authentication & Authorization Core
Implements:
- Unique per-password salt hashing via bcrypt / argon2id
- Validated JWT encoding and decoding with algorithm pinning
- Role-Based Access Control (RBAC) dependencies
"""

import os
import time
import secrets
import hashlib
import hmac
import base64
import json
from datetime import datetime, timedelta, timezone
from typing import Optional, List

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db

# OAuth2 Bearer token extractor
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Password Hashing Strategy
try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    _USE_PASSLIB = True
except ImportError:
    _USE_PASSLIB = False

def get_password_hash(password: str) -> str:
    """Generate secure hash with a unique, cryptographically random salt per password."""
    if _USE_PASSLIB:
        return pwd_context.hash(password)
    
    # Cryptographically secure fallback: 16-byte random salt per password
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"$pbkdf2-sha256$100000${salt}${key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against stored hash using constant-time comparison."""
    if _USE_PASSLIB and not hashed_password.startswith("$pbkdf2-sha256$"):
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            pass
            
    # Check if hash uses our per-password unique salt format
    if hashed_password.startswith("$pbkdf2-sha256$"):
        try:
            parts = hashed_password.split("$")
            # format: ['', 'pbkdf2-sha256', '100000', salt, hash]
            iterations = int(parts[2])
            salt = parts[3]
            expected_hash = parts[4]
            key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), iterations)
            return hmac.compare_digest(key.hex(), expected_hash)
        except Exception:
            return False

    # Legacy demo hash compatibility check
    legacy_key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), b"medicare_salt", 100000)
    if hmac.compare_digest(legacy_key.hex(), hashed_password):
        return True

    return False

# JWT Implementation with Jose / Cryptographic Validation
try:
    from jose import jwt, JWTError
    _USE_JOSE = True
except ImportError:
    _USE_JOSE = False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create signed JWT access token with expiration and required claims."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({
        "exp": int(expire.timestamp()),
        "iat": int(now.timestamp()),
        "iss": "medicare-ai-auth"
    })
    
    if _USE_JOSE:
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        
    # Standard compliant fallback with algorithm pinning
    header = {"alg": settings.ALGORITHM, "typ": "JWT"}
    h_b64 = base64.urlsafe_b64encode(json.dumps(header, separators=(',', ':')).encode()).decode().rstrip('=')
    p_b64 = base64.urlsafe_b64encode(json.dumps(to_encode, separators=(',', ':')).encode()).decode().rstrip('=')
    
    msg = f"{h_b64}.{p_b64}"
    sig = hmac.new(settings.SECRET_KEY.encode('utf-8'), msg.encode('utf-8'), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(sig).decode().rstrip('=')
    return f"{msg}.{sig_b64}"

def decode_access_token(token: str) -> Optional[dict]:
    """Validate token signature, algorithm pinning, and expiration."""
    if not token or not isinstance(token, str):
        return None
        
    if _USE_JOSE:
        try:
            return jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM],
                options={"verify_exp": True, "verify_signature": True}
            )
        except JWTError:
            return None

    # Cryptographic verification fallback
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        h_b64, p_b64, sig_b64 = parts
        
        # Verify header specifies allowed algorithm (prevent "none" algorithm attack)
        pad_h = '=' * (-len(h_b64) % 4)
        header = json.loads(base64.urlsafe_b64decode(h_b64 + pad_h).decode())
        if header.get("alg") != settings.ALGORITHM:
            return None
            
        # Verify HMAC signature
        msg = f"{h_b64}.{p_b64}"
        expected_sig = hmac.new(settings.SECRET_KEY.encode('utf-8'), msg.encode('utf-8'), hashlib.sha256).digest()
        pad_s = '=' * (-len(sig_b64) % 4)
        actual_sig = base64.urlsafe_b64decode(sig_b64 + pad_s)
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
            
        # Decode and check claims
        pad_p = '=' * (-len(p_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(p_b64 + pad_p).decode())
        
        current_ts = int(datetime.now(timezone.utc).timestamp())
        if "exp" in payload and payload["exp"] < current_ts:
            return None  # Expired
            
        return payload
    except Exception:
        return None

# RBAC Dependencies
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Authenticate bearer token and resolve current user record."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception
        
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
        
    from app.models.models import User
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

def require_roles(allowed_roles: List[str]):
    """Enforce server-side role check."""
    def role_checker(current_user = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Insufficient privileges. Required: {allowed_roles}"
            )
        return current_user
    return role_checker
