import { NavLink } from 'react-router-dom';
import { BarChart, FileText, UploadCloud, Brain, X, UserCircle } from 'lucide-react';

export default function Sidebar({ isOpen, onClose, user }) {
  // user is expected to be an object like { name: 'John Doe', email: 'john.doe@example.com' }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-gray-800 border-r border-gray-700 p-6">
        <div>
          <h1 className="text-xl font-bold mb-6 text-white">Dataverse Analytics</h1>
          <nav className="space-y-3">
            <SidebarLink to="/dashboard" icon={<BarChart />} label="Dashboard" />
            <SidebarLink to="/uploads" icon={<FileText />} label="Upload History" />
            <SidebarLink to="/charts" icon={<UploadCloud />} label="Charts" />
            <SidebarLink to="/insights" icon={<Brain />} label="AI Insights" />
            <SidebarLink to="/profile" icon={<UserCircle />} label="Profile" />
          </nav>
        </div>

        {/* Account Info */}
        <div className="pt-6 border-t border-gray-700">
          <div className="flex items-center gap-3">
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={onClose}>
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-gray-800 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-white">Dataverse</h1>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <nav className="space-y-3 mb-6">
              <SidebarLink to="/dashboard" icon={<BarChart />} label="Dashboard" />
              <SidebarLink to="/uploads" icon={<FileText />} label="Upload History" />
              <SidebarLink to="/charts" icon={<UploadCloud />} label="Charts" />
              <SidebarLink to="/insights" icon={<Brain />} label="AI Insights" />
              <SidebarLink to="/profile" icon={<UserCircle />} label="Profile" />
            </nav>

            {/* Account info mobile */}
            <div className="pt-6 border-t border-gray-700">
              <div className="flex items-center gap-3">
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
          isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
