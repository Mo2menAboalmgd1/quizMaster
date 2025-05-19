import React, { useState } from "react";
import {
  useReactionsByPostId,
  useTeachersFromTeachersStudents,
  useTeachersPosts,
  useUserDataByUserId,
} from "../../QueriesAndMutations/QueryHooks";
import { useCurrentUser } from "../../store/useStore";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import DisplayFile from "../../components/DisplayFile";
import { Link } from "react-router-dom";
import { useReactToPost } from "../../QueriesAndMutations/mutationsHooks";

export default function StudentPosts() {
  const { currentUser } = useCurrentUser();

  // get my teachers
  const {
    data: mySubscriptions,
    isLoading: imsMySubscriptionsLoading,
    error: mySubscriptionsError,
  } = useTeachersFromTeachersStudents(currentUser?.id);

  const teacherIds = Array.isArray(mySubscriptions)
    ? mySubscriptions.map((sub) => sub.teacherId)
    : [];

  const stages = Array.isArray(mySubscriptions)
    ? mySubscriptions.map((sub) => sub.stage)
    : [];

  const allowedPairs = new Set(
    mySubscriptions?.map((sub) => `${sub.teacherId}_${sub.stage}`)
  );

  const {
    data: teachersPosts,
    isLoading: isTeachersPostsLoading,
    error: teachersPostsError,
  } = useTeachersPosts(teacherIds, stages);

  // filter posts depending on myTeachers and stage
  const filteredPosts = teachersPosts?.filter((post) => {
    if (post.stage !== "") {
      return allowedPairs.has(`${post.teacherId}_${post.stage}`);
    }

    return mySubscriptions.some((sub) => sub.teacherId === post.teacherId);
  });

  // loader and errors
  if (imsMySubscriptionsLoading || isTeachersPostsLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (mySubscriptionsError || teachersPostsError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ أثناء جلب المنشورات، أعد المحاولة"} />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5" dir="rtl">
      {filteredPosts?.map((post) => {
        return <PostInStudentPosts key={post.id} post={post} />;
      })}
    </div>
  );
}

function PostInStudentPosts({ post }) {
  const { currentUser } = useCurrentUser();

  const [expanded, setExpanded] = useState(false);
  const [fileDisplayed, setFileDisplayed] = useState(null);

  const {
    data: postReactions,
    isLoading: isPostReactionsLoading,
    error: postReactionsError,
  } = useReactionsByPostId(post.id);

  const isLiked = postReactions?.some((reaction) => {
    return reaction.user_id === currentUser?.id;
  });

  // console.log(didILikedIt);

  const MAX_TEXT_LENGTH = 130; // Define max length before truncating

  const shouldTruncate = post.text && post.text.length > MAX_TEXT_LENGTH;
  const truncatedText = shouldTruncate
    ? post.text.substring(0, MAX_TEXT_LENGTH) + "..."
    : post.text;

  const {
    data: teacher,
    isLoading: isTeacerLoading,
    error: teacherError,
  } = useUserDataByUserId(post.teacherId, "teachers");

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

  function formatTime(createdAt) {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 1000 / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `من ${diffMins} دقيقة`;
    }

    if (diffHours < 24 && now.getDate() === created.getDate()) {
      return `من ${diffHours} ساعة`;
    }

    const wasYesterday =
      diffDays === 1 && now.getDate() - created.getDate() === 1;

    if (wasYesterday) {
      return `أمس الساعة ${created.toLocaleTimeString("ar-EG", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    }

    return created.toLocaleString("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function isToday(dateString) {
    const date = new Date(dateString);
    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  if (teacherError || postReactionsError) {
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
      {/* <h2 className="font-semibold text-gray-600">
        {post.stage || "منشور عام"}
      </h2> */}
      {/* teacher data */}
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
          <span dir="rtl">أعجبني</span>
        </label>
      </div>
      {fileDisplayed && (
        <DisplayFile file={fileDisplayed} setFileDisplayed={setFileDisplayed} />
      )}
    </div>
  );
}
