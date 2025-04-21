from django.db import models

class MRIImage(models.Model):
    image = models.FileField(upload_to='uploads/')
    enhanced_image = models.FileField(upload_to='enhanced/', null=True, blank=True)
    modality = models.CharField(max_length=10)
    uploaded_at = models.DateTimeField(auto_now_add=True)