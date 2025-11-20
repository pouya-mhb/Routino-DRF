from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    title = models.CharField(max_length=250)
    description = models.TextField()
    score = models.IntegerField(default=1)
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return self.title


class SubCategory(models.Model):

    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    title = models.CharField(max_length=250)
    score = models.IntegerField(default=1)
    description = models.TextField(max_length=250, default="")
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title


class Frequency(models.Model):
    title = models.CharField(max_length=250)
    score = models.IntegerField(default=1)
    description = models.TextField(max_length=250, default="")
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title


class Status(models.Model):

    title = models.CharField(max_length=250)
    score = models.IntegerField(default=1)
    description = models.TextField(max_length=250, default="")
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title


class Profile(models.Model):
    user_profile = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True, related_name="user_profile"
    )
    gender_choices = (
        ("male", "Male"),
        ("female", "Female"),
    )

    firstName = models.CharField(max_length=250, default="user_first_name")
    lastName = models.CharField(max_length=250, default="user_last_name")
    userName = models.CharField(max_length=250)
    email = models.CharField(max_length=250, blank=True)
    age = models.IntegerField(default=18)
    gender = models.CharField(choices=gender_choices, max_length=6)
    activity_score = models.IntegerField(default=0)
    frequency_score = models.IntegerField(default=0)
    status_score = models.IntegerField(default=0)
    overall_score = models.IntegerField(default=0)

    def __str__(self):
        return self.userName


class Activity(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)

    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    type = models.ForeignKey(SubCategory, on_delete=models.CASCADE)
    status = models.ForeignKey(Status, on_delete=models.CASCADE)
    frequency = models.ForeignKey(Frequency, on_delete=models.CASCADE)

    title = models.CharField(max_length=250)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(default=timezone.now)
    created_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField()

    score = models.IntegerField(default=1)

    def __str__(self):
        return self.title


class Routine(models.Model):
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="routine_profile",
        verbose_name="Routine Profile",
    )
    activities = models.ManyToManyField(
        Activity, related_name="routine_activities", verbose_name="Routine Activities"
    )
    title = models.CharField(max_length=250)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(default=timezone.now)
    created_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField()

    def __str__(self):
        return self.title


class Goal(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, default=1)

    routine = models.ForeignKey(Routine, on_delete=models.CASCADE, default=1)

    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=1)

    subCategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, default=1)

    status = models.ForeignKey(Status, on_delete=models.CASCADE, default=1)

    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, default=1)

    title = models.CharField(max_length=250)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(default=timezone.now)
    created_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField()  # todo : correct description

    def __str__(self):
        return self.title
