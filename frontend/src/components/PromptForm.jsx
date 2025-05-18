import React from "react";

const PromptForm = ({ prompt, setPrompt, onSubmit, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
        Prompt Description
      </label>
      
      <textarea
        id="prompt"
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder='Describe how you want your product to appear (e.g., "My black coffee mug on a wooden table with morning sunlight, professional product photography")'
        rows={3}
        disabled={isLoading}
        required
      />
      
      <p className="mt-1 text-xs text-gray-500">
        Be specific about setting, lighting, angle, and style for best results
      </p>
    </form>
  );
};

export default PromptForm;
