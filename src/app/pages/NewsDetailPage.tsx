import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';

interface NewsDetailPageProps {
  articleId: string;
  onNavigate: (page: string) => void;
}

export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ articleId, onNavigate }) => {
  const { articles } = useApp();
  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#93c5fd]/5 to-[#ddd6fe]/5 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardContent className="p-16 text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Artikel Tidak Ditemukan</h3>
              <p className="text-gray-500">Artikel yang Anda cari tidak tersedia.</p>
              <Button onClick={() => onNavigate('news')} variant="outline">
                Kembali ke Daftar Artikel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#93c5fd]/5 to-[#ddd6fe]/5 py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('news')}
          className="text-[#1e3a8a] hover:text-[#93c5fd]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Artikel
        </Button>

        <Card className="border-2 overflow-hidden">
          <div className="aspect-[21/9] overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <CardContent className="p-8 md:p-12 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(article.date).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="px-3 py-1 bg-[#93c5fd]/20 text-[#1e3a8a] rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                {article.title}
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-[#93c5fd] pl-4">
                {article.summary}
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed space-y-4">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Artikel Lainnya</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {articles
              .filter(a => a.id !== article.id)
              .slice(0, 2)
              .map(relatedArticle => (
                <Card key={relatedArticle.id} className="overflow-hidden hover:shadow-lg transition-shadow group border-2">
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <div className="inline-block px-3 py-1 bg-[#93c5fd]/20 text-[#1e3a8a] text-xs rounded-full">
                      {relatedArticle.category}
                    </div>
                    <h4 className="font-semibold text-gray-800 line-clamp-2">
                      {relatedArticle.title}
                    </h4>
                    <Button
                      variant="ghost"
                      onClick={() => onNavigate(`news-detail-${relatedArticle.id}`)}
                      className="text-[#1e3a8a] hover:text-[#93c5fd] p-0 h-auto"
                    >
                      Baca Selengkapnya →
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
