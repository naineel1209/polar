from enum import Enum, auto
from typing import Annotated, Self
from uuid import UUID

from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from polar.authz.service import Anonymous, Subject
from polar.config import settings
from polar.enums import Platforms
from polar.models import Organization, Repository, User
from polar.organization.service import organization as organization_service
from polar.postgres import AsyncSession, get_db_session

from .service import AuthService


class AuthMethod(Enum):
    COOKIE = auto()
    PERSONAL_ACCESS_TOKEN = auto()


personal_access_token_scheme = HTTPBearer(
    auto_error=False,
    description="You can generate a **Personal Access Token** from your [settings](https://polar.sh/settings).",
)


async def _get_cookie_token(request: Request) -> str | None:
    return request.cookies.get(settings.AUTH_COOKIE_KEY)


async def _current_user_optional(
    cookie_token: str | None = Depends(_get_cookie_token),
    personal_access_token: HTTPAuthorizationCredentials
    | None = Depends(personal_access_token_scheme),
    session: AsyncSession = Depends(get_db_session),
) -> tuple[User | None, AuthMethod | None]:
    if cookie_token is not None:
        return (
            await AuthService.get_user_from_cookie(session, cookie=cookie_token),
            AuthMethod.COOKIE,
        )
    elif personal_access_token is not None:
        return (
            await AuthService.get_user_from_personal_access_token(
                session, token=personal_access_token.credentials
            ),
            AuthMethod.PERSONAL_ACCESS_TOKEN,
        )
    return None, None


async def _current_user_required(
    user_auth_method: tuple[User | None, AuthMethod | None] = Depends(
        _current_user_optional
    ),
) -> tuple[User, AuthMethod]:
    user, auth_method = user_auth_method
    if user is None or auth_method is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user, auth_method


class Auth:
    subject: Subject
    user: User | None
    auth_method: AuthMethod | None

    def __init__(
        self,
        *,
        subject: Subject,
        user: User | None = None,
        auth_method: AuthMethod | None = None,
        organization: Organization | None = None,
        repository: Repository | None = None,
    ):
        self.subject = subject
        self.user = user
        self.auth_method = auth_method
        self._organization = organization
        self._repository = repository

    @property
    def organization(self) -> Organization:
        if self._organization:
            return self._organization

        raise AttributeError(
            "No organization set. Use Auth.current_user_with_org_access()."
        )

    @property
    def repository(self) -> Repository:
        if self._repository:
            return self._repository

        raise AttributeError(
            "No repository set. Use Auth.current_user_with_org_and_repo_access()."
        )

    ###############################################################################
    # FastAPI dependency methods
    ###############################################################################

    @classmethod
    async def current_user(
        cls, user_auth_method: tuple[User, AuthMethod] = Depends(_current_user_required)
    ) -> Self:
        user, auth_method = user_auth_method
        return cls(subject=user, user=user, auth_method=auth_method)

    @classmethod
    async def optional_user(
        cls,
        user_auth_method: tuple[User | None, AuthMethod | None] = Depends(
            _current_user_optional
        ),
    ) -> Self:
        user, auth_method = user_auth_method
        if user:
            return cls(subject=user, user=user, auth_method=auth_method)
        else:
            return cls(subject=Anonymous())

    @classmethod
    async def user_with_org_access(
        cls,
        *,
        platform: Platforms,
        org_name: str,
        session: AsyncSession = Depends(get_db_session),
        user_auth_method: tuple[User, AuthMethod] = Depends(_current_user_required),
    ) -> Self:
        user, auth_method = user_auth_method
        organization = await organization_service.get_for_user(
            session,
            platform=platform,
            org_name=org_name,
            user_id=user.id,
        )
        if not organization:
            raise HTTPException(
                status_code=404, detail="Organization not found for user"
            )
        return cls(
            subject=user, user=user, auth_method=auth_method, organization=organization
        )

    @classmethod
    async def user_with_org_access_by_id(
        cls,
        *,
        id: UUID,
        session: AsyncSession = Depends(get_db_session),
        user_auth_method: tuple[User, AuthMethod] = Depends(_current_user_required),
    ) -> Self:
        user, auth_method = user_auth_method
        organization = await organization_service.get_by_id_for_user(
            session,
            org_id=id,
            user_id=user.id,
        )
        if not organization:
            raise HTTPException(
                status_code=404, detail="Organization not found for user"
            )
        return cls(
            subject=user, user=user, auth_method=auth_method, organization=organization
        )

    @classmethod
    async def user_with_org_and_repo_access(
        cls,
        *,
        platform: Platforms,
        org_name: str,
        repo_name: str,
        session: AsyncSession = Depends(get_db_session),
        user_auth_method: tuple[User, AuthMethod] = Depends(_current_user_required),
    ) -> Self:
        user, auth_method = user_auth_method
        org, repo = await organization_service.get_with_repo_for_user(
            session,
            platform=platform,
            org_name=org_name,
            repo_name=repo_name,
            user_id=user.id,
        )
        return cls(
            subject=user,
            user=user,
            auth_method=auth_method,
            organization=org,
            repository=repo,
        )

    @classmethod
    async def backoffice_user(
        cls,
        *,
        user_auth_method: tuple[User, AuthMethod] = Depends(_current_user_required),
    ) -> Self:
        user, auth_method = user_auth_method
        allowed = ["zegl", "birkjernstrom", "frankie567", "emilwidlund"]

        if user.username not in allowed:
            raise HTTPException(
                status_code=404,
                detail="Not Found",
            )

        return cls(subject=user, user=user, auth_method=auth_method)


class AuthRequired(Auth):
    subject: User
    user: User
    auth_method: AuthMethod


UserRequiredAuth = Annotated[AuthRequired, Depends(Auth.current_user)]
