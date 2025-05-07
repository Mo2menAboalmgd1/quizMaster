import React from "react";
import { useCurrentUser } from "../../store/useStore";
import { useNotificationsByUserId } from "../../QueriesAndMutations/QueryHooks";
import Loader from "../../components/Loader";
import Notification from "../../components/Notification";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDeleteNotification, useReadNotificationMutation } from "../../QueriesAndMutations/mutationsHooks";

export default function Notifications() {
  const { currentUser } = useCurrentUser();

  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    error: notificationsError,
  } = useNotificationsByUserId(currentUser?.id);

  console.log(notifications);

  const {mutateAsync: readNotification} = useReadNotificationMutation(currentUser.id);
  const handleReadNotification = async (notificationId) => {
    await readNotification(notificationId);
  };

  const {mutateAsync: deleteNotification} = useDeleteNotification(currentUser.id);
  const handleDeleteNotification = async (notificationId) => {
    await deleteNotification(notificationId);
  };

  if (isNotificationsLoading) return <Loader message="جاري تحميل الإشعارات" />;
  if (notificationsError) return <div>Error: {notificationsError.message}</div>;

  if (!notifications?.length) return <p className="text-center">لا يوجد إشعارات</p>;

  return (
    <div className="space-y-3">
      {notifications?.map((notification) => (
        <div
          dir="rtl"
          className={clsx(
            "p-3 border rounded-lg flex justify-between items-center",
            notification.isRead
              ? "border-gray-300 bg-white"
              : "border-blue-400 bg-blue-50"
          )}
        >
          <p>{notification.text}</p>
          <div className="flex gap-3">
            {!notification.isRead && (
              <button
                onClick={() => handleReadNotification(notification.id)}
                className="h-8 w-8 rounded bg-gradient-to-tl from-blue-400 to-blue-600 text-white cursor-pointer"
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
            )}
            <button
              onClick={() => handleDeleteNotification(notification.id)}
              className="h-8 w-8 rounded bg-gradient-to-tl from-gray-400 to-gray-600 text-white cursor-pointer"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
