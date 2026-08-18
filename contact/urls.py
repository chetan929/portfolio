from django.urls import path
from . import views

app_name = "contact"

urlpatterns = [
    path("send-message/", views.send_contact_message, name="send_message"),
]
