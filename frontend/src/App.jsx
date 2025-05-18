import React, { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import "./App.css";
import ImageUploader from "./components/ImageUploader";
import PromptForm from "./components/PromptForm";
import AspectRatioSelector from "./components/AspectRatioSelector";
import GeneratedImage from "./components/GeneratedImage";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileChange = (uploadedFile, previewUrl) => {
    setFile(uploadedFile);
    setPreview(previewUrl);
    setGeneratedImage(null);
  };
  
  const handleGenerateImage = async () => {
    if (!file || !prompt) {
      toast.error("Please upload an image and enter a prompt");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("prompt", prompt);
      formData.append("aspect_ratio", aspectRatio);
      
      const response = await axios.post("/api/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        timeout: 60000
      });
      
      setGeneratedImage(response.data.image_url);
      toast.success("Your product shot is ready!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to generate image");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <Toaster position="top-center" />
      
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center">Product Shot Generator</h1>
        <p className="text-center text-gray-600 mt-2">
          Transform your product images into professional marketing shots
        </p>
      </header>
      
      <main className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Source Image</h2>
            <ImageUploader onFileChange={handleFileChange} preview={preview} />
            
            <div className="mt-6">
              <PromptForm 
                prompt={prompt}
                setPrompt={setPrompt}
                onSubmit={handleGenerateImage}
                isLoading={isLoading}
              />
            </div>
            
            <div className="mt-4">
              <AspectRatioSelector 
                selected={aspectRatio} 
                onChange={setAspectRatio} 
              />
            </div>
            
            <button
              className={`mt-6 w-full px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                isLoading 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              onClick={handleGenerateImage}
              disabled={isLoading || !file || !prompt}
            >
              {isLoading ? "Generating..." : "Generate Product Shot"}
            </button>
            
            {isLoading && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 animate-pulse">
                  Processing your image... This may take up to a minute
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
            <GeneratedImage image={generatedImage} isLoading={isLoading} />
          </div>
        </div>
      </main>
      
      <footer className="max-w-4xl mx-auto mt-12 text-center text-gray-500 text-sm">
        <p>Powered by OpenAI Image Generation API</p>
      </footer>
    </div>
  );
}

export default App;
