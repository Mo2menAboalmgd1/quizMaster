import clsx from "clsx";
import { useDarkMode } from "../store/useStore";

export default function Loader({ message = "جاري التحميل..." }) {
  const { isDarkMode } = useDarkMode();
  return (
    <div className="w-full py-20 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div
          className={clsx(
            "w-16 h-16 border-4 border-t-transparent rounded-full animate-spin",
            isDarkMode ? "border-blue-400" : "border-blue-500"
          )}
        ></div>
        <p
          className={clsx(
            "mt-4 text-lg font-medium",
            isDarkMode ? "tex-white" : "text-gray-700"
          )}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
