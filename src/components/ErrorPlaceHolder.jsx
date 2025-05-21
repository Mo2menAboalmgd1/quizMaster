import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function ErrorPlaceHolder({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-4xl"/>
      <p className="mt-4 text-lg font-medium">
        {message}
      </p>
    </div>
  );
}
