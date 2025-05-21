import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import DisplayFile from "./DisplayFile";
import { formatTime } from "../utils/getData";
import { isToday } from "../utils/isToday";

export function PostInTeachersProfile({ post, reactions }) {
  const [expanded, setExpanded] = useState(false);
  const [fileDisplayed, setFileDisplayed] = useState(null);

  const MAX_TEXT_LENGTH = 130; // Define max length before truncating

  const shouldTruncate = post.text && post.text.length > MAX_TEXT_LENGTH;
  const truncatedText = shouldTruncate
    ? post.text.substring(0, MAX_TEXT_LENGTH) + "..."
    : post.text;

  const postReactions = reactions.filter(
    (reaction) => reaction.post_id === post.id
  );

  return (
    <div
      className={`p-5 rounded-3xl shadow-lg bg-white w-full space-y-3 border ${
        isToday(post.created_at) ? "border-blue-300" : "border-gray-200"
      }`}
    >
      <h2 className="font-semibold text-gray-600">
        {post.stage || "منشور عام"}
      </h2>
      <p className="text-sm text-gray-500 -mt-3">
        {formatTime(post.created_at)}
      </p>
      {post.text && (
        <p className="whitespace-pre-line text-gray-800">
          {expanded ? post.text : truncatedText}
          {shouldTruncate && (
            <button
              className="text-blue-500 hover:text-blue-700 font-semibold ml-1"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "إخفاء" : "المزيد"}
            </button>
          )}
        </p>
      )}
      {post.images && (
        <div
          className={`grid gap-4 items-stretch ${
            post.images.length === 1
              ? "grid-cols-1"
              : post.images.length === 2
              ? "grid-cols-2"
              : post.images.length === 3
              ? "grid-cols-3"
              : "grid-cols-4 max-sm:grid-cols-2"
          }`}
        >
          {post.images.map((image, index) => {
            const imgHeight =
              post.images.length === 1 ||
              post.images.length === 2 ||
              post.images.length === 3
                ? "max-h-96"
                : post.images.length === 4
                ? "max-h-60"
                : "max-h-48";

            return (
              <img
                key={index}
                src={image}
                alt={`image-${index}`}
                onClick={() => setFileDisplayed(image)}
                className={`w-full ${imgHeight} rounded-2xl object-cover cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-200`}
              />
            );
          })}
        </div>
      )}
      {postReactions && postReactions?.length > 0 && (
        <div className="flex items-center gap-2 text-gray-600">
          <FontAwesomeIcon icon={faHeart} />
          <span>{postReactions?.length}</span>
        </div>
      )}
      {fileDisplayed && (
        <DisplayFile file={fileDisplayed} setFileDisplayed={setFileDisplayed} />
      )}
    </div>
  );
}
