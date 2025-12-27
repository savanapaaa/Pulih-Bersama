import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { AppProvider, useApp, DiagnosisResult } from "./context/AppContext";
import { Toaster } from "./components/ui/sonner";

// Public components
import { PublicNavbar } from "./components/PublicNavbar";
import { Footer } from "./components/Footer";

// Public pages
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { NewsPage } from "./pages/NewsPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

// User components
import { UserSidebar } from "./components/UserSidebar";
import { UserDashboardPage } from "./pages/user/UserDashboardPage";
import { DiagnosisPage } from "./pages/user/DiagnosisPage";
import { DiagnosisResultPage } from "./pages/user/DiagnosisResultPage";
import { HistoryPage } from "./pages/user/HistoryPage";
import { ProfilePage } from "./pages/user/ProfilePage";

// Admin components
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { UserHistoryPage } from "./pages/admin/UserHistoryPage";
import { ArticleManagementPage } from "./pages/admin/ArticleManagementPage";
import { SymptomManagementPage } from "./pages/admin/SymptomManagementPage";
import { RecommendationManagementPage } from "./pages/admin/RecommendationManagementPage";
import { UserManagementPage } from "./pages/admin/UserManagementPage";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: 'user' | 'admin' }> = ({ children, allowedRole }) => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

// Public Routes Layout
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

// User Dashboard Layout
const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#93c5fd]/5 to-[#ddd6fe]/5">
      <UserSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

// Admin Dashboard Layout
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#93c5fd]/5 to-[#ddd6fe]/5">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, saveDiagnosisResult, symptoms } = useApp();
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const navigate = useNavigate();

  const onNavigate = (page: string) => {
    if (page.startsWith("news-detail-")) {
      const id = page.replace("news-detail-", "");
      navigate(`/news/${id}`);
      return;
    }

    switch (page) {
      case "home":
        navigate("/");
        break;
      case "about":
        navigate("/about");
        break;
      case "news":
        navigate("/news");
        break;
      case "login":
        navigate("/login");
        break;
      case "register":
        navigate("/register");
        break;
      case "user-dashboard":
        navigate("/dashboard");
        break;
      case "diagnosis":
        navigate("/diagnosis");
        break;
      case "diagnosis-result":
        navigate("/diagnosis/result");
        break;
      case "history":
        navigate("/history");
        break;
      case "profile":
        navigate("/profile");
        break;
      case "admin-dashboard":
        navigate("/admin");
        break;
      case "admin-user-history":
        navigate("/admin/user-history");
        break;
      case "admin-articles":
        navigate("/admin/articles");
        break;
      case "admin-symptoms":
        navigate("/admin/symptoms");
        break;
      case "admin-recommendations":
        navigate("/admin/recommendations");
        break;
      case "admin-users":
        navigate("/admin/users");
        break;
      default:
        navigate("/");
        break;
    }
  };

  const NewsDetailRoute: React.FC = () => {
    const params = useParams();
    const id = params.id;
    if (!id) return <Navigate to="/news" replace />;
    return <NewsDetailPage articleId={id} onNavigate={onNavigate} />;
  };

  // Calculate diagnosis result from answers
  const calculateDiagnosisResult = (
    answers: Record<string, Record<string, string>>,
  ): DiagnosisResult => {
    const toNumber = (raw: string): number => {
      if (typeof raw !== 'string') return 0;
      // Support Indonesian decimal comma (e.g. "0,25")
      const normalized = raw.replace(',', '.');
      const parsed = Number.parseFloat(normalized);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

    const getExpertWeight = (code: string): number => {
      const found = symptoms.find((s) => String(s.code) === String(code));
      return clamp01(Number(found?.weight ?? 0));
    };

    // Certainty Factor combine (all CF assumed positive)
    // CFcombine = CF1 + CF2 * (1 - CF1)
    const combineCF = (cfValues: number[]): number => {
      return cfValues.reduce((acc, cf) => acc + cf * (1 - acc), 0);
    };

    const cfToRisk = (cf: number): "Ringan" | "Sedang" | "Tinggi" => {
      // Thresholds for CF 0..1
      if (cf < 0.34) return "Ringan";
      if (cf < 0.67) return "Sedang";
      return "Tinggi";
    };

    const calculateCategoryCF = (categoryAnswers: Record<string, string>): number => {
      const cfValues = Object.entries(categoryAnswers).map(([code, value]) => {
        const userCF = clamp01(toNumber(value));
        const expertCF = getExpertWeight(code);
        return clamp01(userCF * expertCF);
      });

      return clamp01(combineCF(cfValues));
    };

    const categoryScores = {
      sleepAndPhysical: calculateCategoryCF(answers.sleepAndPhysical || {}),
      emotional: calculateCategoryCF(answers.emotional || {}),
      motivation: calculateCategoryCF(answers.motivation || {}),
      anxiety: calculateCategoryCF(answers.anxiety || {}),
      selfConfidence: calculateCategoryCF(answers.selfConfidence || {}),
    };

    const categories = {
      sleepAndPhysical: cfToRisk(categoryScores.sleepAndPhysical),
      emotional: cfToRisk(categoryScores.emotional),
      motivation: cfToRisk(categoryScores.motivation),
      anxiety: cfToRisk(categoryScores.anxiety),
      selfConfidence: cfToRisk(categoryScores.selfConfidence),
    };

    // Find dominant category
    const categoryLabels = {
      sleepAndPhysical: "Gangguan Tidur & Keluhan Fisik",
      emotional: "Gangguan Emosi & Afektif",
      motivation: "Penurunan Motivasi & Aktivitas",
      anxiety: "Kecemasan",
      selfConfidence: "Kepercayaan Diri & Penyesuaian Sosial",
    };

    let maxScore = -1;
    let dominantCategory = "";

    (Object.keys(categoryScores) as Array<keyof typeof categoryScores>).forEach((key) => {
      const score = categoryScores[key];
      if (score > maxScore) {
        maxScore = score;
        dominantCategory = categoryLabels[key as keyof typeof categoryLabels];
      }
    });

    // Calculate overall risk
    const riskCounts = { Ringan: 0, Sedang: 0, Tinggi: 0 };
    Object.values(categories).forEach((risk) => riskCounts[risk]++);

    let overallRisk: "Ringan" | "Sedang" | "Tinggi" = "Ringan";
    if (riskCounts.Tinggi >= 2) overallRisk = "Tinggi";
    else if (riskCounts.Tinggi >= 1 || riskCounts.Sedang >= 3) overallRisk = "Sedang";

    // Generate recommendations based on dominant category
    const recommendations: Record<string, string[]> = {
      "Gangguan Tidur & Keluhan Fisik": [
        "Buat rutinitas tidur yang konsisten setiap hari",
        "Hindari penggunaan gadget 1 jam sebelum tidur",
        "Coba teknik relaksasi seperti pernapasan dalam",
        "Konsultasikan dengan dokter jika keluhan fisik berlanjut",
      ],
      "Gangguan Emosi & Afektif": [
        "Luangkan waktu untuk journaling atau menulis perasaan",
        "Berbicara dengan orang yang kamu percaya tentang perasaanmu",
        "Coba aktivitas yang menenangkan seperti menggambar atau musik",
        "Pertimbangkan konseling dengan psikolog anak",
      ],
      "Penurunan Motivasi & Aktivitas": [
        "Mulai dengan target kecil yang mudah dicapai",
        "Buat jadwal harian yang terstruktur",
        "Cari aktivitas baru yang menarik minatmu",
        "Rayakan setiap pencapaian kecil",
      ],
      Kecemasan: [
        "Praktikkan teknik grounding saat merasa cemas",
        "Olahraga ringan atau yoga untuk mengurangi ketegangan",
        "Batasi paparan berita atau informasi yang memicu kecemasan",
        "Belajar teknik mindfulness untuk anak",
      ],
      "Kepercayaan Diri & Penyesuaian Sosial": [
        "Ingat bahwa perceraian bukan salahmu",
        "Bergabung dengan kelompok atau kegiatan ekstrakurikuler",
        "Latih self-compassion dan self-talk yang positif",
        "Pertimbangkan bergabung dengan support group",
      ],
    };

    return {
      id: Date.now().toString(),
      userId: currentUser?.id || "",
      date: new Date().toISOString().split("T")[0],
      categories,
      cfScores: categoryScores,
      dominantCategory,
      overallRisk,
      recommendations: recommendations[dominantCategory] || [],
      raw_answers: answers,
    };
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><HomePage onNavigate={onNavigate} /></PublicLayout>} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/news" element={<PublicLayout><NewsPage onNavigate={onNavigate} /></PublicLayout>} />
      <Route path="/news/:id" element={<PublicLayout><NewsDetailRoute /></PublicLayout>} />
      <Route path="/login" element={currentUser ? <Navigate to={currentUser.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <PublicLayout><LoginPage onNavigate={onNavigate} /></PublicLayout>} />
      <Route path="/register" element={currentUser ? <Navigate to="/dashboard" replace /> : <PublicLayout><RegisterPage onNavigate={onNavigate} /></PublicLayout>} />

      {/* User Routes */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRole="user"><UserLayout><UserDashboardPage onNavigate={onNavigate} /></UserLayout></ProtectedRoute>} />
      <Route path="/diagnosis" element={<ProtectedRoute allowedRole="user"><UserLayout><DiagnosisPage onNavigate={onNavigate} onComplete={(answers) => { setDiagnosisResult(calculateDiagnosisResult(answers)); navigate('/diagnosis/result'); }} /></UserLayout></ProtectedRoute>} />
      <Route path="/diagnosis/result" element={<ProtectedRoute allowedRole="user"><UserLayout>{diagnosisResult ? (
        <DiagnosisResultPage
          result={diagnosisResult}
          onSave={async () => {
            await saveDiagnosisResult(diagnosisResult);
            setDiagnosisResult(null);
            navigate('/history');
          }}
          onNavigate={onNavigate}
        />
      ) : (
        <Navigate to="/diagnosis" replace />
      )}</UserLayout></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute allowedRole="user"><UserLayout><HistoryPage onNavigate={onNavigate} /></UserLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRole="user"><UserLayout><ProfilePage /></UserLayout></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminLayout><AdminDashboardPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><AdminLayout><UserManagementPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/user-history" element={<ProtectedRoute allowedRole="admin"><AdminLayout><UserHistoryPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/articles" element={<ProtectedRoute allowedRole="admin"><AdminLayout><ArticleManagementPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/symptoms" element={<ProtectedRoute allowedRole="admin"><AdminLayout><SymptomManagementPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/recommendations" element={<ProtectedRoute allowedRole="admin"><AdminLayout><RecommendationManagementPage /></AdminLayout></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AppProvider>
  );
};

export default App;
