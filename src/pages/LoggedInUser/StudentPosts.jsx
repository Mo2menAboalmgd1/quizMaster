import React from "react";
import {
  useTeachersFromTeachersStudents,
  useTeachersPosts,
} from "../../QueriesAndMutations/QueryHooks";
import { publicStage, useCurrentUser } from "../../store/useStore";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { PostInStudentPosts } from "../../components/PostInStudentPosts";
import PageWrapper from "../../components/PageWrapper";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

export default function StudentPosts() {
  const { currentUser } = useCurrentUser();
  const { id: teacherId } = useParams();
  const [t] = useTranslation("global");

  // get my teachers
  const {
    data: mySubscriptions,
    isLoading: imsMySubscriptionsLoading,
    error: mySubscriptionsError,
  } = useTeachersFromTeachersStudents(currentUser?.id);

  const stagesIds = mySubscriptions?.map((sub) => sub.stage_id);
  const teachersIds = mySubscriptions?.map((sub) => sub.teacherId);

  const {
    data: posts,
    isLoading: isPostsLoading,
    isError: postsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTeachersPosts(teachersIds, [...(stagesIds || []), publicStage]);

  const teacherPosts = posts?.pages?.flatMap((page) => page.data) || [];
  console.log(teacherPosts);

  // loader and errors
  if (imsMySubscriptionsLoading || isPostsLoading) {
    return <Loader message={t("posts.student.studentPosts.loaders.mainLoader")} />;
  }

  if (mySubscriptionsError || postsError) {
    return <ErrorPlaceHolder message={t("posts.student.studentPosts.error")} />;
  }

  if (teacherPosts?.length === 0) {
    return (
      <PageWrapper title={t("posts.student.studentPosts.contentTitle")}>
        <NoDataPlaceHolder
          message={t("posts.student.studentPosts.noData")}
          icon={faNewspaper}
        />
      </PageWrapper>
    );
  }

  const reactionsByPostId = {};

  return (
    <PageWrapper title={t("posts.student.studentPosts.contentTitle")}>
      <h1
        className={clsx(
          "font-bold text-3xl mb-3 text-blue-500",
          !teacherId && "hidden"
        )}
      >
        {t("posts.student.studentPosts.contentTitle")}
      </h1>
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
              {isFetchingNextPage
                ? t("posts.student.studentPosts.loaders.fetchingButtonLoading")
                : t("posts.student.studentPosts.loaders.fetchingButton")}
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
