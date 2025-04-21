from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from Users.models import users, students, teachers
from .serializers import UserProfileSerializer
from .__init__ import supabase__init__
from utils.cache_service import CacheService
import json


class PublicProfileView(APIView):
    permission_classes = [AllowAny]

    @CacheService.cache(
        key=lambda self, request, username: username,
        prefix="userprofile:public",
        ttl=600,
    )
    def get(self, request, username):
        try:
            user = users.objects.get(username=username)
            serializer = UserProfileSerializer(user)
            return JsonResponse(serializer.data)
        except users.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)


class SelfProfileView(APIView):
    permission_classes = [AllowAny]

    @CacheService.cache(
        key=lambda self, request, user_id: user_id, prefix="userprofile:self", ttl=600
    )
    def get(self, request, user_id):
        try:
            user = users.objects.get(id=user_id)
            serializer = UserProfileSerializer(user)
            role = serializer.data.get("role")

            combined_data = serializer.data.copy()

            if role == "student":
                student = students.objects.get(user_id=user_id)
                student_data = {
                    "grade_level": student.grade_level,
                    "strand": student.strand,
                    "section": student.section,
                }
                combined_data.update(student_data)

            elif role == "teacher":
                teacher = teachers.objects.get(user_id=user_id)
                teacher_data = {"sections": teacher.sections}
                combined_data.update(teacher_data)

            supabase = supabase__init__()
            response = (
                supabase.table("Users")
                .select("*")
                .eq("user_id", str(user_id))
                .execute()
            )

            supabase_data = response.data[0] if response.data else {}
            combined_data.update(supabase_data)

            return JsonResponse(combined_data)

        except users.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)


@CacheService.cache(
    key=lambda request: request.GET.get("username", ""),
    prefix="lookup:username",
    ttl=300,
)
def lookup_user_by_username(request):
    username = request.GET.get("username")
    if not username:
        return JsonResponse({"error": "Username parameter is required."}, status=400)

    try:
        user = users.objects.get(username=username)
        return JsonResponse({"user_id": str(user.id)})
    except users.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
