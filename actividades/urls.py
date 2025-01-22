from django.urls import path
from .views import TaskListView, TaskCreateView, TaskUpdateView, TaskDeleteView

urlpatterns = [
    path('', TaskListView.as_view(), name='task_list'),
    path('tasks/new/', TaskCreateView.as_view(), name='new_task'),
    path('tasks/edit/<int:pk>/', TaskUpdateView.as_view(), name='edit_task'),
    path('tasks/delete/<int:pk>/', TaskDeleteView.as_view(), name='delete_task'),
]