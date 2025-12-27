import React from 'react';
import { Heart, Target, Eye, Shield } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

export const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'Empati',
      description: 'Kami memahami bahwa setiap anak memiliki perasaan yang valid dan berharga',
      color: '#93c5fd',
    },
    {
      icon: Shield,
      title: 'Keamanan Emosional',
      description: 'Menciptakan ruang aman tanpa judgment untuk berbagi perasaan',
      color: '#86efac',
    },
    {
      icon: Target,
      title: 'Deteksi Dini',
      description: 'Mengidentifikasi masalah kesehatan mental sejak dini untuk intervensi tepat waktu',
      color: '#ddd6fe',
    },
    {
      icon: Eye,
      title: 'Trauma-Aware',
      description: 'Pendekatan yang sensitif terhadap trauma dan pengalaman unik setiap anak',
      color: '#fde68a',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#93c5fd]/5 to-[#ddd6fe]/5">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#93c5fd]/20 to-[#ddd6fe]/20 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1e3a8a] to-[#5b21b6] bg-clip-text text-transparent">
            Tentang Pulih Bersama
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Platform kesehatan mental yang dirancang khusus untuk mendampingi anak dan remaja 
            dalam menghadapi perubahan hidup akibat perceraian orang tua.
          </p>
        </div>
      </section>

      {/* Background */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-2">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Latar Belakang
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Perceraian orang tua adalah peristiwa yang dapat memberikan dampak signifikan 
                  terhadap kesehatan mental anak dan remaja. Banyak anak yang mengalami 
                  gangguan tidur, perubahan emosi, penurunan motivasi, kecemasan, dan 
                  kesulitan dalam penyesuaian sosial.
                </p>
                <p>
                  <strong>Pulih Bersama</strong> hadir sebagai solusi untuk memberikan deteksi dini 
                  terhadap kondisi kesehatan mental anak dan remaja yang terdampak perceraian. 
                  Kami menggunakan metode <strong>Certainty Factor</strong> untuk menganalisis 
                  gejala dan memberikan rekomendasi yang dipersonalisasi menggunakan 
                  <strong> Content-Based Filtering</strong>.
                </p>
                <p>
                  Platform ini dikembangkan dengan pendekatan trauma-aware, memastikan bahwa 
                  setiap interaksi bersifat empatik, non-judgmental, dan aman secara emosional.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vision & Mission */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 bg-gradient-to-br from-[#93c5fd]/10 to-white">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#93c5fd] to-[#ddd6fe] rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Visi</h3>
                <p className="text-gray-600 leading-relaxed">
                  Menjadi platform terpercaya dalam mendukung kesehatan mental anak dan remaja 
                  Indonesia yang terdampak perceraian orang tua, menciptakan generasi yang tangguh 
                  dan sehat secara emosional.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 bg-gradient-to-br from-[#ddd6fe]/10 to-white">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ddd6fe] to-[#93c5fd] rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Misi</h3>
                <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
                  <li>Menyediakan alat skrining kesehatan mental yang mudah diakses</li>
                  <li>Memberikan rekomendasi pemulihan yang personal dan evidence-based</li>
                  <li>Menciptakan lingkungan digital yang aman dan empatik</li>
                  <li>Meningkatkan awareness tentang kesehatan mental anak</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Nilai-Nilai Kami
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center space-y-4">
                    <div 
                      className="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-md"
                      style={{ backgroundColor: value.color }}
                    >
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800">{value.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Focus */}
          <Card className="border-2 bg-gradient-to-br from-[#86efac]/10 to-white">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Fokus Pemulihan Emosional
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Kami fokus pada lima area utama yang sering terdampak oleh perceraian orang tua:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#93c5fd] rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Gangguan Tidur & Keluhan Fisik:</strong> Membantu mengatasi masalah tidur dan keluhan fisik yang berkaitan dengan stress</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#86efac] rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Gangguan Emosi & Afektif:</strong> Memahami dan mengelola emosi yang sulit</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#ddd6fe] rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Penurunan Motivasi & Aktivitas:</strong> Membangun kembali semangat dan minat</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#fde68a] rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Kecemasan:</strong> Teknik mengelola kekhawatiran dan kecemasan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#fbcfe8] rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Kepercayaan Diri & Penyesuaian Sosial:</strong> Membangun kembali rasa percaya diri dan hubungan sosial</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
