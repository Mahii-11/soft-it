import { useState } from "react";
import { Eye, EyeOff, User, Lock, Mail, Phone } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Toggle */}
        <div className="flex bg-gray-200 rounded-full p-1 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-full font-medium transition ${
              isLogin ? "bg-white text-blue-600 shadow" : "text-gray-600"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-full font-medium transition ${
              !isLogin ? "bg-white text-blue-600 shadow" : "text-gray-600"
            }`}
          >
            Register
          </button>
        </div>

        {/* FORM */}
        <form className="space-y-4">

          {/* NAME */}
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* PHONE */}
          {!isLogin && (
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18}/>
            <input
              type="text"
              placeholder="Enter your email"
              className="w-full border rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18}/>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full border rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* FORGOT PASSWORD */}
          {isLogin && (
            <div className="text-right">
              <button className="text-blue-600 text-sm hover:underline">
                Forgot Password?
              </button>
            </div>
          )}

          {/* BUTTON */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            {isLogin ? "Log In" : "Register"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-sm mt-6">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-medium"
              >
                Register Here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-medium"
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