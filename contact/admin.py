from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at", "is_read")
    list_filter = ("created_at", "is_read")
    search_fields = ("name", "email", "message")
    readonly_fields = ("created_at",)

    fieldsets = (
        ("Message Info", {"fields": ("name", "email", "message", "created_at")}),
        ("Status", {"fields": ("is_read",)}),
    )
