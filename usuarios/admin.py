from django.contrib import admin
from actividades import *
from .models import *
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType


class UserAdmin(admin.ModelAdmin):
    search_fields = ['id','username','first_name','last_name','email','registro_interno']
    list_display = ['id','username','first_name','last_name','email','registro_interno']
    list_filter = ['profile']


class RolPermissionAdmin(admin.ModelAdmin):
    search_fields = ['id','name_profile','fk_group']
    list_display = ['id','name_profile','fk_group','is_active']
    list_filter = ['fk_group']




admin.site.register(User, UserAdmin)
admin.site.register(Permission)
admin.site.register(ContentType)
admin.site.register(RolPermission, RolPermissionAdmin)
