// src/components/Loading.jsx
import React from "react";

const Loading = ({ text = "Loading...", size = 12 }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-${size} h-${size} border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}
        ></div>
        <p className="text-white text-lg">{text}</p>
      </div>
    </div>
  );
};

export default Loading;
