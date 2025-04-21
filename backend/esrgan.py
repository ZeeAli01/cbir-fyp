# settings.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'your-secret-key-here'
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'mri_enhancer',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True  # For development only
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# urls.py (project level)
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('mri_enhancer.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# mri_enhancer/models.py
from django.db import models

class MRIImage(models.Model):
    image = models.FileField(upload_to='uploads/')
    enhanced_image = models.FileField(upload_to='enhanced/', null=True, blank=True)
    modality = models.CharField(max_length=10)
    uploaded_at = models.DateTimeField(auto_now_add=True)

# mri_enhancer/serializers.py
from rest_framework import serializers
from .models import MRIImage

class MRIImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MRIImage
        fields = ['id', 'image', 'enhanced_image', 'modality', 'uploaded_at']

# mri_enhancer/urls.py
from django.urls import path
from .views import EnhanceMRIView, GetEnhancedImageView

urlpatterns = [
    path('enhance/', EnhanceMRIView.as_view(), name='enhance-mri'),
    path('get-enhanced/<int:pk>/', GetEnhancedImageView.as_view(), name='get-enhanced'),
]

# mri_enhancer/esrgan_processor.py
import os
import cv2
import nibabel as nib
import numpy as np
from basicsr.archs.rrdbnet_arch import RRDBNet
from realesrgan import RealESRGANer

class ESRGANProcessor:
    def __init__(self):
        self.model_path = '/D/CBIR/backend/weights/RealESRGAN_x4plus.pth'  # Update this path
        self.model = None
        self.setup_model()

    def setup_model(self):
        model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
        self.model = RealESRGANer(
            scale=4,
            model_path=self.model_path,
            model=model,
            tile=0,
            tile_pad=10,
            pre_pad=0,
            half=True
        )

    def process_nii(self, input_path, output_path, axis=2):
        nii_image = nib.load(input_path)
        original_data = nii_image.get_fdata()
        affine = nii_image.affine
        header = nii_image.header

        enhanced_slices = []
        for i in range(original_data.shape[axis]):
            slice_img = (
                original_data.take(indices=i, axis=axis) / np.max(original_data) * 255
            ).astype(np.uint8)
            slice_img = np.stack([slice_img] * 3, axis=-1)

            enhanced_img, _ = self.model.enhance(slice_img, outscale=4)
            enhanced_gray = cv2.cvtColor(enhanced_img, cv2.COLOR_BGR2GRAY)
            enhanced_slices.append(enhanced_gray)

        enhanced_data = np.stack(enhanced_slices, axis=axis).astype(np.int16)
        enhanced_nii = nib.Nifti1Image(enhanced_data, affine, header)
        nib.save(enhanced_nii, output_path)
        
        return output_path

# mri_enhancer/views.py
import os
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MRIImage
from .serializers import MRIImageSerializer
from .esrgan_processor import ESRGANProcessor

class EnhanceMRIView(APIView):
    def post(self, request):
        try:
            image_file = request.FILES.get('image')
            modality = request.data.get('modality')
            
            if not image_file or not modality:
                return Response(
                    {'error': 'Both image and modality are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Save the uploaded image
            mri_image = MRIImage.objects.create(
                image=image_file,
                modality=modality
            )

            # Process the image
            processor = ESRGANProcessor()
            input_path = os.path.join(settings.MEDIA_ROOT, str(mri_image.image))
            output_filename = f'enhanced_{os.path.basename(input_path)}'
            output_path = os.path.join(settings.MEDIA_ROOT, 'enhanced', output_filename)

            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Process the image and save the enhanced version
            processor.process_nii(input_path, output_path)
            
            # Update the model with the enhanced image path
            mri_image.enhanced_image = f'enhanced/{output_filename}'
            mri_image.save()

            serializer = MRIImageSerializer(mri_image)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GetEnhancedImageView(APIView):
    def get(self, request, pk):
        try:
            mri_image = MRIImage.objects.get(pk=pk)
            serializer = MRIImageSerializer(mri_image)
            return Response(serializer.data)
        except MRIImage.DoesNotExist:
            return Response(
                {'error': 'Image not found'},
                status=status.HTTP_404_NOT_FOUND
            )

# requirements.txt
