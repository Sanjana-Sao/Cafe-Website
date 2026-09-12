import datetime
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, OAuth2PasswordRequestForm
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from config.config import settings
from database.session import get_db
from models.models import User
from schema.schemas import SignupIn, TokenOut, UserOut


router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer(auto_error=False)


def to_user_out(user: User) -> UserOut:
    return UserOut(
        user_id=str(user.user_id),
        email=user.email,
        role=user.role,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        user_id = uuid.UUID(payload.get("sub", ""))
    except (jwt.JWTError, ValueError) as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from exc

    result = await db.execute(select(User).where(User.user_id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=401, detail="User no longer exists")
    return user


def require_roles(*roles: str):
    async def role_dependency(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="You do not have access to this page")
        return user

    return role_dependency


def create_access_token(user: User) -> str:
    expires = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    return jwt.encode(
        {
            "sub": str(user.user_id),
            "email": user.email,
            "role": user.role,
            "exp": expires,
        },
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


@router.post("/signup", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
async def signup(payload: SignupIn, db: AsyncSession = Depends(get_db)):
    email = payload.email.strip().lower()
    role = payload.role.strip().lower()
    if role not in {"staff", "manager"}:
        raise HTTPException(status_code=400, detail="Role must be staff or manager")
    if len(payload.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    existing = await db.execute(select(User).where(User.email == email))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(status_code=409, detail="Email is already registered")

    user = User(email=email, password=pwd_context.hash(payload.password), role=role)
    db.add(user)
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(status_code=409, detail="Email is already registered") from exc
    await db.refresh(user)
    return TokenOut(
        access_token=create_access_token(user),
        token_type="bearer",
        user=to_user_out(user),
    )


@router.post("/login", response_model=TokenOut)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.email == form_data.username.strip().lower()))
    user = result.scalar_one_or_none()
    if user is None or not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if form_data.scopes and form_data.scopes[0] not in {"staff", "manager"}:
        raise HTTPException(status_code=400, detail="Role must be staff or manager")
    if form_data.scopes and form_data.scopes[0] != user.role:
        raise HTTPException(status_code=403, detail="Account role does not match selected role")

    return TokenOut(
        access_token=create_access_token(user),
        token_type="bearer",
        user=to_user_out(user),
    )
