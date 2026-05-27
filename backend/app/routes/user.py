from fastapi import APIRouter, Depends, status, HTTPException
from ..schemas import UserResponse, UserCreate
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from sqlalchemy.exc import IntegrityError
from ..utils import hash_password
from ..authconfig import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def user_create(user: UserCreate, db: Session = Depends(get_db)):
    try:
        data = user.model_dump()
        new_user = models.User(
            username=data["username"],
            email=data["email"],
            hashed_password=hash_password(data["password"])
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except IntegrityError as e:
        db.rollback()

        if "email" in str(e.orig):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="email already in use",
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.orig),
        )


@router.get("/me", status_code=status.HTTP_200_OK, response_model=UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.get('/{user_id}', status_code=status.HTTP_200_OK, response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"user with id {user_id} not found")

    if user.id != current_user.id: # type: ignore
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not Authorized to perform requested action")
    
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"user with id {user_id} not found")

    if user.id != current_user.id: #type: ignore
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not Authorized to perform requested action")

    db.delete(user)
    db.commit()
    return None
