import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RoleSelect from "./RoleSelect";

export default async function UsersManagementPage() {
  const session = await auth();

  if (session?.user?.role !== "OWNER") {
    redirect("/admin"); // Redirect non-owners back to the main dashboard
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 dark:text-white">User & Team Management</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-zinc-300">
            A list of all registered accounts in your platform. As the OWNER, you can promote accounts to ADMIN to help you manage products and orders.
          </p>
        </div>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-zinc-800 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-zinc-800">
                <thead className="bg-gray-50 dark:bg-zinc-900">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Joined At</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                        {u.name || "N/A"}
                        {session.user.id === u.id && (
                           <span className="ml-2 inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-500/15 dark:text-green-200 ring-1 ring-inset ring-green-600/20 dark:ring-green-500/30">You</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-zinc-400">{u.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-zinc-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-zinc-400">
                        {session.user.id === u.id ? (
                           <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-sm font-medium text-purple-700 dark:bg-purple-500/15 dark:text-purple-200 ring-1 ring-inset ring-purple-700/10 dark:ring-purple-500/30">OWNER</span>
                        ) : (
                          <RoleSelect userId={u.id} currentRole={u.role} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
