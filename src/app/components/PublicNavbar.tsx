import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { Button } from './ui/button';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Tentang Kami', path: '/about' },
    { label: 'Berita', path: '/news' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#93c5fd] to-[#ddd6fe] rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-[#93c5fd] to-[#ddd6fe] bg-clip-text text-transparent">
              Pulih Bersama
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors ${
                  isActive(item.path)
                    ? 'text-[#1e3a8a]'
                    : 'text-gray-600 hover:text-[#1e3a8a]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/login">
              <Button
                variant="outline"
                className="border-[#93c5fd] text-[#1e3a8a] hover:bg-[#93c5fd]/10"
              >
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button
                className="bg-gradient-to-r from-[#93c5fd] to-[#ddd6fe] text-[#1e3a8a] hover:opacity-90"
              >
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#93c5fd]/10 text-[#1e3a8a]'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 pt-2 space-y-2">
              <Link to="/login" className="block">
                <Button
                  variant="outline"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full border-[#93c5fd] text-[#1e3a8a]"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register" className="block">
                <Button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-gradient-to-r from-[#93c5fd] to-[#ddd6fe] text-[#1e3a8a]"
                >
                  Register
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
