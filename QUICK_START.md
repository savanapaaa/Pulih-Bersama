# 🚀 Quick Start Guide - Pulih Bersama

Panduan cepat untuk menjalankan aplikasi Pulih Bersama (Frontend + Backend)

---

## ✅ Prerequisites

- ✅ Node.js 18+ installed
- ✅ PHP 8.1+ installed
- ✅ Composer installed
- ✅ MySQL/MariaDB installed

---

## 🎯 Step-by-Step Setup

### 📦 **BACKEND (Laravel)**

#### 1. Create Laravel Project
```bash
composer create-project laravel/laravel pulih-bersama-backend
cd pulih-bersama-backend
```

#### 2. Install Sanctum
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

#### 3. Setup .env
```env
DB_DATABASE=pulih_bersama
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

#### 4. Setup CORS (config/cors.php)
```php
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,
```

#### 5. Copy Files dari BACKEND_LARAVEL_SETUP.md
- Migrations (5 files)
- Models (5 files)
- Controllers (8 files)
- Routes (routes/api.php)
- Middleware (IsAdmin.php)
- Seeder (DatabaseSeeder.php)

#### 6. Run Migrations & Seeders
```bash
php artisan migrate
php artisan db:seed
```

#### 7. Start Laravel
```bash
php artisan serve
```
✅ Backend running di **http://localhost:8000**

---

### ⚛️ **FRONTEND (React)**

#### 1. Install Dependencies
```bash
cd "Pulih Bersama"
npm install
```

#### 2. Setup Environment
File `.env` sudah ada, pastikan isinya:
```env
VITE_API_URL=http://localhost:8000/api
```

#### 3. Start React
```bash
npm run dev
```
✅ Frontend running di **http://localhost:5173**

---

## 🔐 Test Login

### Admin
- Email: `admin@pulihbersama.com`
- Password: `admin123`

### User
- Email: `maya@example.com`
- Password: `password`

---

## ✨ Selesai!

Aplikasi sudah siap digunakan:

- 🌐 Frontend: http://localhost:5173
- 🔌 Backend: http://localhost:8000
- 📊 API Docs: http://localhost:8000/api

---

## 🐛 Troubleshooting

### CORS Error?
```bash
# Check config/cors.php
'allowed_origins' => ['http://localhost:5173'],
```

### Cannot Login?
```bash
# Re-run seeder
php artisan db:seed --force
```

### Port Already in Use?
```bash
# Laravel - change port
php artisan serve --port=8001

# Vite - change port in terminal
npm run dev -- --port 5174
```

---

## 📁 Project Structure

```
.
├── Pulih Bersama/              # Frontend React
│   ├── src/
│   │   ├── services/          # API calls
│   │   ├── app/               # Components & Pages
│   │   └── main.tsx
│   ├── .env                   # Frontend config
│   └── package.json
│
└── pulih-bersama-backend/     # Backend Laravel (folder terpisah)
    ├── app/
    │   ├── Models/
    │   ├── Http/Controllers/
    │   └── Http/Middleware/
    ├── database/
    │   ├── migrations/
    │   └── seeders/
    ├── routes/api.php
    └── .env                   # Backend config
```

---

## 🎓 Next Steps

1. ✅ Test semua fitur (login, diagnosis, CRUD)
2. ✅ Customize sesuai kebutuhan
3. ✅ Deploy ke production

**Happy Coding! 💙**
