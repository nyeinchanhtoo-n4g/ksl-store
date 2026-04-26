"use client";

import { useState, useTransition } from "react";
import { registerAction } from "@/actions/auth.actions";
import Link from "next/link";
import { UserPlus, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await registerAction(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
        setTimeout(() => router.push("/login"), 2000);
      }
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
            <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-zinc-400">
            Join H²O LEATHER to start shopping
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
              <div>
                <p className="font-semibold">{success}</p>
                <p className="mt-1 text-xs opacity-80">Redirecting to login...</p>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" title="Password" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                  placeholder="Minimum 8 characters"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending || !!success}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 text-center">
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
