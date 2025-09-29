// src/pages/AdminDashboardPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminDashboardLayout from '../components/admin/AdminDashboardLayout';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: '--',
    activeUsers: '--',
    newRegistrations: '--',
    diskUsage: '--',
    trends: {},
  });
  const [engagement, setEngagement] = useState([]);
  const [systemHealth, setSystemHealth] = useState({ cpuPercent: 0, memoryPercent: 0 });
  const [storageTrend, setStorageTrend] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // dashboard stats
    axios.get(`${API_BASE}/api/admin/dashboard`, { headers })
      .then(res => setStats(res.data))
      .catch(err => console.error('Error fetching dashboard stats', err));

    // engagement
    axios.get(`${API_BASE}/api/admin/engagement`, { headers })
      .then(res => setEngagement(res.data || []))
      .catch(err => console.error('Error fetching engagement', err));

    // system health
    axios.get(`${API_BASE}/api/admin/system-health`, { headers })
      .then(res => setSystemHealth(res.data || { cpuPercent: 0, memoryPercent: 0 }))
      .catch(err => console.error('Error fetching system health', err));

    // storage trend
    axios.get(`${API_BASE}/api/admin/storage-trend`, { headers })
      .then(res => setStorageTrend(res.data || []))
      .catch(err => console.error('Error fetching storage trend', err));

    // recent activity
    axios.get(`${API_BASE}/api/admin/recent-activity`, { headers })
      .then(res => setRecentActivity(res.data || []))
      .catch(err => console.error('Error fetching recent activity', err));
  }, [token]);

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Welcome back, Administrator!</h2>
          <p className="text-sm text-gray-400">
            Here's a snapshot of your system and user activity today. Stay informed and manage with ease.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={stats.totalUsers?.toLocaleString?.() || stats.totalUsers} trend={stats.trends?.totalUsers || '+0%'} color="blue" />
          <StatCard title="Active Users" value={stats.activeUsers?.toLocaleString?.() || stats.activeUsers} trend={stats.trends?.activeUsers || '+0%'} color="green" />
          <StatCard title="New Registrations" value={stats.newRegistrations?.toLocaleString?.() || stats.newRegistrations} trend={stats.trends?.newRegistrations || '+0%'} color="red" />
          <StatCard title="Disk Usage" value={stats.diskUsage || '--'} trend={stats.trends?.diskUsage || '+0%'} color="yellow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Engagement Chart */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">User Engagement Overview</h3>
            <div className="h-60 bg-gray-900 flex items-center justify-center rounded-md text-gray-500">
              {/* Keep placeholder look, but show small summary */}
              {engagement && engagement.length > 0 ? (
                <div className="text-sm text-gray-300">
                  Showing uploads for last 7 days:
                  <ul className="mt-2 space-y-1">
                    {engagement.map((d) => (
                      <li key={d.date}>
                        <strong>{d.date}:</strong> {d.uploads} upload{d.uploads !== 1 ? 's' : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-gray-500">Engagement chart here (Bar)</div>
              )}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-gray-800 p-6 rounded-xl shadow space-y-4">
            <h3 className="text-lg font-semibold">System Health</h3>
            <div>
              <p className="text-sm mb-1 text-gray-400">CPU Usage</p>
              <div className="bg-gray-700 h-3 rounded-full">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${Math.min(systemHealth.cpuPercent, 100)}%` }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">{systemHealth.cpuPercent ?? 0}%</p>
            </div>
            <div>
              <p className="text-sm mb-1 text-gray-400">Memory Usage</p>
              <div className="bg-gray-700 h-3 rounded-full">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${Math.min(systemHealth.memoryPercent, 100)}%` }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">{systemHealth.memoryPercent ?? 0}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Storage Chart */}
          <div className="bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Data Storage Trend</h3>
            <div className="h-48 bg-gray-900 flex items-center justify-center rounded-md text-gray-500">
              {storageTrend && storageTrend.length > 0 ? (
                <div className="text-sm text-gray-300">
                  <ul className="space-y-1">
                    {storageTrend.map((s) => (
                      <li key={s.date}>
                        <strong>{s.date}:</strong> {s.sizeGB} GB
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>Area chart placeholder</div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Activity Logs</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((log, idx) => (
                  <li key={idx}>
                    {log.message}
                  </li>
                ))
              ) : (
                <>
                  <li>✔️ John Smith updated system settings</li>
                  <li>📁 New file uploaded by user123</li>
                  <li>⚠️ System alert: High CPU usage detected</li>
                  <li>🗑️ Jane Doe deleted old backup</li>
                  <li>🔐 Admin enabled 2FA for all users</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

function StatCard({ title, value, trend, color }) {
  const colorMap = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400'
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <h2 className="text-2xl font-bold text-white">{value}</h2>
      <p className={`text-xs ${colorMap[color]}`}>Compared to last week: {trend}</p>
    </div>
  );
}
