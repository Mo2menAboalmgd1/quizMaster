import React from "react";
import { useCurrentUser } from "../store/useStore";
import { useUserDataByUserId } from "../QueriesAndMutations/QueryHooks";

export default function Notification({ id, userId, text, isRead }) {
  const { currentUser } = useCurrentUser();

  console.log(currentUser);

  return <div dir="rtl">
    <p></p>
  </div>;
}
