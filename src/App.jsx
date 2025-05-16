import React, { useEffect, useState } from "react";
import { useCurrentUser, useSession } from "./store/useStore";
import { supabase } from "./config/supabase";
import Auth from "./pages/auth/Auth";
import Student from "./pages/LoggedInUser/Student";
import Teacher from "./pages/LoggedInUser/Teacher";
import {
  Route,
  Routes,
  Link,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import CreateTest from "./pages/LoggedInUser/CreateTest";
import TeacherProfile from "./pages/LoggedInUser/TeacherProfile";
import Exam from "./pages/LoggedInUser/Exam";
import ResumeCreateTest from "./pages/LoggedInUser/ResumeCreateTest";
import { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faPlus,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "./components/Loader";
import Requests from "./pages/LoggedInUser/Requests";
import { useNotificationsByUserId } from "./QueriesAndMutations/QueryHooks";
import Notifications from "./pages/LoggedInUser/Notifications";
import Stages from "./pages/LoggedInUser/Stages";
import Stage from "./pages/LoggedInUser/Stage";
import UserProfile from "./pages/LoggedInUser/UserProfile";
import ErrorPlaceHolder from "./components/ErrorPlaceHolder";
import Landing from "./pages/auth/Landing"; // Import the new Landing component
import JoinCodes from "./pages/LoggedInUser/JoinCodes";
import JoinCodesGroup from "./pages/LoggedInUser/JoinCodesGroup";
import {
  BookSVG,
  CloseSideBarSVG,
  FileSVG,
  HomeSVG,
  JoinCodesSVG,
  RequestsSVG,
  StagesSVG,
} from "../public/SVGs";
import Exams from "./pages/LoggedInUser/Exams";
import PublishedAndUnPublishedExams from "./pages/LoggedInUser/PublishedAndUnPublishedExams";
import StageExams from "./pages/LoggedInUser/StageExams";

export default function App() {
  const { getSession, session } = useSession();
  const { getCurrentUser, currentUser } = useCurrentUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: notifications } = useNotificationsByUserId(currentUser?.id);

  const unReadNotifications = notifications?.filter(
    (notification) => !notification.isRead
  );

  const navLinks = [
    {
      path: "/",
      icon: <HomeSVG />,
      text: "الرئيسية",
      user: "both",
    },
    {
      path: "/exams",
      icon: <FileSVG />,
      text: "الامتحانات",
      user: "teacher",
    },
    {
      path: "/createTest",
      icon: <FontAwesomeIcon icon={faPlus} />,
      text: "إنشاء امتحان",
      user: "teacher",
    },
    {
      path: "/requests",
      icon: <RequestsSVG />,
      text: "طلبات الانضمام",
      user: "teacher",
    },
    {
      path: "/stages",
      icon: <StagesSVG />,
      text: "المراحل الدراسية",
      user: "teacher",
    },
    {
      path: "/joinCodes",
      icon: <JoinCodesSVG />,
      text: "اكواد الانضمام",
      user: "teacher",
    },
  ];

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

  if (!currentUser) return <Loader message="جري تحميل الامتحانات" />;

  // if () {
  //   return (
  //     <ErrorPlaceHolder message={"حدث خطأ اثناء تحميل الصفحة، أعد المحاولة"} />
  //   );
  // }

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
                    <BookSVG />
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
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate("/");
                }}
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
              <CloseSideBarSVG />
            </button>
          </div>

          <div className="py-4 flex flex-col md:flex-row md:justify-center md:items-center md:space-x-2 md:rtl:space-x-reverse md:px-4">
            {navLinks.map((link, index) => {
              if (currentUser.type === link.user || link.user === "both") {
                return (
                  <Link
                    key={index}
                    to={link.path}
                    className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md flex items-center gap-1 transition-colors md:py-1"
                  >
                    {link.icon}
                    <span dir="rtl">{link.text}</span>
                  </Link>
                );
              }
            })}
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
            <Route path="/joinCodes" element={<JoinCodes />} />
            <Route path="/joinCodes/:group" element={<JoinCodesGroup />} />
            <Route path="/userProfile/:id" element={<UserProfile />} />
            <Route path="/exams" element={<Exams />}>
              <Route
                path=":PublishedOrNot"
                element={<PublishedAndUnPublishedExams />}
              >
                <Route path=":stage" element={<StageExams />} />
              </Route>
            </Route>
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
