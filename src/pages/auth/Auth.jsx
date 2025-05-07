import React from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { Toaster } from "react-hot-toast";

export default function Auth() {
  const [isSignIn, setIsSignIn] = React.useState(true);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-green-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-r from-green-500 to-green-400 rounded-t-lg shadow-md p-5 text-center">
          <h1 className="text-2xl font-bold text-white">
            {isSignIn ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h1>
          <div className="w-24 h-1 bg-white mx-auto rounded-full mt-2 opacity-50"></div>
        </div>

        <div className="bg-white rounded-b-lg shadow-xl p-6">
          {isSignIn ? <SignIn /> : <SignUp />}

          <div className="mt-3 text-center">
            <button
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
              onClick={() => setIsSignIn(!isSignIn)}
            >
              {isSignIn ? "إنشاء حساب جديد" : "عندي حساب بالفعل"}
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
