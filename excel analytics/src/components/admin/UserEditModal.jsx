// src/components/admin/UserEditModal.jsx
import { useState } from "react";

export default function UserEditModal({ user, onClose }) {
  const [password, setPassword] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>

        <div className="mb-3">
          <label className="block text-sm mb-1">Email:</label>
          <input
            type="text"
            value={user.email}
            readOnly
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">New Password:</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Account Created:</label>
          <input
            type="text"
            value={new Date(user.createdAt).toLocaleString()}
            readOnly
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
