import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function NoDataPlaceHolder({ message, icon }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300 p-6">
      <FontAwesomeIcon icon={icon} className="text-gray-400 text-5xl mb-4" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
}
