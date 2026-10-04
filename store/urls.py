# store/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, home_view, ai_chat_view

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', home_view, name='home'),
    path('api/', include(router.urls)),
    path('api/chat/', ai_chat_view, name='ai-chat'), # <-- Add this line
]
