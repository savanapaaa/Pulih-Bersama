import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { useApp } from '../../context/AppContext';
import { Loader } from 'lucide-react';

interface DiagnosisPageProps {
  onNavigate: (page: string) => void;
  onComplete: (answers: Record<string, Record<string, string>>) => void;
}

const categoryConfigs = [
  {
    id: 'sleepAndPhysical',
    title: 'Gangguan Tidur & Keluhan Fisik',
    matchCategory: 'Gangguan Tidur & Keluhan Fisik',
    description: 'Pertanyaan tentang pola tidur dan kondisi fisikmu',
    color: '#93c5fd',
  },
  {
    id: 'emotional',
    title: 'Gangguan Emosi & Afektif',
    matchCategory: 'Gangguan Emosi & Afektif',
    description: 'Pertanyaan tentang perasaan dan emosimu',
    color: '#86efac',
  },
  {
    id: 'motivation',
    title: 'Penurunan Motivasi & Aktivitas',
    matchCategory: 'Penurunan Motivasi & Aktivitas',
    description: 'Pertanyaan tentang semangat dan aktivitasmu',
    color: '#ddd6fe',
  },
  {
    id: 'anxiety',
    title: 'Kecemasan',
    matchCategory: 'Kecemasan',
    description: 'Pertanyaan tentang rasa khawatir dan kecemasanmu',
    color: '#fde68a',
  },
  {
    id: 'selfConfidence',
    title: 'Kepercayaan Diri & Penyesuaian Sosial',
    matchCategory: 'Kepercayaan Diri & Penyesuaian Sosial',
    description: 'Pertanyaan tentang hubungan sosial dan kepercayaan dirimu',
    color: '#fbcfe8',
  },
] as const;

const scaleOptions = [
  { value: '0,0', label: 'Tidak Pernah' },
  { value: '0,25', label: 'Jarang' },
  { value: '0,5', label: 'Kadang-kadang' },
  { value: '0,75', label: 'Sering' },
  { value: '1,0', label: 'Selalu' },
];

export const DiagnosisPage: React.FC<DiagnosisPageProps> = ({ onNavigate, onComplete }) => {
  const { symptoms, loadSymptoms } = useApp();
  const [currentCategory, setCurrentCategory] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (symptoms.length === 0) {
      loadSymptoms();
    }
  }, [loadSymptoms, symptoms.length]);

  const categories = useMemo(() => {
    return categoryConfigs.map((cfg) => {
      const questions = symptoms
        .filter((s) => s.category === cfg.matchCategory)
        .slice()
        .sort((a, b) => String(a.code).localeCompare(String(b.code)))
        .map((s) => ({ key: String(s.code), text: String(s.text) }));

      return {
        ...cfg,
        questions,
      };
    });
  }, [symptoms]);

  const category = categories[currentCategory];
  const categoryAnswers = answers[category.id] || {};
  const answeredCount = Object.keys(categoryAnswers).length;
  const totalQuestions = category.questions.length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const isCurrentCategoryComplete = totalQuestions > 0 && answeredCount === totalQuestions;

  const hasAnySymptoms = symptoms.length > 0;

  const handleAnswer = (questionKey: string, value: string) => {
    setAnswers({
      ...answers,
      [category.id]: {
        ...categoryAnswers,
        [questionKey]: value,
      },
    });
  };

  const handleNext = async () => {
    if (currentCategory < categories.length - 1) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsLoading(false);
      setCurrentCategory(currentCategory + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last category - submit
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 animate-spin text-[#93c5fd] mx-auto" />
          <p className="text-gray-600">
            {currentCategory === categories.length - 1 
              ? 'Sedang memproses jawaban kamu...'
              : 'Memuat kategori selanjutnya...'
            }
          </p>
          <p className="text-sm text-gray-500">Tetap semangat! 💙</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div 
          className="inline-block px-4 py-2 rounded-full text-sm"
          style={{ backgroundColor: `${category.color}20`, color: category.color }}
        >
          Kategori {currentCategory + 1} dari {categories.length}
        </div>
        <h1 className="text-3xl font-bold text-gray-800">{category.title}</h1>
        <p className="text-gray-600">{category.description}</p>
        
        {/* Progress */}
        <div className="max-w-md mx-auto space-y-2">
          <Progress value={progress} className="h-2" style={{ 
            backgroundColor: `${category.color}20`,
          }} />
          <p className="text-sm text-gray-500">
            {answeredCount} dari {totalQuestions} pertanyaan terjawab
          </p>
        </div>
      </div>

      {/* Encouragement Message */}
      <Card className="border-2 bg-gradient-to-br from-[#93c5fd]/5 to-[#ddd6fe]/5">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">
            💙 <em>Jawablah dengan jujur sesuai perasaanmu. Tidak ada jawaban yang benar atau salah.</em>
          </p>
        </CardContent>
      </Card>

      {!hasAnySymptoms && (
        <Card className="border-2">
          <CardContent className="p-6 text-center">
            <p className="text-gray-700">
              Data gejala belum tersedia. Silakan pastikan Admin sudah mengisi <strong>Manajemen Gejala</strong>.
            </p>
            <div className="pt-4">
              <Button variant="outline" className="border-2" onClick={() => loadSymptoms()}>
                Muat Ulang Gejala
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {category.questions.map((question, index) => (
          <Card
            key={question.key}
            className="border-2 transition-all"
            style={categoryAnswers[question.key] ? { borderColor: category.color } : undefined}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ backgroundColor: category.color, color: 'white' }}
                >
                  {index + 1}
                </div>
                <div className="flex-1 space-y-4">
                  <p className="text-gray-800">{question.text}</p>
                  <RadioGroup
                    value={categoryAnswers[question.key] || ''}
                    onValueChange={(value) => handleAnswer(question.key, value)}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {scaleOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`q${question.key}-${option.value}`} />
                          <Label 
                            htmlFor={`q${question.key}-${option.value}`}
                            className="cursor-pointer text-sm"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentCategory === 0}
          className="border-2"
        >
          ← Sebelumnya
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!isCurrentCategoryComplete}
          className="bg-gradient-to-r from-[#93c5fd] to-[#ddd6fe] text-[#1e3a8a] hover:opacity-90"
          style={{ backgroundColor: isCurrentCategoryComplete ? undefined : '#e5e7eb' }}
        >
          {currentCategory === categories.length - 1 ? 'Kirim' : 'Lanjut'} →
        </Button>
      </div>

      {!isCurrentCategoryComplete && (
        <p className="text-center text-sm text-gray-500">
          Jawab semua pertanyaan untuk melanjutkan
        </p>
      )}
    </div>
  );
};
