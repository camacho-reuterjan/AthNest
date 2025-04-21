from django.urls import path
from .views import PublicProfileView, SelfProfileView, lookup_user_by_username

urlpatterns = [
    path("lookup/", lookup_user_by_username, name="lookup_user"),
    path("id/<str:user_id>/", SelfProfileView.as_view(), name="self-profile"),
    path("<str:username>/", PublicProfileView.as_view(), name="public-profile"),
]
