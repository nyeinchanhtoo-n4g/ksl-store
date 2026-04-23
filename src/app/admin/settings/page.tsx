import { prisma } from "@/lib/prisma";
import { updateStoreSettings } from "@/actions/settings.actions";

export default async function SettingsPage() {
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 1 },
  }) || { telegramUrl: "", messengerUrl: "" };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Configure your global store settings like Telegram and Messenger URLs.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 overflow-hidden">
        <form action={updateStoreSettings} className="space-y-6">
          <div>
            <label htmlFor="telegramUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telegram Bot Setup URL</label>
            <div className="mt-1">
              <input
                type="url"
                name="telegramUrl"
                id="telegramUrl"
                defaultValue={settings.telegramUrl || ""}
                placeholder="https://t.me/your_bot"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">The base URL where guest checkout orders will be redirected to.</p>
          </div>

          <div>
            <label htmlFor="messengerUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Messenger URL</label>
            <div className="mt-1">
              <input
                type="url"
                name="messengerUrl"
                id="messengerUrl"
                defaultValue={settings.messengerUrl || ""}
                placeholder="https://m.me/your_page"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">Alternatively, link to your Facebook Messenger page.</p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
