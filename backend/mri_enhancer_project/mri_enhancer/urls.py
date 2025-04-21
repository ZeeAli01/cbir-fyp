from django.urls import path
from .views import EnhanceMRIView, GetEnhancedImageView

urlpatterns = [
    path('enhance/', EnhanceMRIView.as_view(), name='enhance-mri'),
    path('get-enhanced/<int:pk>/', GetEnhancedImageView.as_view(), name='get-enhanced'),
]