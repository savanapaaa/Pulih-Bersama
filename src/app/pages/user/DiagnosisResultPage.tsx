import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { DiagnosisResult, useApp } from '../../context/AppContext';
import { CircleCheck, TrendingUp, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface DiagnosisResultPageProps {
  result: DiagnosisResult;
  onSave: () => void;
  onNavigate: (page: string) => void;
}

export const DiagnosisResultPage: React.FC<DiagnosisResultPageProps> = ({ result, onSave, onNavigate }) => {
  const { recommendations: adminRecommendations } = useApp();

  const toPercentLabel = (cf?: number) => {
    if (cf === undefined || cf === null || !Number.isFinite(cf)) return '';
    const percent = Math.round(Math.max(0, Math.min(1, cf)) * 100);
    return `${percent}%`;
  };

  const normalizeText = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');

  const getSafeUrl = (raw: string): string | null => {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const matchedAdminRecommendations = adminRecommendations
    .filter((r) => normalizeText(r.category) === normalizeText(result.dominantCategory))
    .slice(0, 6);

  const overallPercent = result.cfScores
    ? Math.round(
        Math.max(
          result.cfScores.sleepAndPhysical,
          result.cfScores.emotional,
          result.cfScores.motivation,
          result.cfScores.anxiety,
          result.cfScores.selfConfidence
        ) * 100
      )
    : null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Ringan':
        return { bg: 'bg-[#86efac]', text: 'text-[#166534]', border: 'border-[#86efac]' };
      case 'Sedang':
        return { bg: 'bg-[#fde68a]', text: 'text-[#854d0e]', border: 'border-[#fde68a]' };
      case 'Tinggi':
        return { bg: 'bg-[#fca5a5]', text: 'text-[#991b1b]', border: 'border-[#fca5a5]' };
      default:
        return { bg: 'bg-gray-200', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  const categories = [
    { key: 'sleepAndPhysical', label: 'Gangguan Tidur & Keluhan Fisik', color: '#93c5fd' },
    { key: 'emotional', label: 'Gangguan Emosi & Afektif', color: '#86efac' },
    { key: 'motivation', label: 'Penurunan Motivasi & Aktivitas', color: '#ddd6fe' },
    { key: 'anxiety', label: 'Kecemasan', color: '#fde68a' },
    { key: 'selfConfidence', label: 'Kepercayaan Diri & Penyesuaian Sosial', color: '#fbcfe8' },
  ];

  const overallColor = getRiskColor(result.overallRisk);

  const handleSave = () => {
    onSave();
    toast.success('Hasil diagnosis berhasil disimpan! 💾');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#93c5fd] to-[#ddd6fe] rounded-full">
          <CircleCheck className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Hasil Diagnosis</h1>
        <p className="text-gray-600">
          Terima kasih telah menyelesaikan kuesioner. Berikut adalah hasil analisis kami.
        </p>
      </div>

      {/* Overall Result */}
      <Card className={`border-4 ${overallColor.border}`}>
        <CardContent className="p-8 text-center space-y-4">
          <div className={`inline-block px-6 py-3 rounded-full text-xl ${overallColor.bg} ${overallColor.text}`}>
            Tingkat Risiko: <strong>{result.overallRisk}</strong>
            {overallPercent !== null ? <span className="ml-2">({overallPercent}%)</span> : null}
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {result.overallRisk === 'Ringan' && 
              'Kondisi mentalmu secara umum cukup baik. Tetap jaga kesehatan mentalmu dengan aktivitas positif.'}
            {result.overallRisk === 'Sedang' && 
              'Kamu mungkin mengalami beberapa tantangan. Pertimbangkan untuk berbicara dengan orang tua atau konselor.'}
            {result.overallRisk === 'Tinggi' && 
              'Kami menyarankan untuk segera berbicara dengan orang dewasa yang kamu percaya atau profesional kesehatan mental.'}
          </p>
        </CardContent>
      </Card>

      {/* Category Results */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Hasil per Kategori</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => {
            const categoryResult = result.categories[category.key as keyof typeof result.categories];
            const colors = getRiskColor(categoryResult);
            const isDominant = result.dominantCategory === category.label;
            const categoryCF = result.cfScores?.[category.key as keyof NonNullable<typeof result.cfScores>];
            const percentLabel = toPercentLabel(categoryCF);

            return (
              <Card 
                key={category.key} 
                className={`border-2 ${isDominant ? 'ring-2 ring-[#93c5fd] ring-offset-2' : ''}`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{category.label}</h3>
                      {isDominant && (
                        <div className="inline-block px-2 py-1 bg-[#93c5fd]/20 text-[#1e3a8a] text-xs rounded">
                          Kategori Dominan
                        </div>
                      )}
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                  <div className={`inline-block px-4 py-2 rounded-lg ${colors.bg} ${colors.text}`}>
                    {categoryResult}{percentLabel ? <span className="ml-2">({percentLabel})</span> : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Dominant Category Highlight */}
      <Card className="border-2 bg-gradient-to-br from-[#93c5fd]/10 to-[#ddd6fe]/10">
        <CardContent className="p-8 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-[#1e3a8a]" />
            <h3 className="text-xl font-semibold text-gray-800">Area yang Perlu Perhatian</h3>
          </div>
          <p className="text-gray-700">
            Kategori <strong>{result.dominantCategory}</strong> menunjukkan tingkat yang paling tinggi. 
            Kami merekomendasikan untuk lebih fokus pada area ini.
          </p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-2">
        <CardContent className="p-8 space-y-6">
          <h3 className="text-2xl font-semibold text-gray-800">Rekomendasi untuk Kamu</h3>

          {matchedAdminRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedAdminRecommendations.map((rec) => {
                const safeUrl = getSafeUrl(rec.link);
                const typeBadgeClass =
                  rec.type === 'Video'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700';

                return (
                  <Card key={rec.id} className="border-2 overflow-hidden">
                    <div className="h-20 bg-gray-900" />
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`px-2 py-1 rounded text-xs ${typeBadgeClass}`}>{rec.type}</span>
                      </div>
                      <p className="text-sm text-gray-800 font-medium line-clamp-3">{rec.title}</p>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-[#93c5fd] text-[#1e3a8a] hover:bg-[#93c5fd]/10"
                        disabled={!safeUrl}
                        onClick={() => {
                          if (!safeUrl) return;
                          window.open(safeUrl, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        Buka {rec.type === 'Video' ? 'Video' : 'Artikel'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {result.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-[#93c5fd] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 flex-1">{recommendation}</p>
                </div>
              ))}
            </div>
          )}

          <Card className="bg-gradient-to-r from-[#fde68a]/20 to-[#fca5a5]/20 border-2 border-[#fde68a]">
            <CardContent className="p-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>⚠️ Catatan Penting:</strong> Hasil ini adalah skrining awal dan bukan diagnosis medis. 
                Jika kamu merasa membutuhkan bantuan lebih lanjut, jangan ragu untuk menghubungi:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-700">
                <li>• Hotline Kesehatan Mental: <strong>119 ext. 8</strong> (24 jam)</li>
                <li>• Konselor sekolah atau guru yang kamu percaya</li>
                <li>• Orang tua, wali, atau anggota keluarga dewasa</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button
          variant="outline"
          onClick={() => onNavigate('user-dashboard')}
          className="border-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Button>
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-[#93c5fd] to-[#ddd6fe] text-[#1e3a8a] hover:opacity-90"
        >
          <Save className="w-4 h-4 mr-2" />
          Simpan ke Riwayat
        </Button>
      </div>

      {/* Encouragement */}
      <Card className="border-2 bg-gradient-to-br from-[#86efac]/10 to-[#93c5fd]/10">
        <CardContent className="p-8 text-center space-y-2">
          <p className="text-gray-700 text-lg">
            💙 Kamu sudah melakukan langkah yang berani dengan memahami kondisimu.
          </p>
          <p className="text-gray-600">
            Ingat, pemulihan adalah perjalanan, bukan tujuan. Kami akan selalu di sini untuk menemanimu. ✨
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
