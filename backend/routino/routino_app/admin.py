from django.contrib import admin
from routino_app import models


@admin.action(description='Duplicate selected record')
def duplicate_row(modeladmin, request, queryset):
    for object in queryset:
        object.id = None
        object.save()


admin.site.add_action(duplicate_row)


@admin.register(models.Category)
class Activity_Category_Admin (admin.ModelAdmin):
    list_display = [
        'title',
        # 'category',
        'description',
        'score',
        'created_date'

    ]


@admin.register(models.Status)
class Activity_Status_Admin (admin.ModelAdmin):
    list_display = [
        'title',
        'score',
        'id',
        'description',
        'created_date'

    ]


@admin.register(models.Frequency)
class Activity_Frequency_Admin (admin.ModelAdmin):
    list_display = [
        'title',
        'score',
        'id',
        'description',
        'created_date'
    ]


@admin.register(models.SubCategory)
class Activity_SubCategory_Admin (admin.ModelAdmin):
    list_display = [
        'title',
        'score',
        'id',
        'description',
        'created_date'
    ]


@admin.register(models.Activity)
class Activity_Admin (admin.ModelAdmin):
    list_display = [
        'title',
        'id',
        'category',
        'type',
        'status',
        'frequency',
        'description',
        'profile'
    ]


@admin.register(models.Profile)
class Profile_Admin(admin.ModelAdmin):
    list_display = [
        'user_profile', 'firstName', 'lastName', 'userName', 'age', 'gender'
    ]


@admin.register(models.Goal)
class Goal_Admin(admin.ModelAdmin):
    list_display = [
        'title',
        'profile',
        'id',
        'status',
        'routine',
        'activity',
        'start_date',
        'end_date',
        'created_date',
        'description'
    ]

    ordering = ['id']

    actions = ['duplicate_row']


@admin.register(models.Routine)
class Routine_Admin(admin.ModelAdmin):
    list_display = [
        'profile',
        # 'activity',
        'title',
        'start_date',
        'end_date',
        'created_date',
        'description'
    ]
