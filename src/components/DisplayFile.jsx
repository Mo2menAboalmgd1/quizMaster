import React from "react";

export default function DisplayFile({ file, setFileDisplayed }) {
  return (
    <div
      className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center bg-black/40 z-50"
      onClick={() => setFileDisplayed(null)}
    >
      <button
        onClick={() => setFileDisplayed(null)}
        className="absolute left-3 top-3 h-10 px-3 rounded-full text-red-400 border border-red-400 text-xl flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white"
      >
        close
      </button>
      <div onClick={(e) => e.stopPropagation()}>
        <img
          className="max-h-screen max-w-screen object-cover"
          src={file}
          alt="file displayed"
        />
      </div>
    </div>
  );
}
