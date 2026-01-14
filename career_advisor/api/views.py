from django.shortcuts import render
from rest_framework import views, permissions,generics,status
from rest_framework.response import Response
from .models import Career,Milestone,UserProfile,Resource,Sector,Field
from .serializers import RegisterSerializer,CareerSerializer,MilestoneSerializer,UserProfileSerializer,ResourceSerializer,SectorSerializer,FieldSerializer
from django.contrib.auth.models import User


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

# class CareerListView(generics.ListAPIView):
#     queryset = Career.objects.all()
#     permission_classes = [permissions.AllowAny]
#     serializer_class = CareerSerializer

class UserProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get(self, request):
        # This code will now run, getting only the logged-in user's profile
        profile = request.user.userprofile
        serializer = self.serializer_class(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        profile = request.user.userprofile
        serializer = self.serializer_class(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class RoadmapView(views.APIView):
#     """
#     Dynamically generates a roadmap based on a career ID.
#     The current_class can be provided as a query parameter, otherwise defaults to 8.
#     """
#     # 1. Anyone can access this endpoint (No change from your file, but confirms requirement)
#     permission_classes = (permissions.AllowAny,)

#     def get(self, request, format=None):
#         career_id = request.query_params.get('career_id', None)
#         current_class_str = request.query_params.get('current_class', '8')
#         if not career_id:
#             return Response(
#                 {"error": "A career_id must be provided as a query parameter."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         try:
#             # Convert the class to an integer for the database query
#             current_class = int(current_class_str)
#         except (ValueError, TypeError):
#             return Response(
#                 {"error": "current_class must be a valid number."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#         roadmap_milestones = Milestone.objects.filter(
#             careers__id=career_id,
#             target_class__gte=current_class
#         ).distinct().order_by('target_class')
#         serializer = MilestoneSerializer(roadmap_milestones, many=True)
#         return Response(serializer.data)

class RoadmapView(views.APIView):
    """
    Dynamically generates a roadmap for the logged-in user based on their
    profile and a selected career.
    """
    # 1. User must be authenticated to access this
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        # 2. Get the user's profile to find their academic status
        profile = request.user.userprofile
        
        career_id = request.query_params.get('career_id', None)
        if not career_id:
            return Response({"error": "A career_id must be provided."}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Intelligently determine the user's current class level
        current_class = None
        if profile.student_type == 'School' and profile.school_class:
            current_class = profile.school_class
        elif profile.student_type == 'College' and profile.college_year:
            # Map college years to an equivalent class number
            year_map = {'1st Year': 13, '2nd Year': 14, '3rd Year': 15, '4th Year': 16, 'Graduated': 17}
            current_class = year_map.get(profile.college_year, 13)
        elif profile.student_type == 'Other':
            # Assume 'Other' status means they are beyond school/college
            current_class = 17 # Equivalent to graduated

        if current_class is None:
            return Response({"error": "Your academic details are incomplete. Please update your profile."}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Use the derived class in the query
        roadmap_milestones = Milestone.objects.filter(
            careers__id=career_id,
            target_class__gte=current_class
        ).distinct().order_by('target_class')
        
        serializer = MilestoneSerializer(roadmap_milestones, many=True)
        return Response(serializer.data)


class SectorListView(generics.ListAPIView):
    queryset = Sector.objects.prefetch_related('fields__careers').all()
    serializer_class = SectorSerializer
    permission_classes = (permissions.AllowAny,)

class FieldListView(generics.ListAPIView):
    """
    Provides a list of all Fields. Can be filtered by a sector_id
    query parameter, e.g., /api/fields/?sector_id=1
    """
    serializer_class = FieldSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Field.objects.all()
        sector_id = self.request.query_params.get('sector_id')
        if sector_id is not None:
            queryset = queryset.filter(sector__id=sector_id)
        return queryset
    
class CareerListView(generics.ListAPIView):
    """
    Provides a list of all Careers. Can be filtered by a field_id
    query parameter, e.g., /api/careers/?field_id=5
    """
    serializer_class = CareerSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Career.objects.all()
        field_id = self.request.query_params.get('field_id')
        if field_id is not None:
            queryset = queryset.filter(field__id=field_id)
        return queryset