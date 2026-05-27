from pwdlib import PasswordHash
from pwdlib.exceptions import UnknownHashError

pwd_hash = PasswordHash.recommended()


def hash_password(password: str):
    return pwd_hash.hash(password)


def verify(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_hash.verify(plain_password, hashed_password)
    except UnknownHashError:
        return False
