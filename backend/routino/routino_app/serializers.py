from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, SubCategory, Frequency, Status, Profile, Activity, Routine, Goal

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password']
            )
            return user
        except Exception as e:
            raise serializers.ValidationError(f"خطا در ایجاد کاربر یا پروفایل: {str(e)}")

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'description', 'score', 'created_date']

class SubCategorySerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = SubCategory
        fields = ['id', 'category', 'title', 'score', 'description', 'created_date']

class FrequencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Frequency
        fields = ['id', 'title', 'score', 'description', 'created_date']

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ['id', 'title', 'score', 'description', 'created_date']

class ProfileSerializer(serializers.ModelSerializer):
    user_profile = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Profile
        fields = [
            'user_profile', 'firstName', 'lastName', 'userName', 'age',
            'gender', 'activity_score', 'frequency_score', 'status_score', 'overall_score'
        ]

class ActivitySerializer(serializers.ModelSerializer):
    profile = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    type = serializers.PrimaryKeyRelatedField(queryset=SubCategory.objects.all())
    status = serializers.PrimaryKeyRelatedField(queryset=Status.objects.all())
    frequency = serializers.PrimaryKeyRelatedField(queryset=Frequency.objects.all())

    class Meta:
        model = Activity
        fields = [
            'id', 'profile', 'category', 'type', 'status', 'frequency',
            'title', 'start_date', 'end_date', 'created_date', 'description', 'score'
        ]

class RoutineSerializer(serializers.ModelSerializer):
    profile = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
    activity = serializers.PrimaryKeyRelatedField(queryset=Activity.objects.all(), many=True)

    class Meta:
        model = Routine
        fields = [
            'id', 'profile', 'activity', 'title',
            'start_date', 'end_date', 'created_date', 'description'
        ]

class GoalSerializer(serializers.ModelSerializer):
    profile = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
    routine = serializers.PrimaryKeyRelatedField(queryset=Routine.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    subCategory = serializers.PrimaryKeyRelatedField(queryset=SubCategory.objects.all())
    status = serializers.PrimaryKeyRelatedField(queryset=Status.objects.all())
    activity = serializers.PrimaryKeyRelatedField(queryset=Activity.objects.all())

    class Meta:
        model = Goal
        fields = [
            'id', 'profile', 'routine', 'category', 'subCategory', 'status',
            'activity', 'title', 'start_date', 'end_date', 'created_date', 'description'
        ]