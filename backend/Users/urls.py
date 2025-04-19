from django.urls import path
from .views import check_email_exists, check_username_exists, CreateUserProfileView

urlpatterns = [
    path("check-email/", check_email_exists, name="check-email"),
    path("check-username/", check_username_exists, name="check-username"),
    path("users/", CreateUserProfileView.as_view(), name="create-user-profile"),
]
