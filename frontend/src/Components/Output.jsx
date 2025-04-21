import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  LinearScale,
} from "chart.js";
import {
  PieChart,
  User,
  Activity,
  Image as ImageIcon,
  Layers,
  Copy,
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, Title, LinearScale);

const Output = ({ inputImage }) => {
  const [tumorProbability, setTumorProbability] = useState(null);
  const [tumorType, setTumorType] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [augmentedImages, setAugmentedImages] = useState([]);
  const [similarImages, setSimilarImages] = useState([]);

  useEffect(() => {
    // Simulating API calls
    setTimeout(() => setTumorProbability(0.65), 1000);
    setTimeout(() => setTumorType("Glioblastoma"), 1500);
    setTimeout(
      () =>
        setAnalysis(
          "High probability of tumor detected. Further examination recommended."
        ),
      2000
    );
    setTimeout(
      () =>
        setEnhancedImage("src/assets/images/input.jpeg?height=300&width=300"),
      2500
    );
    setTimeout(
      () =>
        setAugmentedImages([
          "src/assets/images/input.jpeg?height=150&width=150",
          "src/assets/images/input.jpeg?height=150&width=150",
          "src/assets/images/input.jpeg?height=150&width=150",
        ]),
      3000
    );
    setTimeout(
      () =>
        setSimilarImages([
          {
            image: "src/assets/images/input.jpeg?height=150&width=150",
            similarity: 0.92,
          },
          {
            image: "src/assets/images/input.jpeg?height=150&width=150",
            similarity: 0.87,
          },
          {
            image: "src/assets/images/input.jpeg?height=150&width=150",
            similarity: 0.81,
          },
        ]),
      3500
    );
  }, []);

  const pieChartData = {
    labels: ["Tumor Probability", "Non-Tumor Probability"],
    datasets: [
      {
        data: [tumorProbability || 0, 1 - (tumorProbability || 0)],
        backgroundColor: ["red", "blue"],
        borderColor: ["red", "blue"],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Tumor Probability" },
    },
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen bg-gray-100 p-6 ">
        <h1 className="text-2xl font-semibold mb-6">MRI Analysis Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <StatCard
            icon={<PieChart />}
            title="Tumor Probability"
            value={`${(tumorProbability * 100).toFixed(0)}%`}
          />
          <StatCard icon={<User />} title="Patient ID" value="P12345" />
          <StatCard
            icon={<Activity />}
            title="Scan Date"
            value={new Date().toLocaleDateString()}
          />
        </div>

        {/* MRI Image and Pie Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Input MRI Scan</h3>
            <img
              src={"src/assets/images/input.jpeg?height=150&width=100"}
              alt="MRI Scan"
              className="w-full h-auto"
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">
              Tumor Probability Chart
            </h3>
            <div className="h-64">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>

        {/* Enhanced Image */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Enhanced MRI Image</h3>
          {enhancedImage ? (
            <img
              src={enhancedImage}
              alt="Enhanced MRI Scan"
              className="w-full h-auto max-w-md mx-auto"
            />
          ) : (
            <p>Enhancing image...</p>
          )}
        </div>

        {/* Augmented Images */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Augmented Images</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="rounded p-2">
              <img
                src="src/assets/images/input.jpeg?height=150&width=150"
                alt={`Augmented MRI Scan`}
                className="w-auto h-auto  transform rotate-90"
              />
              <p className="text-center mt-4 ">Augmentation 1</p>
            </div>
            <div className="rounded p-2">
              <img
                src="src/assets/images/input.jpeg?height=150&width=150"
                alt={`Augmented MRI Scan`}
                className="w-auto h-auto  transform rotate-180"
              />
              <p className="text-center mt-4 ">Augmentation 2</p>
            </div>
            <div className="rounded p-2">
              <img
                src="src/assets/images/input.jpeg?height=150&width=150"
                alt={`Augmented MRI Scan`}
                className="w-auto h-auto  transform rotate-270"
              />
              <p className="text-center mt-4">Augmentation 3</p>
            </div>
            <div className="rounded p-2">
              <img
                src="src/assets/images/input.jpeg?height=150&width=150"
                alt={`Augmented MRI Scan`}
                className="w-auto h-auto  transform rotate-120"
              />
              <p className="text-center mt-4">Augmentation 4</p>
            </div>
            <div className="rounded p-2">
              <img
                src="src/assets/images/input.jpeg?height=150&width=150"
                alt={`Augmented MRI Scan`}
                className="w-auto h-auto  transform rotate-40"
              />
              <p className="text-center mt-4">Augmentation 5</p>
            </div>
          </div>
        </div>

        {/* Similar MRI Images */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Similar Case Images</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {similarImages.map((img, index) => (
              <div key={index} className="border rounded p-2">
                <img
                  src={img.image}
                  alt={`Similar MRI Scan ${index + 1}`}
                  className="w-full h-auto rotate-180"
                />
                <p className="text-center mt-2">
                  Similarity: {(img.similarity * 100).toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis and Tumor Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Analysis</h3>
            <p className="font-bold">{analysis}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Tumor Type</h3>
            <p>{tumorType || "Analyzing..."}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Final Diagnosis</h3>
            <p className="font-semibold">Brain Cancer</p>
          </div>
        </div>
      </div>
    </>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow flex items-center">
    <div className="mr-4 text-blue-500">{icon}</div>
    <div>
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

export default Output;
