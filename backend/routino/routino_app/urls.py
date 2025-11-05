from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('profile/me/', views.ProfileMeView.as_view(), name='profile_me'),
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('categories/create/', views.CategoryCreateView.as_view(), name='category_create'),
    path('subcategories/', views.SubCategoryListCreateView.as_view(), name='subcategory_list_create'),
    path('statuses/', views.StatusListCreateView.as_view(), name='status_list_create'),
    path('frequencies/', views.FrequencyListView.as_view(), name='frequency_list'),
    path('activities/', views.ActivityListCreateView.as_view(), name='activity_list_create'),
    path('routines/', views.RoutineListCreateView.as_view(), name='routine_list_create'),
    path('goals/', views.GoalListCreateView.as_view(), name='goal_list_create'),
]