import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader = ({ onFileChange, preview }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);
      onFileChange(file, previewUrl);
    }
  }, [onFileChange]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"]
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });
  
  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? "border-blue-500 bg-blue-50" 
            : "border-gray-300 hover:border-blue-400"
          }
        `}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="flex flex-col items-center">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-48 object-contain mb-2" 
            />
            <p className="text-sm text-gray-500">
              Drag a new image to replace, or click to select
            </p>
          </div>
        ) : (
          <div className="py-8">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              stroke="currentColor" 
              fill="none" 
              viewBox="0 0 48 48" 
              aria-hidden="true"
            >
              <path 
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your product image here, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, WEBP up to 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
