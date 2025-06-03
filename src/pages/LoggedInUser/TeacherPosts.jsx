import React, { useState } from "react";
import { publicStage, useCurrentUser } from "../../store/useStore";
import {
  usePostsByTeacherId,
  useStagesByTeacherId,
} from "../../QueriesAndMutations/QueryHooks";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import Loader from "../../components/Loader";
import Folder from "../../components/Folder";
import { Outlet } from "react-router-dom";
import CreatePostForm from "../../components/CreatePostForm";
import DisplayFile from "../../components/DisplayFile";
import PageWrapper from "../../components/PageWrapper";
import { PostInTeachersProfile } from "../../components/PostInTeachersProfile";

export default function TeacherPosts() {
  const { currentUser } = useCurrentUser();

  const [fileDisplayed, setFileDisplayed] = useState(null);
  const [selectedStage, setSelectedStage] = useState(publicStage);

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(currentUser?.id);

  const {
    data: allPosts,
    isLoading: isPostsLoading,
    isError: postsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostsByTeacherId(currentUser?.id);

  const posts = allPosts?.pages?.flatMap((page) => page.data) || [];

  console.log(allPosts);
  console.log(posts);

  if (isStagesLoading || isPostsLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (stagesError || postsError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ أثناء جلب المنشورات، أعد المحاولة"} />
    );
  }

  // const publicPosts = posts?.filter((post) => !post.stage_id);

  return (
    <PageWrapper title={"المنشورات"}>
      <h2 className="text-blue-500 font-bold text-2xl w-full mb-4">
        إنشاء منشور جديد
      </h2>
      <div className="space-y-5 ">
        <CreatePostForm
          stages={stages}
          setFileDisplayed={setFileDisplayed}
          selectedStage={selectedStage}
          setSelectedStage={setSelectedStage}
        />
        <div className="flex gap-5 flex-wrap justify-center">
          <h2 className="text-blue-500 font-bold text-2xl w-full">المنشورات</h2>
          {posts?.map((post, index) => {
            const stage = stages?.find((stage) => stage.id === post.stage_id);
            return (
              <PostInTeachersProfile
                key={index}
                post={post}
                // reactions={postReactions}
                stage={stage}
              />
            );
          })}
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
        {fileDisplayed && (
          <DisplayFile
            file={fileDisplayed}
            setFileDisplayed={setFileDisplayed}
          />
        )}
        <Outlet />
      </div>
    </PageWrapper>
  );
}

/*
import React, { useState } from "react";
import { useCurrentUser } from "../../store/useStore";
import {
  usePostsByTeacherId,
  useStagesByTeacherId,
} from "../../QueriesAndMutations/QueryHooks";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import Loader from "../../components/Loader";
import Folder from "../../components/Folder";
import { Outlet } from "react-router-dom";
import CreatePostForm from "../../components/CreatePostForm";
import DisplayFile from "../../components/DisplayFile";
import PageWrapper from "../../components/PageWrapper";

export default function TeacherPosts() {
  const { currentUser } = useCurrentUser();

  const [fileDisplayed, setFileDisplayed] = useState(null);
  const [selectedStage, setSelectedStage] = useState("");

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(currentUser?.id);

  const {
    data: posts,
    isLoading: isPostsLoading,
    error: postsError,
  } = usePostsByTeacherId(currentUser?.id);

  if (isStagesLoading || isPostsLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (stagesError || postsError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ أثناء جلب المنشورات، أعد المحاولة"} />
    );
  }

  const publicPosts = posts?.filter((post) => !post.stage_id);

  return (
    <PageWrapper title={"المنشورات"}>
      <div className="space-y-5 ">
        <CreatePostForm
          stages={stages}
          setFileDisplayed={setFileDisplayed}
          selectedStage={selectedStage}
          setSelectedStage={setSelectedStage}
        />
        <div className="flex gap-5 flex-wrap justify-center">
          <div className="relative" onClick={() => setSelectedStage("")}>
            <Folder path={"all"} text={`منشورات عامة`} />
            {publicPosts.length > 0 && (
              <span className="h-6 rounded-full px-2 bg-blue-500 flex items-center justify-center text-white text-sm absolute -left-3 -top-2">
                {publicPosts?.length || 0}
              </span>
            )}
          </div>
          {stages?.map((stage, index) => {
            const stagePosts = posts?.filter(
              (post) => post.stage_id === stage.id
            );
            return (
              <div
                className="relative"
                key={index}
                onClick={() => setSelectedStage(stage.id)}
              >
                <Folder
                  key={index}
                  path={stage.id}
                  text={`منشورات ${stage.name}`}
                />
                {stagePosts.length > 0 && (
                  <span className="h-6 rounded-full px-2 bg-blue-500 flex items-center justify-center text-white text-sm absolute -left-3 -top-2">
                    {stagePosts?.length || 0}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {fileDisplayed && (
          <DisplayFile
            file={fileDisplayed}
            setFileDisplayed={setFileDisplayed}
          />
        )}
        <Outlet />
      </div>
    </PageWrapper>
  );
}

*/
