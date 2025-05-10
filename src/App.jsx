import React, { useEffect, useState } from "react";
import { useCurrentUser, useSession } from "./store/useStore";
import { supabase } from "./config/supabase";
import Auth from "./pages/auth/Auth";
import Student from "./pages/LoggedInUser/Student";
import Teacher from "./pages/LoggedInUser/Teacher";
import { Route, Routes, Link, useLocation, Navigate } from "react-router-dom";
import CreateTest from "./pages/LoggedInUser/CreateTest";
import TeacherProfile from "./pages/LoggedInUser/TeacherProfile";
import Exam from "./pages/LoggedInUser/Exam";
import ResumeCreateTest from "./pages/LoggedInUser/ResumeCreateTest";
import { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faSignOut } from "@fortawesome/free-solid-svg-icons";
import Loader from "./components/Loader";
import Requests from "./pages/LoggedInUser/Requests";
import {
  useNotificationsByUserId,
  useStudentsAndRequestsByTeacherIdAndTable,
} from "./QueriesAndMutations/QueryHooks";
import Notifications from "./pages/LoggedInUser/Notifications";
import Stages from "./pages/LoggedInUser/Stages";
import Stage from "./pages/LoggedInUser/Stage";
import UserProfile from "./pages/LoggedInUser/UserProfile";
import ErrorPlaceHolder from "./components/ErrorPlaceHolder";
import Landing from "./pages/auth/Landing"; // Import the new Landing component

export default function App() {
  const { getSession, session } = useSession();
  const { getCurrentUser, currentUser } = useCurrentUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const { data: notifications } = useNotificationsByUserId(currentUser?.id);

  const unReadNotifications = notifications?.filter(
    (notification) => !notification.isRead
  );

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        getSession(session);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [getSession]);

  useEffect(() => {
    async function getCurrentUserData() {
      if (!session?.user?.id) return;

      // 1. Get user type from profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("type")
        .eq("id", session.user.id)
        .single();

      if (profileError) throw new Error(profileError.message);

      let userTable = profile.type === "student" ? "students" : "teachers";

      // 2. Get user data from corresponding table
      const { data: userData, error: userError } = await supabase
        .from(userTable)
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (userError) throw new Error(userError.message);

      getCurrentUser(userData);
    }

    getCurrentUserData();
  }, [session?.user?.id, getCurrentUser]);

  const {
    data: requests,
    isLoading: isRequestsLoading,
    error: requestsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(
    currentUser?.id,
    "teachers_requests"
  );

  const {
    data: students,
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useStudentsAndRequestsByTeacherIdAndTable(
    currentUser?.id,
    "teachers_students"
  );

  if (session === undefined || currentUser === undefined) {
    return <Loader message="جاري التحقق من الجلسة..." />;
  }

  // If no session, show the Landing page with routes for auth
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: "#10B981",
                color: "white",
              },
            },
            error: {
              style: {
                background: "#EF4444",
                color: "white",
              },
            },
          }}
        />
      </div>
    );
  }

  if (!currentUser || isRequestsLoading || isStudentsLoading)
    return <Loader message="جري تحميل الامتحانات" />;

  if (requestsError || studentsError) {
    return (
      <ErrorPlaceHolder message={"حدث خطأ اثناء تحميل الصفحة، أعد المحاولة"} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none md:hidden"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              <Link to="/" className="ml-4 flex items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-2 rounded-lg">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                    Quiz Master
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-5" dir="rtl">
                  <Link
                    to={"/userProfile/" + currentUser.id}
                    className="text-gray-700 font-medium hidden md:block"
                  >
                    {currentUser.name}
                  </Link>
                  {currentUser.type === "teacher" && (
                    <span className="text-gray-700 font-medium hidden md:block">
                      {currentUser.subject}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative">
                <Link
                  to={"/notifications"}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md shadow-sm text-orange-600 border-2 border-orange-600 focus:outline-none transition-all duration-150 h-10 w-10 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faBell} />
                </Link>
                {unReadNotifications?.length > 0 && (
                  <span className="h-6 rounded-full px-2 bg-red-500 flex items-center justify-center text-white text-sm absolute -left-2.5 -top-1">
                    {unReadNotifications?.length || 0}
                  </span>
                )}
              </div>
              <button
                onClick={async () => await supabase.auth.signOut()}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none transition-all duration-150 h-10 w-10 cursor-pointer"
              >
                <FontAwesomeIcon icon={faSignOut} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-white shadow-lg z-20 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-auto md:h-auto md:shadow-none`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center md:hidden">
            <div className="font-semibold text-gray-800">القائمة</div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="py-4 flex flex-col md:flex-row md:justify-center md:items-center md:space-x-2 md:rtl:space-x-reverse md:px-4">
            <Link
              to="/"
              className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md flex items-center gap-1 transition-colors md:py-1"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                />
              </svg>

              <span dir="rtl">الرئيسية</span>
            </Link>

            {currentUser.type === "teacher" && (
              <>
                <Link
                  to="/createTest"
                  className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md flex items-center transition-colors md:py-1"
                >
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14m-7 7V5"
                    />
                  </svg>

                  <span dir="rtl">إضافة امتحان</span>
                </Link>
                <Link
                  to="/requests"
                  className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md flex items-center gap-2 transition-colors md:py-1 relative"
                >
                  {requests?.length > 0 && (
                    <span className="h-6 rounded-full px-2 bg-red-500 flex items-center justify-center text-white text-sm absolute left-0 -top-1">
                      {requests?.length || 0}
                    </span>
                  )}
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="square"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z"
                    />
                  </svg>

                  <span dir="rtl">طلبات الانضمام</span>
                </Link>
                <Link
                  to="/stages"
                  className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md flex items-center gap-2 transition-colors md:py-1 relative"
                >
                  {students?.length > 0 && (
                    <span className="h-6 rounded-full px-2 bg-red-500 flex items-center justify-center text-white text-sm absolute left-0 -top-1">
                      {students?.length || 0}
                    </span>
                  )}
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>

                  <span dir="rtl">المراحل الدراسية</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                currentUser.type === "student" ? <Student /> : <Teacher />
              }
            />
            <Route path="/requests" element={<Requests />} />
            <Route path="/stages" element={<Stages />} />
            <Route path="/stages/:stage" element={<Stage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/createTest" element={<CreateTest />} />
            <Route
              path="/resumeCreateTest/:id"
              element={<ResumeCreateTest />}
            />
            <Route path="/teacherProfile/:id" element={<TeacherProfile />} />
            <Route path="/userProfile/:id" element={<UserProfile />} />
            <Route path="/exam/:id" element={<Exam />} />
          </Routes>
        </div>
      </main>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#10B981",
              color: "white",
            },
          },
          error: {
            style: {
              background: "#EF4444",
              color: "white",
            },
          },
        }}
      />
    </div>
  );
}
