import React from 'react';
import { Heart, UserPlus, LogIn, FileText, BarChart, Lightbulb, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { articles } = useApp();
  const previewArticles = articles.slice(0, 3);

  const steps = [
    {
      icon: UserPlus,
      title: 'Daftar',
      description: 'Buat akun dengan mudah dan aman',
      color: '#93c5fd',
    },
    {
      icon: LogIn,
      title: 'Login',
      description: 'Masuk ke dalam sistem',
      color: '#86efac',
    },
    {
      icon: FileText,
      title: 'Isi Kuesioner',
      description: 'Jawab pertanyaan dengan jujur',
      color: '#ddd6fe',
    },
    {
      icon: BarChart,
      title: 'Lihat Hasil',
      description: 'Dapatkan hasil diagnosis',
      color: '#fde68a',
    },
    {
      icon: Lightbulb,
      title: 'Rekomendasi',
      description: 'Terima panduan pemulihan',
      color: '#fbcfe8',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#93c5fd]/20 via-[#ddd6fe]/20 to-[#86efac]/20 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#93c5fd] to-[#ddd6fe] rounded-full shadow-lg mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#1e3a8a] to-[#5b21b6] bg-clip-text text-transparent leading-tight">
            Pulih Bersama
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Deteksi Dini dan Pemulihan Kesehatan Mental Anak Korban Perceraian
          </p>
          
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Kami memahami bahwa perceraian orang tua adalah momen yang tidak mudah. 
            Pulih Bersama hadir sebagai teman yang akan membantu kamu memahami perasaanmu 
            dan menemukan jalan menuju pemulihan yang lebih baik. 💙
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => onNavigate('login')}
              className="bg-gradient-to-r from-[#93c5fd] to-[#ddd6fe] text-[#1e3a8a] hover:opacity-90 shadow-lg text-lg px-8 py-6"
            >
              Mulai Tes Kesehatan Mental
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('register')}
              className="border-2 border-[#93c5fd] text-[#1e3a8a] hover:bg-[#93c5fd]/10 text-lg px-8 py-6"
            >
              Daftar Sekarang
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Bagaimana Cara Kerjanya?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lima langkah mudah untuk memahami kondisi kesehatan mentalmu
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="relative border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: step.color }}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-800">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Preview */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#93c5fd]/5 to-[#ddd6fe]/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Artikel & Berita
            </h2>
            <p className="text-gray-600">
              Baca artikel terbaru tentang kesehatan mental dan pemulihan emosional
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {previewArticles.map(article => (
              <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <div className="text-xs text-[#93c5fd] font-medium">{article.category}</div>
                  <h3 className="font-semibold text-gray-800 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{article.summary}</p>
                  <Button
                    variant="ghost"
                    onClick={() => onNavigate(`news-detail-${article.id}`)}
                    className="text-[#1e3a8a] hover:text-[#93c5fd] p-0 h-auto"
                  >
                    Selengkapnya →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => onNavigate('news')}
              className="border-[#93c5fd] text-[#1e3a8a] hover:bg-[#93c5fd]/10"
            >
              Lihat Semua Artikel
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#93c5fd] to-[#ddd6fe]">
        <div className="max-w-4xl mx-auto text-center space-y-6 text-white">
          <h2 className="text-3xl md:text-4xl font-bold">
            Siap Memulai Perjalanan Pemulihanmu?
          </h2>
          <p className="text-lg opacity-90">
            Langkah pertama adalah yang terpenting. Kami di sini untuk menemanimu. 🌟
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate('register')}
            className="bg-white text-[#1e3a8a] hover:bg-gray-100 shadow-lg text-lg px-8 py-6"
          >
            Daftar Gratis Sekarang
          </Button>
        </div>
      </section>
    </div>
  );
};
