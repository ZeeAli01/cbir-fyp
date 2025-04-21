import os
import cv2
import nibabel as nib
import numpy as np
from basicsr.archs.rrdbnet_arch import RRDBNet
from realesrgan import RealESRGANer

class ESRGANProcessor:
    def __init__(self):
        self.model_path = 'D:/CBIR/backend/weights/RealESRGAN_x4plus.pth'  # Your model path
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