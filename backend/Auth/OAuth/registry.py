# auth/oauth/registry.py
from typing import Dict, Type
from .types import OAuthProvider

OAUTH_PROVIDER_REGISTRY: Dict[str, Type[OAuthProvider]] = {}


def register_provider(name: str, cls: Type[OAuthProvider]):
    OAUTH_PROVIDER_REGISTRY[name] = cls


def get_provider(name: str) -> OAuthProvider:
    if name not in OAUTH_PROVIDER_REGISTRY:
        raise ValueError(f"Provider {name} not registered.")
    return OAUTH_PROVIDER_REGISTRY[name]()


def get_oauth_handler(name: str) -> OAuthProvider:
    if name not in OAUTH_PROVIDER_REGISTRY:
        raise ValueError(f"Provider {name} not registered.")
    return OAUTH_PROVIDER_REGISTRY[name]()
