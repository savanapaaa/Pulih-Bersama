import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { House, FileText, Clock, User, LogOut, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from '../context/AppContext';

export const UserSidebar: React.FC = () => {
  const { logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: House, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Diagnosis', path: '/diagnosis' },
    { icon: Clock, label: 'Riwayat', path: '/history' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white border-r border-border h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#93c5fd] to-[#ddd6fe] rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Pulih Bersama</h2>
            <p className="text-xs text-gray-500">User Panel</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-gradient-to-r from-[#93c5fd] to-[#ddd6fe] text-[#1e3a8a]'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:border-red-300"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Keluar
        </Button>
      </div>
    </aside>
  );
};
