from fastapi import APIRouter, Depends, HTTPException, status
from ..schemas import NoteCreate, NoteResponse, NoteUpdate
from ..database import get_db
from sqlalchemy.orm import Session
from ..authconfig import get_current_user
from .. import models
from typing import List


router = APIRouter(
    prefix="/books/{book_id}/notes",
    tags=["Notes"]
)

def get_book_or_404(book_id: int, db: Session, current_user: models.User):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()

    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"book with id {book_id} not found")

    if book.user_id != current_user.id: # type: ignore
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not Authorized to perform requested action")

    return book


def get_note_or_404(book_id: int, note_id: int, db: Session):
    note = db.query(models.Note).filter(
        models.Note.book_id == book_id,
        models.Note.id == note_id,
    ).first()

    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"note with id {note_id} not found")

    return note

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=NoteResponse)
def create_note(book_id: int, note: NoteCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    get_book_or_404(book_id, db, current_user)
    new_note = models.Note(book_id = book_id, **note.model_dump())

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return new_note

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[NoteResponse])
def get_notes(book_id:int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    get_book_or_404(book_id, db, current_user)
    notes = db.query(models.Note).filter(models.Note.book_id == book_id).all()

    return notes

@router.get("/{note_id}", status_code=status.HTTP_200_OK, response_model=NoteResponse)
def get_one_note(book_id: int, note_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    get_book_or_404(book_id, db, current_user)
    note = get_note_or_404(book_id, note_id, db)

    return note

@router.put("/{note_id}", status_code=status.HTTP_200_OK, response_model=NoteResponse)
def update_note(book_id: int, note_id: int, note: NoteUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    get_book_or_404(book_id, db, current_user)
    note_query = db.query(models.Note).filter(
        models.Note.book_id == book_id,
        models.Note.id == note_id,
    )
    existing_note = note_query.first()

    if not existing_note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"note with id {note_id} not found")

    note_query.update(note.model_dump(exclude_unset=True), synchronize_session=False) # type: ignore
    db.commit()
    return note_query.first()

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(book_id: int, note_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    get_book_or_404(book_id, db, current_user)
    note = get_note_or_404(book_id, note_id, db)

    db.delete(note)
    db.commit()
    return None
