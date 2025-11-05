from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(
            user_profile=instance,
            userName=instance.username,
            firstName=instance.first_name or '',
            lastName=instance.last_name or '',
            email=instance.email or '',
            age=18,
            gender='male'
        )