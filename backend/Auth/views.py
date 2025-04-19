# Create your views here.
# Auth/views.py

from datetime import datetime, timezone

from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import redirect
from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .__init__ import supabase__init__
from .OAuth.types import OAuthProvider
from .OAuth.registry import get_oauth_handler
from .OAuth.google import GoogleOAuthProvider  # Direct import
from .OAuth.types import OAuthProvider

from Users.models import users, students

supabase = supabase__init__()


class EmailLoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password required."}, status=400)

        try:
            response = supabase.auth.sign_in_with_password(
                {
                    "email": email,
                    "password": password,
                }
            )

            if response.user:
                supabase.table("Users").upsert(
                    {
                        "user_id": str(response.user.id),
                        "last_online": datetime.now(timezone.utc).isoformat(),
                    }
                ).execute()
                return JsonResponse(
                    {
                        "message": "Login successful",
                        "user_id": response.user.id,
                        "access_token": response.session.access_token,
                    }
                )
            else:
                return JsonResponse({"error": "Invalid email or password"}, status=401)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


class OAuthLoginView(APIView):
    def get(self, request):
        provider = request.GET.get("provider", "google")
        try:
            handler: OAuthProvider = get_oauth_handler(provider)
            redirect_url = handler.get_redirect_url()
            return redirect(redirect_url)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class RegisterView(APIView):
    @transaction.atomic
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        full_name = request.data.get("full_name")
        username = request.data.get("username")
        role = "student"
        grade = request.data.get("grade")
        strand = request.data.get("strand")
        section = request.data.get("section")

        try:
            # 1. Supabase signup
            response = supabase.auth.sign_up(
                {
                    "email": email,
                    "password": password,
                }
            )

            user = response.user
            if not user:
                return Response({"error": "Supabase user creation failed."}, status=500)

            # 2. Create user in NeonDB
            user_obj = users.objects.create(
                id=user.id,
                email=email,
                full_name=full_name,
                username=username,
                role=role,
            )

            # 3. Create student profile
            students.objects.create(
                user=user_obj,
                grade_level=grade,
                strand=strand,
                section=section,
            )

            response = (
                supabase.table("Users")
                .upsert(
                    {
                        "user_id": str(user.id),
                        "bio": "",
                        "pfp_url": "https://ssl.gstatic.com/accounts/ui/avatar_2x.png",
                        "organizations": [],
                        "is_online": True,
                        "last_online": datetime.now(timezone.utc).isoformat(),
                    }
                )
                .execute()
            )

            return Response({"message": "User registered successfully!"}, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=500)
