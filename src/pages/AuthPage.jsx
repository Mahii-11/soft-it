import { useState } from "react";
import { Eye, EyeOff, User, Lock, Mail, Phone } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen flex  justify-center pt-20 bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md min-h-[520px] bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-gray-200 p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isLogin ? "Welcome Back 👋" : "Create Account"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin
              ? "Login to continue shopping"
              : "Register to start your journey"}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm rounded-full font-medium transition ${
              isLogin
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm rounded-full font-medium transition ${
              !isLogin
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Register
          </button>
        </div>

        {/* FORM */}
        <form className="space-y-4">

          {!isLogin && (
            <InputField icon={<User size={18} />} placeholder="Full Name" />
          )}

          {!isLogin && (
            <InputField icon={<Phone size={18} />} placeholder="Phone Number" />
          )}

          <InputField icon={<Mail size={18} />} placeholder="Email Address" />

          {/* Password */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {!isLogin && (
            <InputField
              icon={<Lock size={18} />}
              placeholder="Confirm Password"
              type="password"
            />
          )}

          {isLogin && (
            <div className="text-right">
              <button className="text-blue-600 text-sm hover:underline">
                Forgot Password?
              </button>
            </div>
          )}

          {/* Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition shadow-md">
            {isLogin ? "Log In" : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-medium hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function InputField({ icon, placeholder, type = "text" }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-gray-400">{icon}</div>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}