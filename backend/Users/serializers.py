from rest_framework import serializers
from .models import users  # adjust to your model location


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = ["id", "username", "full_name", "email", "role"]
