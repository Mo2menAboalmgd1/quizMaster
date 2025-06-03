import React from "react";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../../store/useStore";
import {
  usePostsByTeacherId,
  useReactionsByTeacherId,
  useStagesByTeacherId,
} from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import ErrorPlaceHolder from "../../components/ErrorPlaceHolder";
import { PostInTeachersProfile } from "../../components/PostInTeachersProfile";
import NoDataPlaceHolder from "../../components/NoDataPlaceHolder";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

export default function PostsInTeacherPosts() {
  const { stageId } = useParams();
  const { currentUser } = useCurrentUser();
  const newStage = stageId === "all" ? null : stageId;

  const {
    data: posts,
    isLoading: isPostsLoading,
    error: postsError,
  } = usePostsByTeacherId(currentUser?.id);

  const {
    data: stages,
    isLoading: isStagesLoading,
    error: stagesError,
  } = useStagesByTeacherId(currentUser?.id);

  const {
    data: postReactions,
    isLoading: isPostReactionsLoading,
    error: postReactionsError,
  } = useReactionsByTeacherId(currentUser?.id);

  postReactions;

  if (isPostsLoading || isPostReactionsLoading || isStagesLoading) {
    return <Loader message="جاري التحميل" />;
  }

  if (postsError || postReactionsError || stagesError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ أثناء جلب المنشورات أعد المحاولة"} />
    );
  }

  const stagePosts = posts.filter((post) => {
    return post.stage_id === newStage;
  });

  if (stagePosts.length === 0) {
    return (
      <NoDataPlaceHolder message={"لا يوجد منشورات لهذه المجموعة، انشأ واحداً"} icon={faNewspaper}/>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-5 max-w-2xl mt-8 mx-auto">
      {stagePosts.map((post, index) => {
        const stage = stages.find((stage) => stage.id === post.stage_id);
        return (
          <PostInTeachersProfile
            key={index}
            post={post}
            reactions={postReactions}
            stage={stage}
          />
        );
      })}
    </div>
  );
}
