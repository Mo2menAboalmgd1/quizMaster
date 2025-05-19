import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../../store/useStore";
import {
  usePostsByTeacherId,
  useReactionsByPostId,
} from "../../QueriesAndMutations/QueryHooks";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { PostsSVG } from "../../../public/SVGs";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import DisplayFile from "../../components/DisplayFile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function PostsInTeacherPosts() {
  const { stage } = useParams();
  const { currentUser } = useCurrentUser();
  const newStage = stage === "جميع الصفوف" ? "" : stage;

  const {
    data: posts,
    isLoading: isPostsLoading,
    error: postsError,
  } = usePostsByTeacherId(currentUser?.id);

  if (isPostsLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (postsError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ أثناء جلب المنشورات أعد المحاولة"} />
    );
  }

  const stagePosts = posts.filter((post) => {
    return post.stage === newStage;
  });

  return (
    <div className="w-full flex flex-col items-center gap-5 max-w-2xl mt-8 mx-auto">
      {[...stagePosts]?.reverse().map((post, index) => (
        <PostInTeachersProfile key={index} post={post} />
      ))}
    </div>
  );
}

function PostInTeachersProfile({ post }) {
  const [expanded, setExpanded] = useState(false);
  const [fileDisplayed, setFileDisplayed] = useState(null);

  const MAX_TEXT_LENGTH = 130; // Define max length before truncating

  const shouldTruncate = post.text && post.text.length > MAX_TEXT_LENGTH;
  const truncatedText = shouldTruncate
    ? post.text.substring(0, MAX_TEXT_LENGTH) + "..."
    : post.text;

  const {
    data: postReactions,
    isLoading: isPostReactionsLoading,
    error: postReactionsError,
  } = useReactionsByPostId(post.id);

  if (isPostReactionsLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (postReactionsError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ أثناء جلب المنشورات أعد المحاولة"} />
    );
  }

  return (
    <div className="p-5 rounded-3xl shadow-lg bg-white w-full space-y-3 border border-gray-200">
      <h2 className="font-semibold text-gray-600">
        {post.stage || "منشور عام"}
      </h2>
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
