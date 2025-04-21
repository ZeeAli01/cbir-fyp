import React, { useState, useEffect, useCallback } from "react";

import {
  FaBrain,
  FaUserMd,
  FaChartLine,
  FaHistory,
  FaUpload,
  FaSearch,
  FaSave,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import Navbar from "./Navbar";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth";

const LandingPage = () => {
  const navigateTo = useNavigate();
  const { isLoggedIn, role_id, username } = useAuth();

  const location = useLocation();

  const pages = [
    { navlink: "HOME", path: "/" },
    { navlink: "DIAGNOSE", path: "/upload" },
    { navlink: "DASHBOARD", path: "/output" },
    { navlink: "API", path: "/apikey" },
    { navlink: "AUDIT", path: "/audit" },
  ];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);

  const carouselItems = [
    {
      title: "Advanced Brain Cancer Diagnosis",
      description: "Using cutting-edge AI technology",
    },
    {
      title: "Faster and More Accurate Results",
      description: "Empowering medical professionals",
    },
    {
      title: "Comprehensive MRI Analysis",
      description: "Leveraging our extensive database",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    multiple: false,
  });

  const handleUpload = () => {
    if (uploadedFile) {
      // // Here you would typically send the file to your server
      // console.log("Uploading file:", uploadedFile.name);
      // // Reset the uploaded file after processing
      // setUploadedFile(null);
      isLoggedIn ? navigateTo("/upload") : navigateTo("/login");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-blue-900 text-blue-900">
        <header className="bg-blue-900 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="landingpg-h1 text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight text-blue-900">
                  Revolutionize Brain Cancer Diagnosis
                </h1>
                <p className="text-xl text-navy-100 mb-8 text-blue-900">
                  Use our advanced CBIR system to analyze MRI scans, compare
                  with our extensive database, and get accurate insights for
                  better patient care. Empower your diagnostic process with
                  cutting-edge AI technology.
                </p>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    to={isLoggedIn ? "/upload" : "/login"}
                    className="bg-white text-blue-900 px-8 py-3 rounded-full text-lg font-semibold transition transform hover:scale-105 hover:bg-blue-100 relative overflow-hidden group"
                  >
                    <span className="relative z-10 text-blue-900">
                      Get started for free
                    </span>
                    <span className="absolute inset-0 bg-blue-200 opacity-25 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="src/assets/images/bg.jpg?height=400&width=400"
                  alt="Doctor analyzing MRI scan"
                  className="w-full h-auto object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </header>

        <section className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-blue-900">
              GREAT DIAGNOSES START WITH A SCAN
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-blue-900">
              Upload an MRI scan and put our CBIR system to work
            </h3>
            <div className="bg-blue-100 rounded-lg p-8 max-w-2xl mx-auto">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-blue-600 rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "bg-blue-200" : "hover:bg-blue-50"
                }`}
              >
                <input {...getInputProps()} />
                <FaUpload className="text-4xl text-blue-600 mx-auto mb-4" />
                {uploadedFile ? (
                  <p className="text-blue-900">
                    File selected: {uploadedFile.name}
                  </p>
                ) : isDragActive ? (
                  <p className="text-blue-900">Drop the MRI image here ...</p>
                ) : (
                  <p className="text-blue-900">
                    Drag & drop an MRI image here, or click to select a file
                  </p>
                )}
              </div>
              <button
                onClick={handleUpload}
                disabled={!uploadedFile}
                className={`mt-4 w-full bg-blue-600 text-blue-900 px-4 py-2 rounded-md font-semibold transition ${
                  uploadedFile
                    ? "hover:bg-blue-700"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                Analyze MRI Scan
              </button>
            </div>
          </div>
        </section>

        <section className="bg-blue-900 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="carousel relative">
              {carouselItems.map((item, index) => (
                <div
                  key={index}
                  className={`transition-opacity duration-500 ${
                    index === currentSlide
                      ? "opacity-100"
                      : "opacity-0 absolute"
                  }`}
                >
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center text-blue-900 animate-fade-in-down">
                    {item.title}
                  </h2>
                  <p className="text-xl text-navy-100 mb-8 text-center animate-fade-in-up">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide
                      ? "bg-white"
                      : "bg-blue-300 bg-opacity-50"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                ></button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;
