import React from "react";
import { useSignIn } from "../../QueriesAndMutations/mutationsHooks";
import toast from "react-hot-toast";

export default function SignIn() {
  const { mutateAsync } = useSignIn();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData(e.target);
    const userData = {
      email: formdata.get("email"),
      password: formdata.get("password"),
    };
    if (!userData.email || !userData.password) {
      toast.error("الرجاء ملئ جميع الحقول");
      return;
    }
    toast.loading("جاري تسجيل الدخول");
    await mutateAsync(userData);
    toast.dismiss();
    toast.success("مرحبا بك مجدداً");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white rounded-lg overflow-hidden"
    >
      <div className="p-1 space-y-6" dir="rtl">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-gray-700 font-medium">
              البريد الإلكتروني:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
              كلمة المرور:
            </label>
            <input
              type="text"
              id="password"
              name="password"
              placeholder="Strong_Password_123"
              className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            ></path>
          </svg>
          تسجيل الدخول
        </button>
      </div>
    </form>
  );
}
