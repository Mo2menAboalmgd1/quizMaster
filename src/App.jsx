import React, { useEffect, useState } from "react";
import { useCurrentUser, useSession } from "./store/useStore";
import { supabase } from "./config/supabase";
import Auth from "./pages/auth/Auth";
import Student from "./pages/LoggedInUser/Student";
import Teacher from "./pages/LoggedInUser/Teacher";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import CreateTest from "./pages/LoggedInUser/CreateTest";
import TeacherProfile from "./pages/LoggedInUser/TeacherProfile";
import Exam from "./pages/LoggedInUser/Exam";
import ResumeCreateTest from "./pages/LoggedInUser/ResumeCreateTest";
import { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSignOut } from "@fortawesome/free-solid-svg-icons";
import Loader from "./components/Loader";

export default function App() {
  const { getSession, session } = useSession();
  const { getCurrentUser, currentUser } = useCurrentUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

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

  console.log(currentUser);

  useEffect(() => {
    if (session && location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
    }
  }, [session]);

  if (!session)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Auth />
      </div>
    );

  if (!currentUser) return <Loader message="جري تحميل الامتحانات" />;

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
                {/* <div className="w-8 h-8 rounded-full font-bold bg-indigo-100 flex items-center justify-center text-indigo-600">
                  {currentUser.name
                    ? currentUser.name.charAt(0).toUpperCase()
                    : "U"}
                </div> */}
                <div className="flex gap-5" dir="rtl">
                  <span className="text-gray-700 font-medium hidden md:block">
                    {currentUser.name}
                  </span>
                  {currentUser.type === "student" ? (
                    <span className="text-gray-700 font-medium hidden md:block">
                      الصف {currentUser.grade}
                    </span>
                  ) : (
                    <span className="text-gray-700 font-medium hidden md:block">
                      المرحلة{" "}
                      {currentUser.grade === "prep" ? "الإعدادية" : "الثانوية"}
                    </span>
                  )}
                </div>
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

          <div className="py-4 flex flex-col md:flex-row md:items-center md:space-x-4 md:rtl:space-x-reverse md:px-4">
            <Link
              to="/"
              className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md flex items-center transition-colors md:py-1"
            >
              <svg
                className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span dir="rtl">الرئيسية</span>
            </Link>

            {currentUser.type === "teacher" && (
              <Link
                to="/createTest"
                className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md flex items-center transition-colors md:py-1"
              >
                <svg
                  className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span dir="rtl">إضافة امتحان</span>
              </Link>
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
            <Route path="/createTest" element={<CreateTest />} />
            <Route
              path="/resumeCreateTest/:id"
              element={<ResumeCreateTest />}
            />
            <Route path="/teacherProfile/:id" element={<TeacherProfile />} />
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
