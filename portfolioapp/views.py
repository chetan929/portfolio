from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.contrib import messages
from django.conf import settings

def home(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message_text = request.POST.get('message')

        if not name or not email or not message_text:
            messages.error(request, "❌ All fields are required.")
        else:
            subject = f"New Contact Message from {name}"
            body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message_text}"

            try:
                send_mail(
                    subject,
                    body,
                    settings.EMAIL_HOST_USER,              # sender email (from settings)
                    ['prajapatiayush1222@gmail.com'],          # 💡 replace with your own email
                    fail_silently=False,
                )
                messages.success(request, "✅ Your message has been sent!")
            except Exception as e:
                print("Email error:", e)
                messages.error(request, "❌ Failed to send your message. Try again later.")

        return redirect('home')  # refresh without resubmitting form

    return render(request, 'portfolioapp/home.html')
