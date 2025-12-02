from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('notifications/', include([
        # path('', .as_view(), name='sidebar')
    ]))
]
