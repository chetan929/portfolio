import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactMessage


@csrf_exempt
@require_http_methods(["POST"])
def send_contact_message(request):
    """
    Handle contact form submission and send email
    """
    try:
        # Parse JSON data
        data = json.loads(request.body)

        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        message = data.get("message", "").strip()

        # Validation
        if not all([name, email, message]):
            return JsonResponse(
                {"success": False, "error": "All fields are required"}, status=400
            )

        if len(name) < 2 or len(name) > 100:
            return JsonResponse(
                {
                    "success": False,
                    "error": "Name must be between 2 and 100 characters",
                },
                status=400,
            )

        if len(message) < 10 or len(message) > 5000:
            return JsonResponse(
                {
                    "success": False,
                    "error": "Message must be between 10 and 5000 characters",
                },
                status=400,
            )

        # Save to database
        contact_msg = ContactMessage.objects.create(
            name=name, email=email, message=message
        )

        # Send email to you
        email_subject = f"New Contact Message from {name}"
        email_body = f"""
New message from your portfolio contact form:

Name: {name}
Email: {email}
Date: {contact_msg.created_at}

Message:
{message}

---
Reply to: {email}
        """

        try:
            send_mail(
                subject=email_subject,
                message=email_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.RECIPIENT_EMAIL],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Error sending email: {e}")
            # Even if email fails, message is saved to database

        # Send confirmation email to visitor
        confirmation_subject = "Thank you for contacting me"
        confirmation_body = f"""
Hi {name},

Thank you for reaching out! I received your message and will get back to you as soon as possible.

Best regards,
Chetan Kumar Prajapati
        """

        try:
            send_mail(
                subject=confirmation_subject,
                message=confirmation_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Error sending confirmation email: {e}")

        return JsonResponse(
            {
                "success": True,
                "message": "Message sent successfully! I will get back to you soon.",
            }
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {"success": False, "error": "Invalid JSON format"}, status=400
        )
    except Exception as e:
        print(f"Error in send_contact_message: {e}")
        return JsonResponse(
            {
                "success": False,
                "error": "An error occurred while processing your request",
            },
            status=500,
        )
