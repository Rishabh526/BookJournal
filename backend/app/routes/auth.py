from fastapi import APIRouter, status, Depends, HTTPException
from ..database import get_db
from sqlalchemy.orm import Session
from ..schemas import Token
from .. import models
from ..utils import verify
from ..authconfig import create_access_token
from ..schemas import UserLogin


router = APIRouter(tags=["Authentication"])


@router.post('/login', status_code=status.HTTP_200_OK, response_model=Token)
def login(user_creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_creds.email).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")
    
    if not verify(user_creds.password, user.hashed_password): #type: ignore
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")
    

    access_token = create_access_token(data = {"user_id": user.id})

    return {"access_token": access_token, "token_type": "bearer"}
