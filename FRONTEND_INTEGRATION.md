# 🔌 Frontend Integration Guide

Dokumentasi integrasi Frontend React dengan Backend Laravel

---

## ✅ Yang Sudah Dikonfigurasi

### 1. **Dependencies**
- ✅ Axios installed (`npm install axios`)

### 2. **Environment Variables**
File `.env` sudah dibuat dengan:
```env
VITE_API_URL=http://localhost:8000/api
VITE_PYTHON_API_URL=http://localhost:5000/api
```

### 3. **API Services** (`src/services/`)
- ✅ `api.ts` - Axios instance dengan interceptors
- ✅ `authService.ts` - Login, register, logout, update profile
- ✅ `diagnosisService.ts` - Diagnosis CRUD
- ✅ `articleService.ts` - Articles CRUD
- ✅ `symptomService.ts` - Symptoms CRUD
- ✅ `recommendationService.ts` - Recommendations CRUD
- ✅ `adminService.ts` - Admin functions (users, all diagnosis)

### 4. **AppContext Updated**
- ✅ Semua function sudah async
- ✅ Menggunakan API services
- ✅ Auto-load data dari API saat login
- ✅ Token management dengan localStorage
- ✅ Auto-redirect jika unauthorized (401)

---

## 🚀 Cara Menjalankan

### 1. **Start Backend Laravel**
```bash
cd pulih-bersama-backend
php artisan serve
# Berjalan di http://localhost:8000
```

### 2. **Start Frontend React**
```bash
cd "Pulih Bersama"
npm run dev
# Berjalan di http://localhost:5173
```

### 3. **Pastikan Backend Sudah Setup**
- ✅ Database sudah di-migrate
- ✅ Seeder sudah dijalankan
- ✅ CORS sudah dikonfigurasi
- ✅ Sanctum sudah ter-install

---

## 🔐 Cara Kerja Authentication

### Login Flow:
1. User input email & password
2. Frontend call `authService.login()`
3. Laravel return `{ user, token }`
4. Token disimpan di `localStorage.setItem('auth_token', token)`
5. User disimpan di `localStorage.setItem('current_user', JSON.stringify(user))`
6. Semua request berikutnya include header: `Authorization: Bearer TOKEN`

### Logout Flow:
1. User klik logout
2. Frontend call `authService.logout()`
3. Laravel invalidate token
4. Frontend hapus token & user dari localStorage
5. Redirect ke home page

### Auto-login (Refresh):
1. Saat app load, check `localStorage` untuk token & user
2. Jika ada, set currentUser state
3. Load data sesuai role (user = diagnosis, admin = all users)

---

## 📡 API Calls dari Components

Semua API calls sudah terintegrasi di `AppContext.tsx`. Component hanya perlu call function dari context:

### Example: Login Page
```tsx
const { login } = useApp();

const handleSubmit = async (e) => {
  e.preventDefault();
  const success = await login(email, password);
  if (success) {
    // Navigation handled by App.tsx based on user role
    toast.success('Login berhasil!');
  } else {
    setError('Email atau password salah');
  }
};
```

### Example: Save Diagnosis
```tsx
const { saveDiagnosisResult } = useApp();

const handleSave = async () => {
  try {
    await saveDiagnosisResult(diagnosisResult);
    toast.success('Hasil diagnosis berhasil disimpan!');
    onNavigate('user-dashboard');
  } catch (error) {
    toast.error('Gagal menyimpan diagnosis');
  }
};
```

### Example: Admin CRUD Article
```tsx
const { addArticle, updateArticle, deleteArticle } = useApp();

// Create
const handleCreate = async (article) => {
  try {
    await addArticle(article);
    toast.success('Artikel berhasil ditambahkan!');
  } catch (error) {
    toast.error('Gagal menambahkan artikel');
  }
};

// Update
const handleUpdate = async (id, data) => {
  try {
    await updateArticle(id, data);
    toast.success('Artikel berhasil diupdate!');
  } catch (error) {
    toast.error('Gagal update artikel');
  }
};

// Delete
const handleDelete = async (id) => {
  try {
    await deleteArticle(id);
    toast.success('Artikel berhasil dihapus!');
  } catch (error) {
    toast.error('Gagal menghapus artikel');
  }
};
```

---

## 🐛 Troubleshooting

### 1. **CORS Error**
**Error:** `Access-Control-Allow-Origin`

**Solution:**
- Check Laravel `config/cors.php`
- Pastikan `allowed_origins` include `http://localhost:5173`
- Restart Laravel server

### 2. **401 Unauthorized**
**Error:** Request return 401 setelah login

**Solution:**
- Check token tersimpan: `localStorage.getItem('auth_token')`
- Check Sanctum configuration di Laravel
- Pastikan `SANCTUM_STATEFUL_DOMAINS` include `localhost:5173`

### 3. **Network Error / Connection Refused**
**Error:** Cannot connect to API

**Solution:**
- Pastikan Laravel running di `http://localhost:8000`
- Check `.env` file: `VITE_API_URL=http://localhost:8000/api`
- Restart Vite dev server: `npm run dev`

### 4. **Data Tidak Muncul**
**Symptom:** Halaman kosong, tidak ada data

**Solution:**
- Check browser console untuk error
- Check Laravel logs: `storage/logs/laravel.log`
- Pastikan seeder sudah dijalankan: `php artisan db:seed`
- Check network tab di browser DevTools

---

## 🔄 Data Flow

### User Registration:
```
RegisterPage -> authService.register() -> POST /api/register 
-> Laravel create user -> Return { user, token } 
-> Save to localStorage -> Navigate to dashboard
```

### User Login:
```
LoginPage -> authService.login() -> POST /api/login 
-> Laravel validate -> Return { user, token } 
-> Save to localStorage -> Load user data -> Navigate based on role
```

### Diagnosis Submission:
```
DiagnosisPage -> Calculate result -> DiagnosisResultPage 
-> User click Save -> diagnosisService.create() 
-> POST /api/diagnosis -> Laravel save to DB 
-> Return saved result -> Add to state -> Navigate to dashboard
```

### Admin Create Article:
```
ArticleManagementPage -> Admin input data -> Submit 
-> articleService.create() -> POST /api/admin/articles 
-> Laravel validate & save -> Return article 
-> Add to articles state -> Refresh UI
```

---

## 📋 Testing Checklist

### Public Features:
- [ ] Homepage loading
- [ ] View articles list
- [ ] View single article
- [ ] Register new account
- [ ] Login

### User Features:
- [ ] User dashboard
- [ ] Fill diagnosis questionnaire
- [ ] View diagnosis result
- [ ] Save diagnosis
- [ ] View history
- [ ] Update profile
- [ ] Change password
- [ ] Logout

### Admin Features:
- [ ] Admin dashboard with stats
- [ ] View all users
- [ ] View all diagnosis results
- [ ] Create article
- [ ] Update article
- [ ] Delete article
- [ ] CRUD symptoms
- [ ] CRUD recommendations
- [ ] Update user role
- [ ] Logout

---

## 🎯 Next Steps (Optional Enhancements)

1. **Loading States**
   - Add loading spinner saat fetch data
   - Gunakan `isLoading` state dari AppContext

2. **Error Handling**
   - Tampilkan error message yang lebih informatif
   - Retry mechanism untuk failed requests

3. **Pagination**
   - Implement pagination untuk articles & diagnosis list
   - Limit data yang di-load sekaligus

4. **Image Upload**
   - Integrate dengan Laravel storage
   - Upload gambar artikel via form

5. **Search & Filter**
   - Search articles by title/category
   - Filter diagnosis by date/risk level

6. **Export Features**
   - Export diagnosis result to PDF
   - Download report

7. **Real-time Notifications**
   - WebSocket untuk notifikasi real-time
   - New article notification untuk users

---

## 📞 Support

Jika ada masalah:
1. Check browser console untuk JavaScript errors
2. Check network tab untuk API errors
3. Check Laravel logs: `storage/logs/laravel.log`
4. Pastikan .env configuration benar

---

## ✨ Summary

Frontend React sekarang sudah **fully integrated** dengan Backend Laravel:

✅ Authentication dengan Sanctum tokens
✅ All CRUD operations via API
✅ Auto-load data dari API
✅ Persistent login dengan localStorage
✅ Error handling & token management
✅ Role-based access (user vs admin)

**Siap untuk testing dan development!** 🚀
