import React from "react";
import {
  useStudentPostsByTeacherIdAnStage,
  useTeachersFromTeachersStudents,
} from "../../QueriesAndMutations/QueryHooks";
import { useCurrentUser } from "../../store/useStore";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { PostInStudentPosts } from "../../components/PostInStudentPosts";
import PageWrapper from "../../components/PageWrapper";

export default function StudentPosts() {
  const { currentUser } = useCurrentUser();
  const { id: teacherId } = useParams();

  // get my teachers
  const {
    data: mySubscriptions,
    isLoading: imsMySubscriptionsLoading,
    error: mySubscriptionsError,
  } = useTeachersFromTeachersStudents(currentUser?.id);

  const stageId = mySubscriptions?.find(
    (sub) => sub.teacherId === teacherId
  )?.stage_id;

  const {
    data: posts,
    isLoading: isPostsLoading,
    isError: postsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useStudentPostsByTeacherIdAnStage(teacherId, stageId);

  const teacherPosts = posts?.pages?.flatMap((page) => page.data) || [];

  // loader and errors
  if (imsMySubscriptionsLoading || isPostsLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (mySubscriptionsError || postsError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ أثناء جلب المنشورات، أعد المحاولة"} />
    );
  }

  if (teacherPosts?.length === 0) {
    return (
      <NoDataPlaceHolder
        message={"لا يوجد منشورات حالياً"}
        icon={faNewspaper}
      />
    );
  }

  const reactionsByPostId = {};

  return (
    <div className="mt-3">
      <h1 className="font-bold text-3xl mb-3 text-blue-500">المنشورات</h1>
      <div>
        <div className="space-y-4">
          {teacherPosts?.map((post) => {
            return (
              <PostInStudentPosts
                key={post.id}
                post={post}
                reactions={reactionsByPostId[post.id] || []}
                isAllPosts={!teacherId}
              />
            );
          })}
        </div>
        {hasNextPage && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isFetchingNextPage ? "جاري التحميل..." : "تحميل المزيد"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
