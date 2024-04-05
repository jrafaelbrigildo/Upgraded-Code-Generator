from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('view-response/', views.generate_solution_view, name='generate_solution_view'),
]