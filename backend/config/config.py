from pydantic_settings import BaseSettings
from pydantic import Field
from dotenv import load_dotenv

 
load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = Field(...,env="DATABASE_URL")
    JWT_SECRET_KEY: str = Field(
        default="change-this-secret-in-production",
        env="JWT_SECRET_KEY",
    )
    JWT_ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60, env="ACCESS_TOKEN_EXPIRE_MINUTES")

    class Config:
        env_file = r".env"


settings = Settings()
