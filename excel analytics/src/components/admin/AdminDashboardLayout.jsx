import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../utils/auth'; // ✅ Adjust the path if needed

export default function AdminDashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-gray-800 p-6 space-y-6 fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out z-50`}
      >
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <nav className="space-y-3">
          <SidebarLink to="/admin" label="Dashboard" />
          <SidebarLink to="/admin/users" label="User Management" />
          <SidebarLink to="/admin/analytics" label="Analytics" />
          <SidebarLink to="/admin/reports" label="Reports" />
          <SidebarLink to="/admin/settings" label="Settings" />
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Topbar */}
        <header className="bg-gray-800 p-4 flex justify-between items-center sticky top-0 z-30">
          <button
            className="md:hidden text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <input
            type="text"
            placeholder="Search users or reports..."
            className="w-full max-w-md px-4 py-2 bg-gray-700 text-sm rounded-md text-white placeholder-gray-400"
          />

          <div className="flex items-center gap-3">
            <NavLink to="/admin/profile">
              <img
                src="https://i.pravatar.cc/40"
                alt="admin-avatar"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </NavLink>
            <button
              onClick={handleLogout}
              className="text-sm flex items-center gap-1 text-red-400 hover:text-red-500"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-6 bg-gray-900 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm font-medium transition ${
          isActive
            ? 'bg-gray-700 text-white'
            : 'text-gray-300 hover:text-white hover:bg-gray-700'
        }`
      }
    >
      {label}
    </NavLink>
  );
}
