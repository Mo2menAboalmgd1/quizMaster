import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React from "react";
import { useDarkMode } from "../store/useStore";

export default function NoDataPlaceHolder({ message, icon }) {
  const { isDarkMode } = useDarkMode();
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center h-64 text-center rounded-lg border border-dashed p-6",
        isDarkMode
          ? "bg-blue-500/5 border-slate-800 text-blue-500"
          : "bg-white border-gray-300 text-gray-400"
      )}
    >
      <FontAwesomeIcon icon={icon} className="text-5xl mb-4" />
      <p className={clsx("font-medium", isDarkMode ? "text-blue-400" : "text-gray-600")}>
        {message}
      </p>
    </div>
  );
}
