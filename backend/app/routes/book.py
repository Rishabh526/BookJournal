from fastapi import APIRouter, Depends, HTTPException, status
from ..schemas import BookCreate, BookUpdate, BookResponse
from ..database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..authconfig import get_current_user
from .. import models
from typing import List


router = APIRouter(
    prefix="/books",
    tags=["Books"]
)


def get_owned_book_or_404(book_id: int, db: Session, current_user: models.User):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()

    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"book with id {book_id} not found")

    if book.user_id != current_user.id: # type: ignore
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not Authorized to perform requested action")

    return book


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=BookResponse)
def create_book(book: BookCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_book = models.Book(user_id = current_user.id, **book.model_dump()) #type: ignore
    db.add(new_book)
    db.commit()
    db.refresh(new_book)

    return new_book

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[BookResponse])
def get_books(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    book = db.query(models.Book).filter(models.Book.user_id == current_user.id).all() # type: ignore
    
    return book

@router.get("/{book_id}", status_code=status.HTTP_200_OK, response_model=BookResponse)
def get_one_book(book_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return get_owned_book_or_404(book_id, db, current_user)

@router.put("/{book_id}", status_code=status.HTTP_200_OK, response_model=BookResponse)
def update_book(book_id: int, book: BookUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    existing_book = get_owned_book_or_404(book_id, db, current_user)
    book_query = db.query(models.Book).filter(models.Book.id == existing_book.id)
    update_data = book.model_dump(exclude_unset=True)
    update_data["last_viewed_at"] = func.now()
    book_query.update(update_data, synchronize_session=False) # type: ignore
    db.commit()
    return book_query.first()

@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    book = get_owned_book_or_404(book_id, db, current_user)
    db.delete(book)
    db.commit()
    return None
