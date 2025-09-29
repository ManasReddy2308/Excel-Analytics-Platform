import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-950 bg-opacity-80 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-white">Dataverse</div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
          <a href="#dashboard" className="text-gray-300 hover:text-white transition">Dashboard</a>
          <a href="#footer" className="text-gray-300 hover:text-white transition">Contact</a>
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-300">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Login Button */}
        <Link to="/login" className="hidden md:inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
            Login
        </Link>

      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 px-6 pb-4 space-y-2">
          <a href="#features" className="block text-gray-300 hover:text-white transition">Features</a>
          <a href="#dashboard" className="block text-gray-300 hover:text-white transition">Dashboard</a>
          <a href="#footer" className="block text-gray-300 hover:text-white transition">Contact</a>
          <Link to="/login" className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow w-fit mt-2">
             Login
          </Link>
        </div>
      )}
    </header>
  );
}
