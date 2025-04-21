import { useState, useEffect } from "react";
import { FaKey } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ApiKeyManagement() {
  const [accessToken, setAccessToken] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccessToken(localStorage.getItem("accessToken"));
    }
  }, []);

  const handleGenerateApiClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/apikeys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data) {
        setApiKey(data.api_key);
        toast.success("API key generated successfully");
      }
    } catch (error) {
      console.error("Error creating new API key:", error);
      toast.error("Failed to generate API key. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(apiKey);
    toast.info("API key copied to clipboard");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Manage API Key</h2>
        <button
          onClick={handleGenerateApiClick}
          disabled={isLoading || !!apiKey}
          className="w-full py-3 text-lg font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
        >
          <FaKey className="mr-2 text-2xl" />
          {isLoading ? "Generating..." : "Generate API Key"}
        </button>

        {apiKey && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner">
            <p className="text-sm font-medium text-gray-700 mb-2">Your API Key:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={apiKey}
                readOnly
                className="flex-grow font-mono text-sm bg-white border p-2 rounded-lg"
              />
              <button
                onClick={handleCopyClick}
                className="p-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors duration-300"
              >
                <IoCopyOutline className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Keep this key secure. Do not share it publicly.</p>
          </div>
        )}
      </div>
      {/* Add ToastContainer at the bottom */}
      <ToastContainer />
    </div>
  );
}

export default ApiKeyManagement;
