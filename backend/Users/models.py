from django.db import models


# Create your models here.
class users(models.Model):
    id = models.UUIDField(primary_key=True)  # Supabase UUID
    username = models.CharField(max_length=30, unique=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=10,
        choices=[
            ("student", "Student"),
            ("teacher", "Teacher"),
            ("developer", "Developer"),
        ],
    )
    rating = models.IntegerField(default=0)

    # bio = models.TextField(blank=True, null=True)
    # pfp_url = models.TextField(
    #     null=False, default="https://ssl.gstatic.com/accounts/ui/avatar_2x.png"
    # )
    def __str__(self):
        return f"{self.username} ({self.id})"


class students(models.Model):
    user = models.OneToOneField(users, on_delete=models.CASCADE, primary_key=True)
    grade_level = models.CharField(max_length=20)
    strand = models.CharField(max_length=50)
    section = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.grade_level}:{self.section}"


class teachers(models.Model):
    user = models.OneToOneField(users, on_delete=models.CASCADE, primary_key=True)
    sections = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"Teacher {self.user.full_name}"
