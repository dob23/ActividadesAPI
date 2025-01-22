from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import View
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib import messages

class UserLoginView(View):
    template_name = 'loginUp.html'

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(reverse_lazy('actividades:Task_list'))
        
        form = AuthenticationForm()
        # Añadir clases y atributos manualmente
        form.fields['username'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Usuario',
            'autocomplete': 'off'
        })
        form.fields['password'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Contraseña',
            'autocomplete': 'off'
        })
        return render(request, self.template_name, {"title": "Login", "form": form})

    def post(self, request, *args, **kwargs):
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            login(request, form.get_user())
            messages.success(request, "Inicio de sesión exitoso")
            return redirect(reverse_lazy('actividades:Task_list'))
        else:
            return render(request, self.template_name, {
                "title": "Login",
                "form": form,
                "error": "Credenciales incorrectas. Intenta de nuevo."
            })


class LogoutRedirectView(View):
    def get(self, request, *args, **kwargs):
        logout(request)
        messages.info(request, "Has cerrado sesión correctamente.")
        return redirect(reverse_lazy('user:login'))