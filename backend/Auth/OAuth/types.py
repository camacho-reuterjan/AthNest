# auth/oauth/types.py
from typing import Protocol


class OAuthProvider(Protocol):
    def get_redirect_url(self) -> str: ...
