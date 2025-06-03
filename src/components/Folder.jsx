import { faFolder, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";
import { ClosedFolderSVG, OpenedFolderSVG } from "../../public/SVGs";
import { useDarkMode } from "../store/useStore";

export default function Folder({
  path,
  text,
  isEnd,
  isSmall = false,
  inActiveIcon = faFolder,
  activeIcon = faFolderOpen,
}) {
  const { isDarkMode } = useDarkMode();
  return (
    <NavLink end={isEnd} to={path} className="relative">
      {({ isActive }) => (
        <div
          className={clsx(
            "border not-first:50 rounded-lg flex items-center gap-3 group transition-colors",
            isActive
              ? isDarkMode
                ? "border-blue-400 bg-slate-800"
                : "border-blue-500"
              : isDarkMode
              ? "border-slate-800 hover:bg-slate-900"
              : "border-gray-200 hover:bg-gray-200",
            isSmall ? "p-2 px-3" : "py-3 px-4"
          )}
        >
          <div
            className={`text-xl "text-blue-500" ${
              isActive
                ? isDarkMode
                  ? "text-blue-400"
                  : "text-blue-500"
                : isDarkMode
                ? "text-slate-700"
                : "text-gray-500"
            } group-hover:text-blue-500`}
          >
            {isActive ? (
              <FontAwesomeIcon icon={activeIcon} />
            ) : (
              <FontAwesomeIcon icon={inActiveIcon} />
            )}
          </div>
          <p
            className={`font-medium ${
              isActive
                ? isDarkMode
                  ? "text-white"
                  : "text-gray-700"
                : isDarkMode
                ? "text-gray-200"
                : "text-gray-700"
            } `}
          >
            {text}
          </p>
        </div>
      )}
    </NavLink>
  );
}
