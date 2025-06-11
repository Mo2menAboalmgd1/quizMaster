import React from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Toaster } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const type = searchParams.get("type");

  const [isSignIn, setIsSignIn] = React.useState(mode !== "signup");

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-white p-4 font-[Noto_Sans_Arabic]"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg shadow-md p-5 text-center">
          <h1 className="text-2xl font-bold text-white">
            {isSignIn ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h1>
          <div className="w-24 h-1 bg-white mx-auto rounded-full mt-2 opacity-50"></div>
        </div>

        <div className="bg-white rounded-b-lg shadow-xl p-6">
          {isSignIn ? (
            <SignIn />
          ) : (
            <SignUp initialType={type === "teacher" ? "teacher" : "student"} />
          )}

          <div className="mt-3 text-center">
            <button
              className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setIsSignIn(!isSignIn)}
            >
              {isSignIn ? "إنشاء حساب جديد" : "لدي حساب بالفعل"}
            </button>
          </div>
        </div>
      </div>
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
