# 💙 Pulih Bersama - Frontend

**Deteksi Dini dan Pemulihan Kesehatan Mental Anak Korban Perceraian**

Aplikasi web untuk membantu anak-anak korban perceraian memahami kondisi mental mereka melalui kuesioner terstruktur dan mendapatkan rekomendasi pemulihan yang personal.

---

## 🎯 Fitur Utama

### 👤 **Untuk User (Anak/Remaja)**
- 📝 Kuesioner diagnosis 5 kategori (40 pertanyaan)
- 📊 Hasil diagnosis dengan tingkat risiko (Ringan/Sedang/Tinggi)
- 💡 Rekomendasi pemulihan personal
- 📈 Riwayat diagnosis
- 👥 Manajemen profil

### 🛡️ **Untuk Admin**
- 📊 Dashboard dengan statistik
- 📰 CRUD Artikel kesehatan mental
- 🔍 CRUD Gejala/pertanyaan
- 💬 CRUD Rekomendasi
- 👥 Manajemen user & role
- 📋 Lihat semua hasil diagnosis

### 🌐 **Public**
- 🏠 Landing page informatif
- 📰 Baca artikel kesehatan mental
- 📖 About page
- 🔐 Login & Register

---

## 🛠️ Tech Stack

- **React 18.3.1** + **TypeScript**
- **Vite 6.3** - Build tool
- **Tailwind CSS 4.1** - Styling
- **shadcn/ui** - UI Components (Radix UI)
- **Material-UI** - Additional components
- **Axios** - API calls
- **React Hook Form** - Form handling
- **Sonner** - Toast notifications
- **Lucide React** - Icons

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Backend Laravel running (lihat [BACKEND_LARAVEL_SETUP.md](BACKEND_LARAVEL_SETUP.md))

### Steps

1. **Clone & Install**
```bash
cd "Pulih Bersama"
npm install
```

2. **Setup Environment**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000/api
VITE_PYTHON_API_URL=http://localhost:5000/api
```

3. **Run Development Server**
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

---

## 🚀 Quick Start

### 1. **Start Backend** (di folder terpisah)
```bash
cd pulih-bersama-backend
php artisan serve
# Running at http://localhost:8000
```

### 2. **Start Frontend** (di folder ini)
```bash
npm run dev
# Running at http://localhost:5173
```

### 3. **Login**
**Admin:**
- Email: `admin@pulihbersama.com`
- Password: `admin123`

**User:**
- Email: `maya@example.com`
- Password: `password`

---

## 📁 Project Structure

```
src/
├── main.tsx                    # Entry point
├── services/                   # API Services
│   ├── api.ts                 # Axios instance
│   ├── authService.ts         # Authentication
│   ├── diagnosisService.ts    # Diagnosis CRUD
│   ├── articleService.ts      # Articles CRUD
│   ├── symptomService.ts      # Symptoms CRUD
│   ├── recommendationService.ts
│   └── adminService.ts        # Admin operations
├── app/
│   ├── App.tsx                # Main routing & layout
│   ├── context/
│   │   └── AppContext.tsx     # Global state + API integration
│   ├── components/
│   │   ├── PublicNavbar.tsx
│   │   ├── UserSidebar.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   └── ui/                # shadcn/ui components
│   └── pages/
│       ├── HomePage.tsx
│       ├── AboutPage.tsx
│       ├── NewsPage.tsx
│       ├── NewsDetailPage.tsx
│       ├── LoginPage.tsx
│       ├── RegisterPage.tsx
│       ├── user/              # User pages
│       │   ├── UserDashboardPage.tsx
│       │   ├── DiagnosisPage.tsx
│       │   ├── DiagnosisResultPage.tsx
│       │   ├── HistoryPage.tsx
│       │   └── ProfilePage.tsx
│       └── admin/             # Admin pages
│           ├── AdminDashboardPage.tsx
│           ├── UserHistoryPage.tsx
│           ├── ArticleManagementPage.tsx
│           ├── SymptomManagementPage.tsx
│           ├── RecommendationManagementPage.tsx
│           └── UserManagementPage.tsx
└── styles/
    ├── index.css
    ├── fonts.css
    ├── tailwind.css
    └── theme.css
```

---

## 🔌 API Integration

Frontend terintegrasi dengan Laravel backend menggunakan **Axios** dan **Laravel Sanctum**.

### Authentication Flow:
1. User login → Receive token
2. Token disimpan di `localStorage`
3. Semua request include header: `Authorization: Bearer TOKEN`
4. Auto-logout jika 401 Unauthorized

### Data Loading:
- **On mount**: Load public data (articles, symptoms, recommendations)
- **After login**: Load user-specific data (diagnosis results, users list)
- **CRUD operations**: Auto-refresh state after success

Lihat detail di [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)

---

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production

# Preview production build
npm run preview      # Preview built app
```

---

## 🎨 Design System

### Colors
- Primary Blue: `#93c5fd` → `#ddd6fe` (gradient)
- Success Green: `#86efac`
- Warning Yellow: `#fde68a`
- Error Red: `#fca5a5`
- Pink: `#fbcfe8`

### Typography
- Font Family: System fonts (default)
- Headings: Bold, gradient text
- Body: Regular, gray-700

### Components
Menggunakan **shadcn/ui** untuk consistency:
- Button, Card, Input, Select, etc.
- All styled dengan Tailwind CSS
- Accessible (ARIA attributes)

---

## 🧪 Testing

### Manual Testing Checklist:

**Public:**
- [ ] Homepage loads
- [ ] View articles
- [ ] Register new user
- [ ] Login

**User:**
- [ ] Complete diagnosis questionnaire
- [ ] View diagnosis result
- [ ] Save diagnosis
- [ ] View history
- [ ] Update profile
- [ ] Logout

**Admin:**
- [ ] View dashboard stats
- [ ] CRUD articles
- [ ] CRUD symptoms
- [ ] CRUD recommendations
- [ ] Manage users
- [ ] View all diagnoses

---

## 🐛 Common Issues & Solutions

### 1. CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Check Laravel `config/cors.php` - ensure `localhost:5173` is allowed

### 2. 401 Unauthorized
```
Request failed with status code 401
```
**Solution:** 
- Check token: `localStorage.getItem('auth_token')`
- Re-login
- Check Sanctum configuration

### 3. Cannot Connect to API
```
Network Error
```
**Solution:**
- Ensure Laravel is running: `php artisan serve`
- Check `.env`: `VITE_API_URL=http://localhost:8000/api`
- Restart Vite: `npm run dev`

---

## 📚 Documentation

- [Backend Setup Guide](BACKEND_LARAVEL_SETUP.md) - Laravel backend installation
- [Frontend Integration](FRONTEND_INTEGRATION.md) - API integration details
- [Attributions](ATTRIBUTIONS.md) - Third-party libraries

---

## 🔧 Environment Variables

```env
# Backend API
VITE_API_URL=http://localhost:8000/api

# Python API (optional - for content-based filtering)
VITE_PYTHON_API_URL=http://localhost:5000/api
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output akan ada di folder `dist/`

### Deploy Options:
- **Vercel** (recommended for Vite)
- **Netlify**
- **GitHub Pages**
- **VPS** (nginx + serve static files)

**Important:** Set environment variables di hosting platform:
```
VITE_API_URL=https://your-backend-api.com/api
```

---

## 🤝 Contributing

Project ini dibuat untuk tugas akhir. Jika ingin berkontribusi:

1. Fork repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 📄 License

This project is for educational purposes.

---

## 👥 Team

Developed by Tim Pulih Bersama

---

## 🙏 Acknowledgments

- UI Components: [shadcn/ui](https://ui.shadcn.com/)
- Icons: [Lucide](https://lucide.dev/)
- Unsplash for placeholder images
- Mental health references dari berbagai sumber terpercaya

---

## 📞 Support

Jika ada pertanyaan atau issue:
1. Check documentation
2. Check browser console & network tab
3. Check Laravel logs
4. Create issue di repository

---

**Made with 💙 for children's mental health**

  