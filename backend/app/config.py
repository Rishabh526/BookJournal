import os
from functools import lru_cache
from pathlib import Path


def load_env_file():
    env_path = Path(__file__).resolve().parents[1] / ".env"

    if not env_path.exists():
        return

    for line in env_path.read_text().splitlines():
        stripped = line.strip()

        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue

        key, value = stripped.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


class Settings:
    def __init__(self):
        load_env_file()
        self.database_url = self._required("DATABASE_URL")
        self.secret_key = self._required("SECRET_KEY")
        self.algorithm = os.getenv("ALGORITHM", "HS256")
        self.access_token_expire_minutes = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
        )
        self.cors_origins = [
            origin.strip()
            for origin in os.getenv(
                "CORS_ORIGINS",
                "http://localhost:5173,http://127.0.0.1:5173",
            ).split(",")
            if origin.strip()
        ]

    @staticmethod
    def _required(name: str) -> str:
        value = os.getenv(name)

        if not value:
            raise RuntimeError(f"{name} is required. Add it to backend/.env.")

        return value


@lru_cache
def get_settings():
    return Settings()
