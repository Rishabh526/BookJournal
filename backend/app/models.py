from .database import Base
from sqlalchemy import Column, String, Integer, DateTime, func, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    books = relationship("Book", back_populates="user", cascade="all, delete-orphan")



class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    cover = Column(Text, nullable=True)
    current_page = Column(Integer, nullable=True, default=1, server_default="1")
    finished_reading = Column(Boolean, default=False, server_default="false")
    review = Column(Text, nullable=False, default="", server_default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_viewed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="books")
    notes = relationship("Note", back_populates="book", cascade="all, delete-orphan")


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    content = Column(Text, nullable=False, default="", server_default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    book = relationship("Book", back_populates="notes")
