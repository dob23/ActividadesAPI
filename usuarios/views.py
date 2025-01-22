from django.http import HttpResponseRedirect
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.contrib.auth.views import LoginView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import RedirectView, View
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import Group
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib import messages

class UserLoginView(View):
    template_name = 'loginUp.html'

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(reverse_lazy('actvidades:Task_list'))
        return render(request, self.template_name, {"title": "Login"})
    
    @method_decorator(csrf_exempt)
    def post(self, request, *args,**kwargs):
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)
            tokens = {
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }
            messages.success(request, "Inicio de sesion exitoso")
            return redirect(reverse_lazy('actividades:Task_list'))
        else:
            return render(request, self.template_name,{
                "error": "Credenciales Incorrectas",
                "title": "Login",
            })

class LogoutRedirectView(RedirectView):
    pattern_name = 'login'

    def dispatch(self, request, *args, **kwargs):
        logout(request)
        messages.info(request, "Has Cerrado sesion correctamente")
        return super().dispatch(request, *args, **kwargs)
    
class UserChangeGroup(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        try:
            group = Group.objects.get(pk=self.kwargs['pk'])
            request.user.groups.clear()
            request.user.groups.add(group)
            request.session['group'] = group 
            messages.success(request, f"grupo cambiado a {group.name}")
        except Group.DoesNotExist:
            messages.error(request,"El grupo no existe")
        return HttpResponseRedirect(reverse_lazy('actividades:Task_list')) 