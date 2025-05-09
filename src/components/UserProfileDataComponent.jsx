import { faBars, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function UserProfileDataComponent({ user, userType }) {
  const [isMore, setIsMore] = React.useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-4">
        <img
          src={
            user.avatar ||
            "https://cdn-icons-png.freepik.com/512/8801/8801434.png"
          }
          alt="User Avatar"
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
        />

        <div>
          <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-sm text-blue-600 mb-2">{userType.type}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap items-center text-sm">
          <span className="text-gray-500 w-24">User name:</span>
          <span className="font-medium text-gray-800">{user.userName}</span>
        </div>

        <div className="flex flex-wrap items-center text-sm">
          <span className="text-gray-500 w-24">Email:</span>
          <span className="font-medium text-gray-800">{user.email}</span>
        </div>

        <div className="flex flex-wrap items-center text-sm">
          <span className="text-gray-500 w-24">Type:</span>
          <span className="font-medium text-gray-800">{userType.type}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => setIsMore(!isMore)}
          className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded space-x-2 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={faBars} />
          <span>more</span>
        </button>
      </div>
      {isMore && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
          <button className="px-3 py-1.5 space-x-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors cursor-pointer">
            <FontAwesomeIcon icon={faEdit} />
            <span>Edit</span>
          </button>
          <button className="px-3 py-1.5 bg-red-600 text-white text-sm rounded space-x-2 hover:bg-red-700 transition-colors cursor-pointer">
            <FontAwesomeIcon icon={faTrash} />
            <span>delete account</span>
          </button>
        </div>
      )}
    </div>
  );
}
