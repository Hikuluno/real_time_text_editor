from django.contrib import admin
from django.urls import path

from backend import views

urlpatterns = [
    path("", views.index, name="index"),
    path("test", views.test, name="index"),

]
