from jose import JWTError, jwt
from datetime import datetime, timedelta, UTC
from .schemas import TokenData
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from .database import get_db
from sqlalchemy.orm import Session
from .models import User
from .config import get_settings


oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')

settings = get_settings()



def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(UTC) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

    return encoded_jwt


def verify_access_token(token: str, creds_exception):
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        id: int = payload.get("user_id") #type: ignore

        if id is None:
            raise creds_exception
        
        token_data = TokenData(id=id)
    except JWTError:
        raise creds_exception
    
    return token_data


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db) ):
    creds_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})

    token_data = verify_access_token(token, creds_exception)
    user = db.query(User).filter(User.id == token_data.id).first()
    
    if user is None:
        raise creds_exception

    return user
