import React from "react";
import { useSignIn } from "../../QueriesAndMutations/mutationsHooks";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

export default function SignIn() {
  const { mutateAsync } = useSignIn();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData(e.target);
    const userData = {
      email: formdata.get("email"),
      password: formdata.get("password"),
    };
    if (!userData.email || !userData.password) {
      toast.error("الرجاء ملء جميع الحقول");
      return;
    }
    setIsLoading(true);
    await mutateAsync(userData, {
      onSuccess: () => {
        setIsLoading(false);
        e.target.reset();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white overflow-hidden relative">
      {/* <div className="h-full w-full bg-white/20 absolute inset-0">
        <Loader message="جاري تسجيل الدخول" />
      </div> */}
      <div className=" space-y-6">
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
              className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none"
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
              type="password"
              id="password"
              name="password"
              placeholder="Strong_Password_123"
              className="w-full h-11 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
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
