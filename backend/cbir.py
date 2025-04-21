from flask import Flask, request, jsonify
from flask_cors import CORS
import nibabel as nib
import numpy as np
import base64
import io
import re
from queryimage import query_image
from io import BytesIO

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


def process_image(image):
    """
    Process the input image and return a list of processed images.
    This example includes converting the image to grayscale and resizing it.
    """
    try:
        # Get image data as a numpy array
        image_data = image.get_fdata()
        print(f"Image data shape: {image_data.shape}")

        # Process the image with the query_image function
        resultant_images = query_image(image_data, 't1')
        print (len(resultant_images))
        print(resultant_images[0].shape)
        return resultant_images
    except Exception as e:
        print(f"Error in process_image: {str(e)}")
        raise


@app.route('/process-image', methods=['POST'])
def process_image_endpoint():
    try:
        # Check if the file exists in the request
        if 'image' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['image']
        if not file.filename.endswith('.nii'):
            return jsonify({'error': 'Only .nii files are supported'}), 400
        match = re.search(r'_(\d{3})_', file.filename)
        if match:
            extracted_value = match.group(1)


        address=fr"C:\Users\sufya\Desktop\Final year Project\archive\BraTS2020_ValidationData\MICCAI_BraTS2020_ValidationData\BraTS20_Validation_{extracted_value}\{file.filename}"
        # Log the filename and file size to ensure it's received
        print(f"File received: {address}")



        # Try loading the NIfTI file from the BytesIO object
        try:
            nifti_image = nib.load(address)
            print("NIfTI file successfully loaded.")
        except Exception as e:
            print(f"Error loading NIfTI file: {str(e)}")
            return jsonify({'error': 'Failed to load the NIfTI file'}), 400

        # Process the NIfTI image
        processed_images = process_image(nifti_image)

        # Return the processed images as a JSON response
        return jsonify({'images': processed_images})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
