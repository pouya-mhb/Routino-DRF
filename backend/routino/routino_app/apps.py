
from django.apps import AppConfig

class RoutinoAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'routino_app'

    def ready(self):
        import routino_app.signals