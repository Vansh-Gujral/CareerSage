# from django.urls import path
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from .views import RegisterView, CareerListView, UserProfileView, RoadmapView,SectorListView,FieldCareerListView

# urlpatterns = [
#     # --- Authentication Endpoints ---
#     path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # For logging in
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # To get a new access token
#     path('register/', RegisterView.as_view(), name='register'),
    
#     path('careers/', CareerListView.as_view(), name='career-list'),
#     path('profile/', UserProfileView.as_view(), name='user-profile'),
#     path('roadmap/', RoadmapView.as_view(), name='roadmap'),
#     path('sectors/', SectorListView.as_view(), name='sector-list'),

# ]

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, 
    UserProfileView, 
    RoadmapView, 
    SectorListView,
    FieldListView,
    CareerListView
)

urlpatterns = [
    # --- Authentication Endpoints ---
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),

    # --- Data Endpoints for Dropdowns ---
    path('sectors/', SectorListView.as_view(), name='sector-list'),
    path('fields/', FieldListView.as_view(), name='field-list'),
    path('careers/', CareerListView.as_view(), name='career-list'),

    # --- User-Specific Endpoints ---
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('roadmap/', RoadmapView.as_view(), name='roadmap'),
]

