from rest_framework import serializers
from .models import MRIImage

class MRIImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MRIImage
        fields = ['id', 'image', 'enhanced_image', 'modality', 'uploaded_at']