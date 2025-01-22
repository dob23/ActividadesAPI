from django.urls import path
from usuarios.views import UserLoginView, LogoutRedirectView

app_name = 'usuarios'

urlpatterns = [
    path('', UserLoginView.as_view(), name='login'),  # Página de inicio
    path('logout/', LogoutRedirectView.as_view(), name='logout'),
]
