import os
import sys
import django
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# Configure Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.core.wsgi import get_wsgi_application

# Create WSGI application
application = get_wsgi_application()

# Export for Vercel
app = application
