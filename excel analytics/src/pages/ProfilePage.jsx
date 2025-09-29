import { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import axios from 'axios';
import { logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    avatar: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/user/me`, {
        withCredentials: true,
      });
      setProfile(res.data);
      setForm({
        name: res.data.name || '',
        email: res.data.email || '',
        location: res.data.location || '',
        avatar: res.data.avatar || '',
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('location', form.location);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await axios.put(`${API_BASE}/api/user/me`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setEditMode(false);
      setAvatarFile(null);
      fetchProfile();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Profile update failed');
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put(`${API_BASE}/api/user/me/password`, passwordForm, {
        withCredentials: true,
      });
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setChangePasswordMode(false);
      toast.success('Password updated!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Password update failed');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${API_BASE}/api/user/me`, {
        withCredentials: true,
      });
      logout();
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Account deletion failed');
    }
  };

  if (!profile) {
    return (
      <DashboardLayout>
        <p className="text-white">Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 text-white">
        {/* Profile Info */}
        <section className="bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Profile</h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={
                avatarFile
                  ? URL.createObjectURL(avatarFile)
                  : form.avatar
                  ? form.avatar.startsWith('http')
                    ? form.avatar
                    : `${API_BASE}/${form.avatar.replace(/^\/+/, '')}`
                  : 'https://i.pravatar.cc/100'
              }
              className="w-16 h-16 rounded-full object-cover"
              alt="avatar"
            />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setAvatarFile(e.target.files[0])}
                className="text-sm text-white"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
            <div>
              <label className="text-gray-400">Name</label>
              {editMode ? (
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded p-2"
                />
              ) : (
                <p>{profile.name}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400">Email</label>
              {editMode ? (
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded p-2"
                />
              ) : (
                <p>{profile.email}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400">Location</label>
              {editMode ? (
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded p-2"
                />
              ) : (
                <p>{profile.location || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400">Joined</label>
              <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {editMode && (
            <button
              onClick={handleUpdate}
              className="mt-4 bg-green-600 px-4 py-2 rounded text-sm"
            >
              Save Changes
            </button>
          )}
        </section>

        {/* Change Password */}
        <section className="bg-gray-800 p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Change Password</h3>
            <button
              onClick={() => setChangePasswordMode(!changePasswordMode)}
              className="text-blue-400 text-sm"
            >
              {changePasswordMode ? 'Cancel' : 'Change'}
            </button>
          </div>
          {changePasswordMode && (
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full p-2 bg-gray-700 text-white rounded"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                className="w-full p-2 bg-gray-700 text-white rounded"
              />
              <button
                onClick={handlePasswordChange}
                className="bg-green-600 px-4 py-2 rounded text-sm"
              >
                Update Password
              </button>
            </div>
          )}
        </section>

        {/* Account Deletion */}
        <section className="bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Delete Account</h3>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Delete My Account
          </button>
        </section>
      </div>
    </DashboardLayout>
  );
}
