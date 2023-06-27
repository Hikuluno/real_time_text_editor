from django.contrib import admin
from django.urls import include, path, re_path

from backend import views
from backend.consumer import PracticeConsumer

websocket_urlpatterns = [
    re_path(r'', PracticeConsumer.as_asgi()),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path("", include("backend.urls")),
    re_path(r'ws/', include(websocket_urlpatterns)),
]
