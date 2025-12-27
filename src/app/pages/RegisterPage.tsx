import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useApp } from '../context/AppContext';
import { Heart, User, Mail, Phone, Lock, Loader, Eye, EyeOff, CircleCheck } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap harus diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email belum sesuai';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon harus diisi';
    } else if (!/^[0-9]{10,13}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Nomor telepon harus 10-13 digit';
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak sama';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(
        formData.name,
        formData.email,
        formData.phone,
        formData.password
      );

      if (success) {
        toast.success('Pendaftaran berhasil! Silakan login untuk melanjutkan 🎉');
        setTimeout(() => {
          onNavigate('login');
        }, 1500);
      }
    } catch (err) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#93c5fd]/20 via-[#ddd6fe]/20 to-[#86efac]/20 py-16 px-4 flex items-center justify-center">
      <Card className="w-full max-w-md border-2 shadow-lg">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#93c5fd] to-[#ddd6fe] rounded-full mx-auto">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#1e3a8a] to-[#5b21b6] bg-clip-text text-transparent">
            Bergabung dengan Pulih Bersama
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Langkah pertama menuju pemulihan yang lebih baik ✨
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#93c5fd]" />
                Nama Lengkap
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Masukkan nama lengkap"
                className={`border-2 ${errors.name ? 'border-red-300' : 'focus:border-[#93c5fd]'}`}
                disabled={isLoading}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#93c5fd]" />
                Nomor Telepon
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="08xxxxxxxxxx"
                className={`border-2 ${errors.phone ? 'border-red-300' : 'focus:border-[#93c5fd]'}`}
                disabled={isLoading}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#93c5fd]" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="nama@email.com"
                className={`border-2 ${errors.email ? 'border-red-300' : 'focus:border-[#93c5fd]'}`}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#93c5fd]" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className={`border-2 pr-10 ${errors.password ? 'border-red-300' : 'focus:border-[#93c5fd]'}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <CircleCheck className="w-4 h-4 text-[#93c5fd]" />
                Konfirmasi Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Masukkan password yang sama"
                  className={`border-2 pr-10 ${errors.confirmPassword ? 'border-red-300' : 'focus:border-[#93c5fd]'}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#93c5fd] to-[#ddd6fe] text-[#1e3a8a] hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Sedang mendaftar...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-[#1e3a8a] hover:text-[#93c5fd] font-semibold"
              >
                Masuk di sini
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
