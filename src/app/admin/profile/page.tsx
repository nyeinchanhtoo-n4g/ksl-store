"use client";

import { useState, useTransition } from "react";
import { changePasswordAction } from "@/actions/auth.actions";
import { KeyRound, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await changePasswordAction(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Security</h1>
        <p className="text-gray-600 dark:text-zinc-400">Manage your password and security settings.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center space-x-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
            <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-700 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg text-green-700 dark:text-green-400 text-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <div className="grid gap-4">
              <div>
                <label htmlFor="oldPassword" title="Current Password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  id="oldPassword"
                  required
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 sm:text-sm py-2.5 px-3 transition-all"
                />
              </div>

              <div className="h-px bg-gray-100 dark:bg-zinc-800 my-2"></div>

              <div>
                <label htmlFor="newPassword" title="New Password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  required
                  placeholder="Minimum 8 characters"
                  className="block w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 sm:text-sm py-2.5 px-3 transition-all"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" title="Confirm New Password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  placeholder="Repeat new password"
                  className="block w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 sm:text-sm py-2.5 px-3 transition-all"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-zinc-950"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
        <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
          <span className="font-semibold">Security Tip:</span> Use a unique password that you haven&apos;t used elsewhere. A mix of letters, numbers, and special characters is recommended.
        </p>
      </div>
    </div>
  );
}
