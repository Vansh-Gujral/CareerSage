from rest_framework import serializers
from .models import Career,Milestone,UserProfile,Resource,Sector,Field
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email']

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id','title','link','resource_type']
    
class CareerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Career
        fields = ['id','name','description','field']

class FieldSerializer(serializers.ModelSerializer):
    careers = CareerSerializer(many=True, read_only=True) # Nested careers

    class Meta:
        model = Field
        fields = ['id', 'name', 'sector', 'careers']

class SectorSerializer(serializers.ModelSerializer):
    fields = FieldSerializer(many=True, read_only=True) # Nested fields

    class Meta:
        model = Sector
        fields = ['id', 'name', 'fields']

class MilestoneSerializer(serializers.ModelSerializer):
    resources = ResourceSerializer(many=True, read_only=True, source='resource_set')
    class Meta:
        model = Milestone
        fields = ['id','title','description','target_class','resources']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 
            'user', 
            'student_type',
            'school_class',
            'college_degree',
            'college_year',
            'other_status',
            'pincode',
            'city',
            'state'
        ]


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','email','password')
        extra_kwargs = {'password': {'write_only': True}}

        def create(self, validated_data):
            user = User.objects.create_user(
                validated_data['username'],
                validated_data['email'],
                validated_data['password']
            )
            return user
