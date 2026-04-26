"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/actions/auth.actions";
import Link from "next/link";
import { LogIn, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      try {
        // We use client-side signIn to ensure the session context updates immediately
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password");
        } else {
          setSuccess(true);
          // Force a full page reload to the home page to ensure all server components 
          // and the layout pick up the new session state immediately.
          window.location.href = "/";
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
            <LogIn className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-zinc-400">
            Sign in to manage your orders and profile
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl text-green-700 dark:text-green-400 text-sm animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <p>Login successful! Redirecting...</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending || success}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 text-center">
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
