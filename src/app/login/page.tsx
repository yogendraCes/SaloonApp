'use client';

import { Scissors, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Show a small inline note instead of navigating away on "Forgot password"
  const [showForgotNote, setShowForgotNote] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#262420]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-[#A49A87] text-[#1C1A17] p-2.5 rounded-xl shadow-md">
            <Scissors className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#262420]">
          Sign in to Zenyme
        </h2>
        <p className="mt-2 text-center text-sm text-[#7C756A]">
          Manage your salon with ease
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-[#E8E5DF]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#423F39]">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="admin@zenyme.com"
                  className="appearance-none block w-full px-3 py-2 border border-[#CCC8C3] rounded-lg shadow-xs placeholder-gray-400 focus:outline-none focus:ring-[#A49A87] focus:border-[#A49A87] sm:text-sm text-[#262420]"
                />
              </div>
            </div>

            {/* Password with visibility toggle */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#423F39]">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  defaultValue="password123"
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-[#CCC8C3] rounded-lg shadow-xs placeholder-gray-400 focus:outline-none focus:ring-[#A49A87] focus:border-[#A49A87] sm:text-sm text-[#262420]"
                />
                {/* Eye toggle — positioned inside the input on the right */}
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-[#968F83] hover:text-[#423F39] focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#A49A87] focus:ring-[#A49A87] border-[#CCC8C3] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#423F39]">
                  Remember me
                </label>
              </div>

              {/* Replaced <a href="#"> with a button to prevent page scroll and make intent clear */}
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotNote((v) => !v)}
                  className="font-medium text-[#8C8270] hover:text-[#6F6656] focus:outline-none"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            {/* Inline note shown when "Forgot password" is clicked */}
            {showForgotNote && (
              <div className="rounded-lg bg-[#E8E5DF] border border-[#CCC8C3] px-4 py-3 text-sm text-[#423F39]">
                This is a demo prototype. Password reset is not available. Use the pre-filled credentials to sign in.
              </div>
            )}

            {/* Submit & Demo Gate Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-[#1C1A17] bg-[#A49A87] hover:bg-[#8C8270] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A49A87] transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#1C1A17] border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Sign in'
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-[#CCC8C3] rounded-lg shadow-xs text-sm font-semibold text-[#2C2923] bg-[#E8E5DF] hover:bg-[#D8D3C8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A49A87] transition-colors"
              >
                🚀 Quick Portfolio Demo — Bypasses Auth
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
