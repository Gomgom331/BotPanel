from django.contrib import admin
from django.urls import path, include
from .views import SidebarMenuView

urlpatterns = [
    path('menu/', include([
        path('sidebar/', SidebarMenuView.as_view(), name='sidebar')
    ]))
]
