import React from 'react';
import { Heart, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-[#93c5fd]/10 to-[#ddd6fe]/10 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#93c5fd] to-[#ddd6fe] rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-[#93c5fd] to-[#ddd6fe] bg-clip-text text-transparent">
                Pulih Bersama
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Platform deteksi dini dan pemulihan kesehatan mental untuk anak dan remaja yang terdampak perceraian orang tua.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">⚠️ Penting untuk Diketahui</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Platform ini adalah alat skrining awal dan <strong>bukan pengganti</strong> konsultasi dengan profesional kesehatan mental. Jika Anda atau anak Anda mengalami kesulitan, silakan hubungi tenaga profesional.
            </p>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">🆘 Butuh Bantuan Segera?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <Phone className="w-5 h-5 text-[#93c5fd] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Hotline Kesehatan Mental</p>
                  <p className="text-gray-600">119 ext. 8 (24 jam)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Mail className="w-5 h-5 text-[#93c5fd] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Email Konsultasi</p>
                  <p className="text-gray-600">support@pulihbersama.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-gray-500">
          <p>© 2025 Pulih Bersama. Dibuat dengan ❤️ untuk kesejahteraan anak Indonesia.</p>
        </div>
      </div>
    </footer>
  );
};
