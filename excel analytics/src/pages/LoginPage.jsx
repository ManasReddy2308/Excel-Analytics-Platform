import { useState } from 'react';
import { Mail, Lock, UserCircle, ShieldCheck, User } from 'lucide-react';
import backgroundImage from '../assets/background.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [role, setRole] = useState('user');
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setName('');
    setErrorMsg('');
  };

  const handleLogin = async () => {
    setErrorMsg('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      const { user, token } = res.data;

      // Save auth data
      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      // ✅ If admin, go directly to /admin
      if (user.role === 'admin') {
        navigate('/admin');
        return;
      }

      // ✅ Check if selected role matches backend role
      if (user.role !== role) {
        setErrorMsg(
          `Role mismatch! You selected "${role}" but your account role is "${user.role}".`
        );
        return;
      }

      // ✅ Normal user route
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async () => {
    setErrorMsg('');

    // Prevent admin registration
    if (role === 'admin') {
      setErrorMsg('Admin registration is not allowed.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/auth/register',
        { name, email, password, role },
        { withCredentials: true }
      );

      alert('Registration successful. You can now log in.');
      setTab('login');
      resetFields();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-lg font-bold">💖</span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">
          Welcome to Dataverse Analytics
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Your secure gateway to advanced features and personalized experiences.
        </p>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-6">
          <button
            onClick={() => {
              setTab('login');
              resetFields();
            }}
            className={`w-1/2 py-2 text-sm font-medium ${
              tab === 'login'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setTab('register');
              resetFields();
            }}
            className={`w-1/2 py-2 text-sm font-medium ${
              tab === 'register'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Register
          </button>
        </div>

        <div className="space-y-4">
          {tab === 'register' && (
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Role toggle */}
          <div className="flex justify-center gap-4 mt-2">
            <button
              onClick={() => setRole('user')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm border ${
                role === 'user'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              <UserCircle className="w-4 h-4" /> User
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm border ${
                role === 'admin'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Admin
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={tab === 'login' ? handleLogin : handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
          >
            {tab === 'login' ? 'Secure Login' : 'Register'}
          </button>

          {errorMsg && (
            <p className="text-sm text-center text-red-600 mt-1">{errorMsg}</p>
          )}

          {tab === 'login' && (
            <p className="text-sm text-center text-gray-500 mt-2 hover:underline cursor-pointer">
              Forgot your password?
            </p>
          )}

          <p className="text-xs text-center text-gray-400 mt-4">
            By continuing, you agree to our
            <span className="text-blue-600 cursor-pointer"> Terms of Service </span>
            and
            <span className="text-blue-600 cursor-pointer"> Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
