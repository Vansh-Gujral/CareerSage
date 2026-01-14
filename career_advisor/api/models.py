from django.db import models
from django.contrib.auth.models import User

class Sector(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
class Field(models.Model):
    name = models.CharField(max_length=100, unique=True)
    sector = models.ForeignKey(Sector, related_name='fields', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Career(models.Model):
    name=models.CharField(max_length=50)
    description=models.TextField()
    field = models.ForeignKey(Field, related_name='careers', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Milestone(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    # target_class = models.CharField(max_length=20)
    target_class = models.IntegerField()
    careers = models.ManyToManyField(Career)

    def __str__(self):
        return f"{self.title} (Class {self.target_class})"

class UserProfile(models.Model):
    STUDENT_TYPE_CHOICES = [
        ('School', 'School Student'),
        ('College', 'College Student'),
        ('Other', 'Other (Dropper, Graduated, etc.)'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    student_type = models.CharField(max_length=10, choices=STUDENT_TYPE_CHOICES, null=True, blank=True)
    school_class = models.IntegerField(null=True, blank=True)
    college_degree = models.CharField(max_length=100, null=True, blank=True)
    college_year = models.CharField(max_length=20, null=True, blank=True)
    other_status = models.CharField(max_length=100, null=True, blank=True)
    pincode = models.CharField(max_length=6, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.user.username
    
class Resource(models.Model):
    RESOURCE_TYPES_CHOICES = [
        ('website', 'Website'),
        ('book', 'Book'),
        ('course', 'Course'),
    ]
    milestone = models.ForeignKey(Milestone, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    link = models.URLField()
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES_CHOICES)

    def __str__(self):
        return self.title

