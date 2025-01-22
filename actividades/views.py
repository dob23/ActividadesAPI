from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import View
from .models import Task
from .forms import TaskForm

class TaskListView(View):
    template_name = 'task_list.html'  # Asegúrate de que este nombre sea correcto

    def get(self, request, *args, **kwargs):
        pending_tasks = Task.objects.filter(status_task='pending')
        inprogress_tasks = Task.objects.filter(status_task='inprogress')
        completed_tasks = Task.objects.filter(status_task='completed')
        return render(request, self.template_name, {
            'pending_tasks': pending_tasks,
            'inprogress_tasks': inprogress_tasks,
            'completed_tasks': completed_tasks
        })

class TaskCreateView(View):
    template_name = 'task_form.html'  # Asegúrate de que este nombre sea correcto

    def get(self, request, *args, **kwargs):
        form = TaskForm()
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        form = TaskForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('task_list')
        return render(request, self.template_name, {'form': form})

class TaskUpdateView(View):
    template_name = 'task_form.html'  # Asegúrate de que este nombre sea correcto

    def get(self, request, pk, *args, **kwargs):
        task = get_object_or_404(Task, pk=pk)
        form = TaskForm(instance=task)
        return render(request, self.template_name, {'form': form})

    def post(self, request, pk, *args, **kwargs):
        task = get_object_or_404(Task, pk=pk)
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            return redirect('task_list')
        return render(request, self.template_name, {'form': form})

class TaskDeleteView(View):

    def get(self, request, pk, *args, **kwargs):
        task = get_object_or_404(Task, pk=pk)
        task.delete()
        return redirect('task_list')