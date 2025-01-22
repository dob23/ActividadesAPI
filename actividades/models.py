from django.db import models
from .choices import STATUS_CHOICES

class Task(models.Model):
    name_task = models.CharField(max_length=150, verbose_name="Nombre Tarea")
    description_task = models.TextField(verbose_name="Descripción")
    status_task = models.CharField(max_length=50, choices=STATUS_CHOICES, verbose_name="Estado")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name_task