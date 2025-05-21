import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DisplayFile from "./DisplayFile";
import { Link } from "react-router-dom";
import { useReactToPost } from "../QueriesAndMutations/mutationsHooks";
import { useUserDataByUserId } from "../QueriesAndMutations/QueryHooks";
import { useState } from "react";
import { useCurrentUser } from "../store/useStore";
import { formatTime } from "../utils/getData";
import { isToday } from "../utils/isToday";

export function PostInStudentPosts({ post, reactions }) {
  const { currentUser } = useCurrentUser();

  const [expanded, setExpanded] = useState(false);
  const [fileDisplayed, setFileDisplayed] = useState(null);

  console.log(post.text, reactions);

  const isLiked = reactions?.some((reaction) => {
    return reaction.user_id === currentUser?.id;
  });

  const MAX_TEXT_LENGTH = 130;

  const shouldTruncate = post.text && post.text.length > MAX_TEXT_LENGTH;
  const truncatedText = shouldTruncate
    ? post.text.substring(0, MAX_TEXT_LENGTH) + "..."
    : post.text;

  const { data: teacher, error: teacherError } = useUserDataByUserId(
    post.teacherId,
    "teachers"
  );

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

  if (teacherError) {
    return (
      <ErrorPlaceHolder
        message={"حدث خطأ أثناء جلب المراحل الدراسية، أعد المحاولة"}
      />
    );
  }

  return (
    <div
      className={`p-5 rounded-3xl shadow-lg w-full space-y-3 border transition-colors duration-300 ${
        isToday(post.created_at) ? "border-blue-300" : "border-gray-200"
      }`}
    >
      <div className="flex gap-3 items-center">
        <img
          src={
            teacher?.image ||
            "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png"
          }
          alt="teacher"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <Link
            to={"/userProfile/" + teacher?.id}
            className="font-semibold text-gray-600"
          >
            {teacher?.name} ({teacher?.subject})
          </Link>
          <p className="text-sm text-gray-500">{formatTime(post.created_at)}</p>
        </div>
      </div>
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
                loading="lazy"
                src={image}
                alt={`image-${index}`}
                onClick={() => setFileDisplayed(image)}
                className={`w-full ${imgHeight} rounded-2xl object-cover cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-200`}
              />
            );
          })}
        </div>
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
          className="peer-checked:text-red-600 peer-checked:bg-red-100
          px-4 py-2 text-gray-700
          rounded-md flex items-center gap-1 transition-colors md:py-1 cursor-pointer select-none w-fit"
        >
          <FontAwesomeIcon icon={faHeart} />
          <span dir="rtl">أعجبني ({reactions?.length})</span>
        </label>
      </div>
      {fileDisplayed && (
        <DisplayFile file={fileDisplayed} setFileDisplayed={setFileDisplayed} />
      )}
    </div>
  );
}
