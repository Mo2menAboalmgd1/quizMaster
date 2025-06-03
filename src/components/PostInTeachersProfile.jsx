import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import DisplayFile from "./DisplayFile";
import { formatTime } from "../utils/getDate";
import { isToday } from "../utils/isToday";
import clsx from "clsx";
import { publicStage, useDarkMode } from "../store/useStore";
import { useReactionsByPostId } from "../QueriesAndMutations/QueryHooks";

export function PostInTeachersProfile({ post /* reactions*/, stage }) {
  const [expanded, setExpanded] = useState(false);
  const [fileDisplayed, setFileDisplayed] = useState(null);
  const { isDarkMode } = useDarkMode();
  const stageName = stage?.id !== publicStage ? stage.name : "منشور عام";

  const MAX_TEXT_LENGTH = 130; // Define max length before truncating

  const shouldTruncate = post.text && post.text.length > MAX_TEXT_LENGTH;
  const truncatedText = shouldTruncate
    ? post.text.substring(0, MAX_TEXT_LENGTH) + "..."
    : post.text;

  const { data: reactions } = useReactionsByPostId(post.id);

  console.log(reactions);

  // const postReactions = reactions.filter(
  //   (reaction) => reaction.post_id === post.id
  // );

  return (
    <div
      className={clsx(
        "p-4 rounded-lg w-full border",
        isDarkMode ? "bg-slate-900" : "bg-white",
        isToday(post.created_at)
          ? isDarkMode
            ? "border-blue-500/60"
            : "border-blue-300"
          : isDarkMode
          ? "border-slate-800"
          : "border-gray-300"
      )}
    >
      <h2
        className={clsx(
          "font-semibold",
          isDarkMode ? "text-blue-400" : "text-gray-500"
        )}
      >
        {stageName}
      </h2>
      <p
        className={clsx(
          "text-sm mb-2.5",
          isDarkMode ? "text-white/60" : "text-gray-500"
        )}
      >
        {formatTime(post.created_at)}
      </p>
      {post.text && (
        <p
          className={clsx(
            "whitespace-pre-line",
            isDarkMode ? "text-white" : "text-gray-800"
          )}
        >
          {expanded ? post.text : truncatedText}
          {shouldTruncate && (
            <button
              className={clsx(
                " font-semibold ml-1 cursor-pointer",
                isDarkMode
                  ? "text-blue-400 hover:text-blue-500"
                  : "text-blue-500 hover:text-blue-700"
              )}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "إخفاء" : "المزيد"}
            </button>
          )}
        </p>
      )}
      {post.images.length > 0 && (
        <div
          className={`grid gap-4 items-stretch mt-4 ${
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
                className={`w-full ${imgHeight} rounded-md object-cover cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-200`}
              />
            );
          })}
        </div>
      )}
      <div className="flex items-center gap-2 text-gray-600 mt-1">
        <FontAwesomeIcon icon={faHeart} />
        <span>{reactions?.length}</span>
      </div>
      {fileDisplayed && (
        <DisplayFile file={fileDisplayed} setFileDisplayed={setFileDisplayed} />
      )}
    </div>
  );
}
