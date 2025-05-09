import React from "react";

export default function ErrorPlaceHolder({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium text-red-600">
        {message}
      </p>
    </div>
  );
}
