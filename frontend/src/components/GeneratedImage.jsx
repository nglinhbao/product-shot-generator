import React from "react";

const GeneratedImage = ({ image , isLoading }) => {
  const handleDownload = () => {
    if (!image) return;
    
    // If image is a URL
    const link = document.createElement("a");
    link.href = image;
    link.setAttribute("download", "product-shot.png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {image ? (
        <>
          <div className="w-full aspect-square flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden mb-4">
            {/* Use the image URL directly */}
            <img 
              src={image} 
              alt="Generated product shot" 
              className="max-w-full max-h-full object-contain" 
            />
          </div>
          
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleDownload}
          >
            Download Image
          </button>
        </>
      ) : (
        <div className="w-full aspect-square flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 text-center p-8">
          {isLoading ? (
            <p>Generating your product shot...</p>
          ) : (
            <p>Generated image will appear here</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GeneratedImage;