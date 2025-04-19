# auth/oauth/google.py
import os
from supabase import Client
from ..__init__ import supabase__init__
from .registry import register_provider
from .types import OAuthProvider

SUPABASE_REDIRECT_URL = os.environ.get(
    "SUPABASE_REDIRECT_URL", "http://localhost:3000/auth/oauth/callback"
)


class GoogleOAuthProvider(OAuthProvider):
    def __init__(self, client: Client = supabase__init__()):
        self.client = client

    def get_redirect_url(self) -> str:
        response = self.client.auth.sign_in_with_oauth(
            {
                "provider": "google",
                "options": {
                    "redirect_to": SUPABASE_REDIRECT_URL,
                },
            }
        )
        return response.url


register_provider("google", GoogleOAuthProvider)
