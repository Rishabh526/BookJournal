from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    username: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator("username")
    @classmethod
    def username_cannot_be_blank(cls, value: str):
        if not value.strip():
            raise ValueError("username cannot be blank")

        return value.strip()

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: EmailStr



class BookCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    author: str = Field(min_length=1, max_length=255)
    cover: Optional[str] = None

    @field_validator("title", "author")
    @classmethod
    def book_text_cannot_be_blank(cls, value: str):
        if not value.strip():
            raise ValueError("field cannot be blank")

        return value.strip()

class BookUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    author: Optional[str] = Field(default=None, min_length=1, max_length=255)
    cover: Optional[str] = None
    current_page: Optional[int] = Field(default=None, ge=0)
    finished_reading: Optional[bool] = None
    review: Optional[str] = None

    @field_validator("title", "author")
    @classmethod
    def optional_book_text_cannot_be_blank(cls, value: Optional[str]):
        if value is not None and not value.strip():
            raise ValueError("field cannot be blank")

        return value.strip() if value is not None else value

    @model_validator(mode="after")
    def update_cannot_be_empty(self):
        if not self.model_fields_set:
            raise ValueError("at least one field is required")

        return self


class NoteCreate(BaseModel):
    content: str = Field(min_length=1)

    @field_validator("content")
    @classmethod
    def content_cannot_be_blank(cls, value: str):
        if not value.strip():
            raise ValueError("content cannot be blank")

        return value.strip()


class NoteUpdate(BaseModel):
    content: Optional[str] = Field(default=None, min_length=1)

    @field_validator("content")
    @classmethod
    def optional_content_cannot_be_blank(cls, value: Optional[str]):
        if value is not None and not value.strip():
            raise ValueError("content cannot be blank")

        return value.strip() if value is not None else value

    @model_validator(mode="after")
    def update_cannot_be_empty(self):
        if not self.model_fields_set:
            raise ValueError("at least one field is required")

        return self


class NoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    content: str
    book_id: int
    created_at: datetime
    updated_at: datetime


class BookResponse(BookCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    current_page: int
    finished_reading: bool
    review: str
    created_at: datetime
    updated_at: datetime
    last_viewed_at: datetime
    user_id: int
    notes: list[NoteResponse] = []


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Optional[int] = None



class UserLogin(BaseModel):
    email: EmailStr
    password: str
