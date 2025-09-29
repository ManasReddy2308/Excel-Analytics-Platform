// src/components/dashboard/Topbar.jsx
import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-lg font-medium">Dashboard</div>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1.5 rounded-md border border-gray-600 bg-gray-800 text-sm text-white focus:outline-none"
        />
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-600 flex items-center gap-1 text-sm"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </header>
  );
}
