import React from "react";

const aspectRatios = [
  { id: "1:1", label: "1:1", description: "Square" },
  { id: "4:3", label: "4:3", description: "Standard" },
  { id: "16:9", label: "16:9", description: "Landscape" },
  { id: "9:16", label: "9:16", description: "Portrait" },
];

const AspectRatioSelector = ({ selected, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Aspect Ratio
      </label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {aspectRatios.map((ratio) => (
          <button
            key={ratio.id}
            type="button"
            className={`border rounded-md py-2 px-3 text-sm transition ${
              selected === ratio.id
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
            onClick={() => onChange(ratio.id)}
          >
            <div className="font-medium">{ratio.label}</div>
            <div className="text-xs text-gray-500">{ratio.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
