// components/ui/button.js
import React from 'react';

export const Button = ({ children, onClick, variant, className, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition ${className} ${
        variant === "outline" ? "border border-gray-300" : "bg-blue-500 text-white"
      }`}
      {...props}
    >
      {children}
    </button>
  );
};
