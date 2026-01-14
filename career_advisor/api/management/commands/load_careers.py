# api/management/commands/load_sih_data.py

import csv
from django.core.management.base import BaseCommand
from api.models import Sector, Field, Career, Milestone, Resource

class Command(BaseCommand):
    help = 'Loads all initial data from the data/ directory'

    def handle(self, *args, **kwargs):
        # The order of these function calls is very important!
        self.load_sectors('data/sectors.csv')
        self.load_fields('data/fields.csv')
        self.load_careers('data/careers.csv')
        self.load_milestones('data/milestones.csv')
        self.load_resources('data/resources.csv')
        self.stdout.write(self.style.SUCCESS('\nFinished loading all SIH data.'))

    def load_sectors(self, file_path):
        self.stdout.write(self.style.SUCCESS('Loading Sectors...'))
        with open(file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                Sector.objects.get_or_create(name=row['name'])
        self.stdout.write(self.style.SUCCESS('--- Sectors loaded successfully ---\n'))

    def load_fields(self, file_path):
        self.stdout.write(self.style.SUCCESS('Loading Fields...'))
        with open(file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                try:
                    sector = Sector.objects.get(name=row['sector_name'])
                    Field.objects.get_or_create(name=row['name'], sector=sector)
                except Sector.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"Sector '{row['sector_name']}' not found. Skipping field '{row['name']}'."))
        self.stdout.write(self.style.SUCCESS('--- Fields loaded successfully ---\n'))

    def load_careers(self, file_path):
        self.stdout.write(self.style.SUCCESS('Loading Careers...'))
        with open(file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                try:
                    field = Field.objects.get(name=row['field_name'])
                    Career.objects.get_or_create(
                        name=row['name'],
                        defaults={'description': row['description'], 'field': field}
                    )
                except Field.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"Field '{row['field_name']}' not found. Skipping career '{row['name']}'."))
        self.stdout.write(self.style.SUCCESS('--- Careers loaded successfully ---\n'))

    def load_milestones(self, file_path):
        self.stdout.write(self.style.SUCCESS('Loading Milestones...'))
        with open(file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                milestone, _ = Milestone.objects.get_or_create(
                    title=row['title'],
                    defaults={'description': row['description'], 'target_class': int(row['target_class'])}
                )
                if row.get('related_careers'):
                    career_names = [name.strip() for name in row['related_careers'].split('|')]
                    careers = Career.objects.filter(name__in=career_names)
                    milestone.careers.set(careers)
        self.stdout.write(self.style.SUCCESS('--- Milestones loaded successfully ---\n'))
    
    def load_resources(self, file_path):
        self.stdout.write(self.style.SUCCESS('Loading Resources...'))
        with open(file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                try:
                    milestone = Milestone.objects.get(title=row['milestone_title'])
                    Resource.objects.get_or_create(
                        link=row['link'],
                        defaults={'milestone': milestone, 'title': row['title'], 'resource_type': row['resource_type']}
                    )
                except Milestone.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"Milestone '{row['milestone_title']}' not found. Skipping resource '{row['title']}'."))
        self.stdout.write(self.style.SUCCESS('--- Resources loaded successfully ---\n'))