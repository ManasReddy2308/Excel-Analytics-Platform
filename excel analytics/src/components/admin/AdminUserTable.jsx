// components/admin/AdminUserTable.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function AdminUserTable() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/admin/users`, { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user) => {
    setEditingUser(user._id);
    setForm({ email: user.email, password: '' });
  };

  const saveUser = async (id) => {
    try {
      await axios.put(
        `${API_BASE}/api/admin/users/${id}`,
        form,
        { withCredentials: true }
      );
      setEditingUser(null);
      setForm({ email: '', password: '' });
      fetchUsers();
    } catch (err) {
      console.error('Error updating user', err);
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setForm({ email: '', password: '' });
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/users/${id}`, { withCredentials: true });
      fetchUsers(); // 🔄 Refresh list after delete
    } catch (err) {
      console.error('Error deleting user', err);
      alert('Failed to delete user. Please try again.');
    }
  };

  return (
    <div className="overflow-x-auto text-white">
      {loading ? (
        <p className="text-gray-400 p-4">Loading users...</p>
      ) : (
        <table className="min-w-full border border-gray-700 rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="px-4 py-2 border border-gray-700 text-left">Email</th>
              <th className="px-4 py-2 border border-gray-700 text-left">Status</th>
              <th className="px-4 py-2 border border-gray-700 text-left">Created At</th>
              <th className="px-4 py-2 border border-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-800 transition-colors">
                  {/* Email */}
                  <td className="px-4 py-2 border border-gray-700">
                    {editingUser === user._id ? (
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="border border-gray-600 bg-gray-700 text-white p-1 rounded w-full"
                      />
                    ) : (
                      <span className="text-gray-200">{user.email}</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-2 border border-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-600 text-white'
                          : user.status === 'inactive'
                          ? 'bg-red-600 text-white'
                          : 'bg-yellow-500 text-black'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Created At */}
                  <td className="px-4 py-2 border border-gray-700 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2 border border-gray-700 text-center space-x-2">
                    {editingUser === user._id ? (
                      <>
                        <input
                          type="password"
                          placeholder="New password"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          className="border border-gray-600 bg-gray-700 text-white p-1 rounded"
                        />
                        <button
                          onClick={() => saveUser(user._id)}
                          className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(user)}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-400 p-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
