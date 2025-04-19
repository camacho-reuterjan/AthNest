from django.shortcuts import render

# Users/views.py
# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.contrib.auth import get_user_model

from .serializers import UserSerializer
from .models import users, students, teachers

User = get_user_model()


@require_GET
def check_username_exists(request):
    username = request.GET.get("username")
    if username is None:
        return JsonResponse({"error": "Username is required"}, status=400)

    exists = User.objects.filter(username=username).exists()
    return JsonResponse({"exists": exists})


@require_GET
def check_email_exists(request):
    email = request.GET.get("email")
    if email is None:
        return JsonResponse({"error": "Email is required"}, status=400)

    exists = User.objects.filter(email=email).exists()
    return JsonResponse({"exists": exists})


class CreateUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # this creates the user in NeonDB
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserRoleView(APIView):
    @transaction.atomic
    def patch(self, request, user_id):
        new_role = request.data.get("role")

        try:
            user = users.objects.get(id=user_id)

            if user.role == new_role:
                return Response({"message": "No change in role."}, status=200)

            # Save old role and switch
            old_role = user.role
            user.role = new_role
            user.save()

            if old_role == "student" and new_role == "teacher":
                # Transfer rating
                student_data = students.objects.get(user=user)
                rating = student_data.rating

                # Delete student profile
                student_data.delete()

                # Create teacher profile
                teachers.objects.create(
                    user=user, department="", subjects=[], rating=rating
                )

            elif old_role == "teacher" and new_role == "student":
                teacher_data = teachers.objects.get(user=user)
                rating = getattr(teacher_data, "rating", 0)

                teacher_data.delete()

                students.objects.create(
                    user=user, grade_level="", strand="", section="", rating=rating
                )

            return Response({"message": f"Role updated to {new_role}."})

        except users.DoesNotExist:
            return Response({"error": "User not found."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
