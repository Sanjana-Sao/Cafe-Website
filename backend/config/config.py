from pydantic_settings import BaseSettings
from pydantic import Field
from dotenv import load_dotenv

 
load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = Field(...,env="DATABASE_URL")
    HOST: str = Field(..., env="HOST")
    PORT: int = Field(..., env="PORT")
    JWT_SECRET_KEY: str = Field(..., env="JWT_SECRET_KEY")
    JWT_ALGORITHM: str = Field(...,env="JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(..., env="ACCESS_TOKEN_EXPIRE_MINUTES")

    class Config:
        env_file = r".env"


settings = Settings()
