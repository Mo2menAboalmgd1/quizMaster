import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DisplayFile from "./DisplayFile";
import { Link } from "react-router-dom";
import { useReactToPost } from "../QueriesAndMutations/mutationsHooks";
import {
  useReactionsByPostId,
  useUserDataByUserId,
} from "../QueriesAndMutations/QueryHooks";
import { useState } from "react";
import { useCurrentUser, useDarkMode } from "../store/useStore";
import { formatTime } from "../utils/getDate";
import { isToday } from "../utils/isToday";
import clsx from "clsx";
import Loader from "./Loader";

export function PostInStudentPosts({ post, isAllPosts }) {
  const { currentUser } = useCurrentUser();
  const { isDarkMode } = useDarkMode();

  const [expanded, setExpanded] = useState(false);
  const [fileDisplayed, setFileDisplayed] = useState(null);

  const MAX_TEXT_LENGTH = 130;

  const shouldTruncate = post.text && post.text.length > MAX_TEXT_LENGTH;
  const truncatedText = shouldTruncate
    ? post.text.substring(0, MAX_TEXT_LENGTH) + "..."
    : post.text;

  const { data: teacher, error: teacherError } = useUserDataByUserId(
    post.teacherId,
    "teachers"
  );

  const {
    data: reactions,
    isLoading: isReactionsLoading,
    error: reactionsError,
  } = useReactionsByPostId(post.id);

  console.log(reactions);

  const isLiked = reactions?.some((reaction) => {
    return reaction.user_id === currentUser?.id;
  });

  const { mutate: reactToPost } = useReactToPost();

  async function handleReact(post, type, teacherId) {
    reactToPost({
      postId: post.id,
      postText: post.text,
      type,
      userId: currentUser?.id,
      teacherId,
      userName: currentUser?.name,
    });
  }

  if (isReactionsLoading) {
    return;
  }

  if (teacherError || reactionsError) {
    return (
      <ErrorPlaceHolder
        message={"حدث خطأ أثناء جلب المراحل الدراسية، أعد المحاولة"}
      />
    );
  }

  return (
    <div
      className={clsx(
        "w-full border rounded-lg transition-colors duration-300 p-3",
        isToday(post.created_at)
          ? isDarkMode
            ? "border-blue-500/50 bg-slate-900 rounded-lg"
            : "border-blue-300 bg-blue-50 rounded-xl"
          : isDarkMode
          ? "border-slate-700"
          : "border-gray-300"
      )}
    >
      <div className="flex gap-3 items-center">
        {isAllPosts && (
          <img
            src={
              teacher?.avatar ||
              "https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg"
            }
            alt="teacher"
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          {isAllPosts && (
            <Link
              to={"/userProfile/" + teacher?.id}
              className={clsx(
                "font-semibold",
                isDarkMode ? "text-blue-400" : "text-gray-600"
              )}
            >
              {teacher?.name} ({teacher?.subject})
            </Link>
          )}
          <p
            className={clsx(
              "text-sm",
              isDarkMode ? "text-blue-300/80" : "text-gray-500"
            )}
          >
            {formatTime(post.created_at)}
          </p>
        </div>
      </div>

      {isAllPosts && (
        <hr
          className={clsx(
            "my-3 border-dashed",
            isDarkMode ? "border-slate-700" : "border-gray-300"
          )}
        />
      )}

      {post.text && (
        <p
          className={clsx(
            "whitespace-pre-line mt-2",
            isDarkMode ? "text-white" : "text-gray-800"
          )}
        >
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
          className={`grid gap-3 items-stretch mt-2 ${
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
                loading="lazy"
                src={image}
                alt={`image-${index}`}
                onClick={() => setFileDisplayed(image)}
                className={`w-full ${imgHeight} rounded-lg object-cover cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-200`}
              />
            );
          })}
        </div>
      )}

      {isAllPosts && (
        <hr
          className={clsx(
            "my-3 border-dashed",
            isDarkMode ? "border-slate-700" : "border-gray-300"
          )}
        />
      )}

      <div>
        <input
          onChange={(e) => {
            if (e.target.checked) {
              handleReact(post, "like", post.teacherId);
            } else {
              handleReact(post, "none", post.teacherId);
            }
          }}
          defaultChecked={isLiked}
          type="checkbox"
          id={`${post.id}-like`}
          className="hidden peer"
        />
        <label
          htmlFor={`${post.id}-like`}
          className="peer-checked:text-red-600
          px-4 text-gray-500 mt-2
          rounded-md flex items-center gap-1 transition-colors md:py-1 cursor-pointer select-none w-fit"
        >
          <FontAwesomeIcon icon={faHeart} />
          <span>{reactions?.length}</span>
        </label>
      </div>
      {fileDisplayed && (
        <DisplayFile file={fileDisplayed} setFileDisplayed={setFileDisplayed} />
      )}
    </div>
  );
}
