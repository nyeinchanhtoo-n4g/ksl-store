import { prisma } from "@/lib/prisma";
import { updateStoreSettings } from "@/actions/settings.actions";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default async function SettingsPage() {
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 1 },
  });

  const displaySettings = settings || { 
    logoUrl: "", 
    faviconUrl: "", 
    telegramUrl: "", 
    viberUrl: "" 
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store Settings</h1>
        <p className="text-gray-600 dark:text-zinc-300">Configure your global store settings like Logo, Favicon, Telegram and Viber URLs.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 sm:p-8 overflow-hidden">
        <form action={updateStoreSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploadField
              name="logoUrl"
              label="Store Logo URL"
              defaultValue={(displaySettings as any).logoUrl || ""}
              placeholder="https://example.com/logo.png"
              helperText="Visible in the Navbar and checkout."
              folder="ksl-project/settings"
            />

            <ImageUploadField
              name="faviconUrl"
              label="Favicon URL"
              defaultValue={(displaySettings as any).faviconUrl || ""}
              placeholder="https://example.com/favicon.ico"
              helperText="Visible in the browser tab."
              folder="ksl-project/settings"
            />
          </div>

          <hr className="border-gray-100 dark:border-zinc-800" />

          <div>
            <label htmlFor="telegramUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telegram Bot Setup URL</label>
            <div className="mt-1">
              <input
                type="url"
                name="telegramUrl"
                id="telegramUrl"
                defaultValue={displaySettings.telegramUrl || ""}
                placeholder="https://t.me/your_bot"
                className="block w-full rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800/80 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 sm:text-sm py-2.5 px-3"
              />
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
              The base URL where guest checkout orders will be redirected to.
            </p>
          </div>

          <div>
            <label htmlFor="viberUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Viber URL</label>
            <div className="mt-1">
              <input
                type="url"
                name="viberUrl"
                id="viberUrl"
                defaultValue={displaySettings.viberUrl || ""}
                placeholder="viber://chat?number=959xxxxxxxxx"
                className="block w-full rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800/80 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 sm:text-sm py-2.5 px-3"
              />
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
              Where guest checkout orders will redirect for Viber contact.
            </p>
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
