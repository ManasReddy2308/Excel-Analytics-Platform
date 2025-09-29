import { useEffect, useState } from "react";
import axios from "axios";
import AdminDashboardLayout from "../components/admin/AdminDashboardLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AdminSettingsPage() {
  const [account, setAccount] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [preferences, setPreferences] = useState({
    enableUploads: true,
    maxUploadSize: 10,
    enableAI: false
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    axios
      .get(`${API_BASE}/api/admin-settings`, { withCredentials: true })
      .then((res) => {
        if (!isMounted) return;

        const adminData = res.data?.admin || {};
        const settingsData = res.data?.settings || {};

        setAccount({
          name: adminData.name || "",
          email: adminData.email || "",
          password: ""
        });

        setPreferences({
          enableUploads: settingsData.enableUploads ?? true,
          maxUploadSize: settingsData.maxUploadSize ?? 10,
          enableAI: settingsData.enableAI ?? false
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch settings error:", err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateAccount = () => {
    axios
      .put(`${API_BASE}/api/admin-settings/account`, account, {
        withCredentials: true
      })
      .then(() => alert("Account updated successfully"))
      .catch((err) => console.error(err));
  };

  const updatePreferences = () => {
    axios
      .put(`${API_BASE}/api/admin-settings/preferences`, preferences, {
        withCredentials: true
      })
      .then(() => alert("Preferences updated successfully"))
      .catch((err) => console.error(err));
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <p className="text-white">Loading...</p>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-8 text-white">
        {/* Account Settings */}
        <section className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={account.name}
              onChange={(e) =>
                setAccount({ ...account, name: e.target.value })
              }
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              placeholder="Admin Name"
            />
            <input
              type="email"
              value={account.email}
              onChange={(e) =>
                setAccount({ ...account, email: e.target.value })
              }
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              placeholder="Email"
            />
            <input
              type="password"
              value={account.password}
              onChange={(e) =>
                setAccount({ ...account, password: e.target.value })
              }
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              placeholder="New Password"
            />
            <button
              onClick={updateAccount}
              className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Account
            </button>
          </div>
        </section>

        {/* System Preferences */}
        <section className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">System Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Enable File Uploads</span>
              <input
                type="checkbox"
                checked={!!preferences.enableUploads}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    enableUploads: e.target.checked
                  })
                }
                className="h-5 w-5 accent-blue-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Max Upload Size (MB)</span>
              <input
                type="number"
                value={preferences.maxUploadSize}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    maxUploadSize: Number(e.target.value) || 0
                  })
                }
                className="w-20 p-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Enable AI Insights</span>
              <input
                type="checkbox"
                checked={!!preferences.enableAI}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    enableAI: e.target.checked
                  })
                }
                className="h-5 w-5 accent-blue-600"
              />
            </div>
            <button
              onClick={updatePreferences}
              className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Preferences
            </button>
          </div>
        </section>
      </div>
    </AdminDashboardLayout>
  );
}
