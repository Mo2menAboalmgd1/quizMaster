import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

export default function StageFolder({ stage }) {
  return (
    <Link to={`/stages/${stage}`}>
      <div className="p-4 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl hover:shadow-md transition-all duration-300 w-fit flex items-center gap-3 group">
        <div className="text-blue-500 group-hover:text-blue-600 transition-colors">
          <FontAwesomeIcon icon={faFolder} className="text-xl" />
        </div>
        <p className="font-medium text-gray-700 group-hover:text-gray-900">
          {stage}
        </p>
      </div>
    </Link>
  );
}
