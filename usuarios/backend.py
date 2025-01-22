from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models import User
from django.core.exceptions import ValidationError


class SimpleJWTAuthBackend(BaseBackend):
    """
    Backend de autenticación personalizado con SimpleJWT.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            if not username or not password:
                raise ValidationError("Faltan credenciales")
            
            user = User.objects.filter(username=username).first()
            if not user:
                raise ValidationError("Usuario no encontrado")

            
            if not check_password(password, user.password):
                raise ValidationError("Contraseña incorrecta")

            
            return user

        except Exception as e:
            raise ValidationError(f"Error al autenticar: {str(e)}")

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None


# Generar Tokens JWT
def generate_tokens(user):
    """
    Genera un par de tokens (access y refresh) para el usuario autenticado.
    """
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }
