from rest_framework import serializers
from Users.models import users, students, teachers


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = ["id", "username", "full_name", "email", "role", "rating"]


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = students
        fields = ["user", "grade_level", "strand", "section"]


class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = teachers
        fields = ["users", "sections"]
