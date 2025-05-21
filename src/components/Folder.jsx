import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink } from "react-router-dom";

export default function Folder({ path, text, isEnd }) {
  return (
    <NavLink end={isEnd} to={path} className="relative">
      {({ isActive }) => (
        <div
          className={`p-4 border bg-white hover:bg-gray-50 rounded-xl hover:shadow-md transition-all duration-300
            flex items-center gap-3 group max-sm:w-[calc(100vw-30px)]
            ${isActive ? "border-blue-500" : "border-gray-200"}
          `}
        >
          <div
            className={`text-xl transition-colors ${
              isActive ? "text-blue-600" : "text-blue-500"
            } group-hover:text-blue-600`}
          >
            <FontAwesomeIcon icon={faFolder} />
          </div>
          <p
            className={`font-medium transition-colors ${
              isActive ? "text-gray-900" : "text-gray-700"
            } group-hover:text-gray-900`}
          >
            {text}
          </p>
        </div>
      )}
    </NavLink>
  );
}
