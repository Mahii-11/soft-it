import { useState } from "react";
import { Eye, EyeOff, User, Lock, Mail, Phone } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { loginApi, registerApi, forgotPasswordApi, resetPasswordApi } from "../services/api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot password: 0 = off, 1 = email dao, 2 = OTP + new password
  const [forgotStep, setForgotStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [info, setInfo] = useState("");

  const navigate = useNavigate();

  const openForgot = () => {
    setError("");
    setInfo("");
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setForgotStep(1);
  };

  const closeForgot = () => {
    setError("");
    setInfo("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setForgotStep(0);
    setIsLogin(true);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const res = await forgotPasswordApi(email);
    setLoading(false);
    if (res?.status) {
      setInfo(res.message || "A reset code has been sent to your email.");
      setForgotStep(2);
    } else {
      setError(res?.message || "Could not send reset code.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!otp.trim()) {
      setError("Please enter the code sent to your email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const res = await resetPasswordApi({
      email,
      otp,
      password,
      password_confirmation: confirmPassword,
    });
    setLoading(false);
    if (res?.status) {
      // success: login form e fire jao, email thakbe
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setForgotStep(0);
      setIsLogin(true);
      setInfo(res.message || "Password reset successfully. Please login.");
    } else {
      const firstFieldError = res?.errors && Object.values(res.errors)[0]?.[0];
      setError(firstFieldError || res?.message || "Password reset failed.");
    }
  };

  const EMAIL_RE = /^\S+@\S+\.\S+$/;

  // login/register duto-r success flow ek-i
  const finishAuth = (res, failMsg) => {
    if (res?.status) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard", { replace: true });
      return;
    }
    const firstFieldError = res?.errors && Object.values(res.errors)[0]?.[0];
    setError(firstFieldError || res?.message || failMsg);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi(email, password);
      finishAuth(res, "Invalid email or password.");
    } catch (err) {
      setError("Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!name.trim() || !phone.trim() || !email.trim() || !password) {
      setError("All fields are required.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    // BD mobile: 01XXXXXXXXX (+880 / 880 prefix o cholbe)
    if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(phone.trim())) {
      setError("Please enter a valid Bangladeshi phone number (01XXXXXXXXX).");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerApi({
        name,
        email,
        phone,
        password,
        password_confirmation: confirmPassword,
      });
      finishAuth(res, "Registration failed");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // already logged in hole login page dekhanor dorkar nai
  if (localStorage.getItem("token")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex  justify-center pt-20 bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4">
      <div className="w-full max-w-md min-h-[520px] ">

        {forgotStep > 0 ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                {forgotStep === 1 ? "Forgot Password" : "Reset Password"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {forgotStep === 1
                  ? "Enter your email and we'll send you a reset code"
                  : `Enter the code sent to ${email} and your new password`}
              </p>
            </div>

            <form
              noValidate
              className="space-y-4"
              onSubmit={forgotStep === 1 ? handleSendOtp : handleResetPassword}
            >
              <InputField
                icon={<Mail size={18} />}
                placeholder="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {forgotStep === 2 && (
                <>
                  <InputField
                    icon={<Lock size={18} />}
                    placeholder="Reset Code (OTP)"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <PasswordField placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <PasswordField placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </>
              )}

              {info && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
                  {info}
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold transition shadow-md text-white ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#ea5b3a] hover:bg-[#d44a2a]"
                }`}
              >
                {loading ? "Loading..." : forgotStep === 1 ? "Send Reset Code" : "Reset Password"}
              </button>

              <div className="flex justify-between text-sm">
                {forgotStep === 2 ? (
                  <button
                    type="button"
                    onClick={() => { setError(""); setInfo(""); setForgotStep(1); }}
                    className="text-[#ea5b3a] hover:underline"
                  >
                    Resend code
                  </button>
                ) : <span />}
                <button
                  type="button"
                  onClick={closeForgot}
                  className="text-gray-500 hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </>
        ) : (
        <>
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
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
                ? "bg-[#ea5b3a] text-white shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm rounded-full font-medium transition ${
              !isLogin
                ? "bg-[#ea5b3a] text-white shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Register
          </button>
        </div>

        {/* FORM */}
        <form noValidate className="space-y-4" onSubmit={isLogin ? handleLogin : handleRegister}>

          {!isLogin && (
            <InputField icon={<User size={18} />} placeholder="Full Name" value={name}   onChange={(e) => setName(e.target.value)} />
          )}

          {!isLogin && (
            <InputField icon={<Phone size={18} />} placeholder="Phone Number" value={phone}
              onChange={(e) => setPhone(e.target.value)} />
          )}

          <InputField icon={<Mail size={18} />} placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <PasswordField placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {!isLogin && (
            <PasswordField placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          )}

          {isLogin && (
            <div className="text-right">
              <button type="button" onClick={openForgot} className="text-[#ea5b3a] text-sm hover:underline">
                Forgot Password?
              </button>
            </div>
          )}

          {info && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
              {info}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
            </div>
              )}

          {/* Button */}
           <button
             type="submit"
             disabled={loading}
             className={`w-full py-3 rounded-xl font-semibold transition shadow-md text-white ${
             loading
             ? "bg-gray-400 cursor-not-allowed"
             : "bg-[#ea5b3a] hover:bg-[#d44a2a]"
         }`}
         >
            {loading
            ? "Loading..."
            : isLogin
            ? "Log In"
            : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-[#ea5b3a] font-medium hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-[#ea5b3a] font-medium hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
        </>
        )}
      </div>
    </div>
  );
}

function InputField({ icon, placeholder, type = "text",  value, onChange  }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-gray-400">{icon}</div>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ea5b3a] transition"
      />
    </div>
  );
}
function PasswordField({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#ea5b3a] transition"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
