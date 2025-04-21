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