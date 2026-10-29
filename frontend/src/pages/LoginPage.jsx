import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2, RefreshCw, ArrowLeft } from 'lucide-react';
import { loginUser, registerUser, getCurrentUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Mode: 'login' | 'register'
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        // Register new account
        await registerUser(email, password, fullName);
        setSuccessMessage('Account created successfully! Logging you in...');
      }

      // Authenticate via http://127.0.0.1:9000/api/v1/auth/login
      const loginRes = await loginUser(email, password);
      const token = loginRes.access_token;
      localStorage.setItem('wardrobe_token', token);

      // Fetch user profile
      const user = await getCurrentUser(token);
      login(token, user);
      setSuccessMessage(`Welcome back, ${user.full_name || user.email}!`);

      // Determine redirect path
      setTimeout(() => {
        const from = location.state?.from?.pathname;
        if (user.is_admin) {
          navigate('/admin');
        } else if (from) {
          navigate(from);
        } else {
          navigate('/');
        }
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center p-3 sm:p-6">
      {/* Main Card replicating the 1040x680 design specification */}
      <div className="w-full max-w-[1040px] min-h-[680px] bg-white rounded-2xl overflow-hidden shadow-xl border border-[#E7E5E0] grid grid-cols-1 lg:grid-cols-[440px_1fr]">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: BRAND & STREETWEAR SHOWCASE (#FFD400)       */}
        {/* ========================================================= */}
        <div className="bg-[#FFD400] p-8 sm:p-10 flex flex-col justify-between box-border">
          {/* Header Brand */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-[#111] rounded-[6px] flex items-center justify-center font-medium text-[15px] text-[#FFD400] group-hover:scale-105 transition-transform">
                W
              </div>
              <span className="tracking-[0.18em] font-medium text-sm text-[#111]">
                WARDROBE
              </span>
            </Link>

            <Link
              to="/"
              className="text-xs text-[#111] font-medium flex items-center gap-1 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
            </Link>
          </div>

          {/* Center Graphic & Slogan */}
          <div className="flex flex-col gap-6 my-8">
            {/* 6 Category Tiles Matching Design Mockup */}
            <div className="grid grid-cols-3 gap-3">
              {/* Tile 1: T-shirts */}
              <div className="h-[108px] rounded-2xl bg-white flex flex-col items-center justify-center gap-2 text-xs text-[#111] shadow-xs select-none">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 4 3 8l3 3 2-1.5V20h8V9.5l2 1.5 3-3-5-4c-.5 1.5-1.8 2.5-3 2.5S8.5 5.5 8 4z" />
                </svg>
                <span>T-shirts</span>
              </div>

              {/* Tile 2: Hoodies */}
              <div className="h-[108px] rounded-2xl bg-[#111] flex flex-col items-center justify-center gap-2 text-xs text-[#FFD400] shadow-xs select-none">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFD400" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 3 5.5 4.5 2 11l3 1.5 1-2V21h12V10.5l1 2 3-1.5-3.5-6.5L15 3c0 2-1.3 3.5-3 3.5S9 5 9 3z" />
                  <path d="M8.5 15.5h7" />
                </svg>
                <span>Hoodies</span>
              </div>

              {/* Tile 3: Jeans */}
              <div className="h-[108px] rounded-2xl bg-[#DDEBFF] flex flex-col items-center justify-center gap-2 text-xs text-[#111] shadow-xs select-none">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 3h10l1.5 18h-5L12 10l-1.5 11h-5z" />
                  <path d="M7 6.5h10" />
                </svg>
                <span>Jeans</span>
              </div>

              {/* Tile 4: Jackets */}
              <div className="h-[108px] rounded-2xl bg-[#FFE0D6] flex flex-col items-center justify-center gap-2 text-xs text-[#111] shadow-xs select-none">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 3 3 6v14h7V8.5l2 2.5 2-2.5V20h7V6l-6-3c-.5 1.5-1.5 2.5-3 2.5S9.5 4.5 9 3z" />
                  <path d="M12 11v9M5.5 14H8M16 14h2.5" />
                </svg>
                <span>Jackets</span>
              </div>

              {/* Tile 5: Caps */}
              <div className="h-[108px] rounded-2xl bg-[#EADFFC] flex flex-col items-center justify-center gap-2 text-xs text-[#111] shadow-xs select-none">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 16a8 8 0 0 1 16 0z" />
                  <path d="M20 16c1.5 0 2.5.5 2.5 1.5H8" />
                  <path d="M12 8.2V6.5" />
                </svg>
                <span>Caps</span>
              </div>

              {/* Tile 6: Sneakers */}
              <div className="h-[108px] rounded-2xl bg-[#E3F2E1] flex flex-col items-center justify-center gap-2 text-xs text-[#111] shadow-xs select-none">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 17V8.5c2.5 0 4.5 1 5.5 3 .8 1.5 2 2.2 4 2.7l5.2 1.3c1.7.4 2.8 1.2 2.8 2.5V17z" />
                  <path d="M3 20h19M9 10.5l1.2 1.2M11 9.5l1.3 1.3" />
                </svg>
                <span>Sneakers</span>
              </div>
            </div>

            {/* Typography */}
            <div>
              <div className="text-[36px] sm:text-[40px] font-medium leading-[1.1] text-[#111]">
                Dress loud.<br />Live louder.
              </div>
              <div className="text-sm text-[#111] leading-relaxed max-w-[300px] mt-3 font-normal opacity-90">
                Streetwear made for campus, concerts and everything between.
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-[11px] text-[#111] opacity-75">
            &copy; 2026 Wardrobe &middot; Privacy &middot; Terms
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: LOGIN FORM (Exact Layout from Mockup)       */}
        {/* ========================================================= */}
        <div className="p-8 sm:p-12 lg:px-20 lg:py-14 flex flex-col justify-center box-border bg-white">
          <div className="max-w-[440px] w-full mx-auto">
            {/* Header */}
            <h1 className="text-[28px] font-medium text-[#111] mb-1.5 leading-tight">
              {isRegisterMode ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-[#555] mb-7 leading-normal">
              {isRegisterMode
                ? 'Join Wardrobe to unlock member drops and faster checkout.'
                : 'Log in to track orders and check out faster.'}
            </p>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-red-800 text-xs animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="mb-5 p-3.5 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2.5 text-green-800 text-xs animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Login / Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name (if registering) */}
              {isRegisterMode && (
                <div>
                  <label className="block text-xs font-medium text-[#111] mb-1.5" htmlFor="fn">
                    Full Name
                  </label>
                  <input
                    id="fn"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nirav Patel"
                    className="w-full h-11 border border-[#b9b6aa] rounded-lg px-3.5 text-sm text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-transparent transition"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1.5" htmlFor="em">
                  Email
                </label>
                <input
                  id="em"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 border border-[#b9b6aa] rounded-lg px-3.5 text-sm text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-transparent transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1.5" htmlFor="pw">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="pw"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isRegisterMode ? 'At least 8 characters' : 'Enter your password'}
                    className="w-full h-11 border border-[#b9b6aa] rounded-lg pl-3.5 pr-11 text-sm text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-1 top-0 w-11 h-11 border-0 bg-transparent cursor-pointer flex items-center justify-center text-[#52514e] hover:text-[#111] transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Options Row (Keep Logged in & Forgot Password) */}
              {!isRegisterMode && (
                <div className="flex justify-between items-center text-xs text-[#111] pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={keepLoggedIn}
                      onChange={(e) => setKeepLoggedIn(e.target.checked)}
                      className="w-4 h-4 accent-[#111] cursor-pointer"
                    />
                    <span>Keep me logged in</span>
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link will be sent to your email.'); }} className="text-[#111] hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg font-medium text-sm bg-[#111] text-[#FFD400] border-0 cursor-pointer hover:bg-black transition-all flex items-center justify-center gap-2 mt-5 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#FFD400]" />
                    <span>{isRegisterMode ? 'Creating account...' : 'Logging in...'}</span>
                  </>
                ) : (
                  <span>{isRegisterMode ? 'Create account' : 'Log in'}</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4 text-xs text-[#555]">
              <div className="flex-1 h-px bg-[#e7e5e0]" />
              <span>or</span>
              <div className="flex-1 h-px bg-[#e7e5e0]" />
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={() => alert('Google authentication is enabled in production.')}
              className="w-full h-11 rounded-lg font-medium text-sm bg-white text-[#111] border border-[#111] hover:bg-neutral-50 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Toggle Login / Register */}
            <div className="text-center text-[13px] text-[#555] mt-6">
              {isRegisterMode ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(false);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="font-medium text-[#111] hover:underline cursor-pointer"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  New to Wardrobe?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(true);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="font-medium text-[#111] hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </>
              )}
            </div>

            {/* Quick helper for Admin Portal */}
            <div className="mt-6 pt-4 border-t border-[#e7e5e0] text-center">
              <Link
                to="/admin"
                className="text-xs text-brand-muted hover:text-[#111] font-medium transition"
              >
                Store administrator? Access Admin Portal &rarr;
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

