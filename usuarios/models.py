from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.forms import model_to_dict
from crum import get_current_user


class User(AbstractUser):
    profile = models.CharField(max_length=150, verbose_name='perfil')
    date_joined = models.DateTimeField(null=True, blank=True)
    registro_interno = models.IntegerField(default=0, verbose_name='registro interno')

    # Resolver conflictos de nombres con related_name
    groups = models.ManyToManyField(Group,related_name='custom_user_set',blank=True,verbose_name='Grupos')
    user_permissions = models.ManyToManyField(Permission,related_name='custom_user_permissions', blank=True,verbose_name='Permisos de usuario')

    def toJSON(self):
        item = model_to_dict(self)
        if not self.groups.all():
            item['groups'] = [{'id': 0, 'name': 'Desconocido'}]
        else:
            item['groups'] = [{'id': g.id, 'name': g.name} for g in self.groups.all()]
        return item

    def get_group_session(self):
        try:
            request = get_current_user()
            groups = self.groups.all()
            if groups.exists():
                if 'group' not in request.session:
                    request.session['group'] = groups[0]
        except:
            pass

    def toGetListJSON(self):
        item = model_to_dict(self, fields=['id', 'username', 'first_name', 'last_name'])
        return item


class RolPermission(models.Model):
    name_profile = models.CharField(max_length=150, verbose_name='Rol de Perfil', unique=True)
    fk_group = models.ForeignKey(Group, on_delete=models.CASCADE, verbose_name='Grupo')
    is_active = models.BooleanField(default=True, verbose_name='Estado')

    def __str__(self) -> str:
        return f"{self.name_profile}"

    class Meta:
        db_table = 'user_user_rol_permission'
        verbose_name = 'Rol de Perfil'
        verbose_name_plural = 'Roles de Perfil'
        ordering = ['fk_group']
