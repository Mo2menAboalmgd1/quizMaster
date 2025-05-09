export default function Loader({ message = "جاري التحميل..." }) {
  return (
    <div className="w-full py-20 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          {message}
        </p>
      </div>
    </div>
  );
}
