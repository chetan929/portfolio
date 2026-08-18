from django.urls import path, include
from django.contrib import admin
from django.views.static import serve
from django.conf import settings
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("contact.urls")),
]

# Serve static files and HTML
if settings.DEBUG:
    urlpatterns += [
        path(
            "", lambda request: serve(request, "home.html", document_root=str(BASE_DIR))
        ),
        path(
            "style.css",
            lambda request: serve(request, "style.css", document_root=str(BASE_DIR)),
        ),
        path(
            "script.js",
            lambda request: serve(request, "script.js", document_root=str(BASE_DIR)),
        ),
        path(
            "<path:path>",
            lambda request, path: serve(request, path, document_root=str(BASE_DIR)),
        ),
    ]
