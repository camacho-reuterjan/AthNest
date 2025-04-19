# Auth/urls.py

from django.urls import path
from .views import EmailLoginView, OAuthLoginView, RegisterView

urlpatterns = [
    path("login/", EmailLoginView.as_view(), name="supabase-login"),
    path("oauth/login/", OAuthLoginView.as_view(), name="oauth-login"),
    path("register/", RegisterView.as_view(), name="auth-register"),
]
