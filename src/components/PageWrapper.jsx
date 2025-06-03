import clsx from "clsx";
import React from "react";
import { useDarkMode } from "../store/useStore";

export default function PageWrapper({ children, title, isBold = true }) {
  const { isDarkMode } = useDarkMode();
  return (
    <div className="grid grid-rows-[80px_1fr] max-md:grid-rows-1 max-sm:grid-rows-[80px_1fr] max-sm: h-full">
      <h1
        className={clsx(
          "text-blue-500 text-3xl border-b flex items-center px-10 max-md:hidden max-sm:flex",
          isBold ? "font-black" : "font-semibold",
          isDarkMode ? "bg-blue-500/15 border-blue-500/35" : "bg-blue-50 border-gray-300"
        )}
      >
        {title}
      </h1>
      <div className="p-5 overflow-auto">
        <div className="w-3xl max-lg:w-2xl max-md:w-lg mx-auto max-sm:w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
