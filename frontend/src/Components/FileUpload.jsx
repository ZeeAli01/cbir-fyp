import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [modality, setModality] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && uploadedFile.name.endsWith(".nii")) {
      setFile(uploadedFile);
    } else {
      alert("Please upload a valid NIfTI (.nii) file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/x-nifti": [".nii"],
    },
  });

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    if (!modality) {
      alert("Please select a modality before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("modality", modality);

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/process-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process the image.");
      }

      const data = await response.json();
      setProcessedImages(data.images);
      alert("Image processed successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing the image. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
        <div className="flex w-full max-w-6xl h-[600px] bg-blue-100">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-1/2 p-8 flex flex-col justify-center"
          >
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
              Brain MRI Upload
            </h1>

            <select
              value={modality}
              onChange={(e) => setModality(e.target.value)}
              className="mb-4 p-2 border rounded-lg text-gray-700"
            >
              <option value="">Select Modality</option>
              <option value="t1">T1</option>
              <option value="t2">T2</option>
              <option value="flair">FLAIR</option>
              <option value="t1ce">T1CE</option>
            </select>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <input {...getInputProps()} />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {file ? (
                  <p className="text-blue-700">File selected: {file.name}</p>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      Drag and drop your .nii file here, or click to select
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      (NIfTI files only)
                    </p>
                  </>
                )}
              </motion.div>
            </div>
            {file && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? "Processing..." : "Start Diagnosis"}
              </motion.button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-1/2 p-8 flex flex-col justify-center"
          >
            <h2 className="text-2xl font-bold text-blue-900 text-center">
              Processed Images
            </h2>
            {processedImages.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {processedImages.map((image, index) => (
                  <img
                    key={index}
                    src={`data:image/png;base64,${image}`}
                    alt={`Processed ${index + 1}`}
                    className="w-full h-auto rounded-md border border-gray-300"
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-center text-gray-700">
                Upload an image to see the processed results.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
