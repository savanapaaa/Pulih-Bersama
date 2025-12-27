# 🚀 Backend Laravel - Pulih Bersama

Dokumentasi lengkap untuk setup backend Laravel aplikasi Pulih Bersama.

---

## 📋 Table of Contents
1. [Setup Awal](#setup-awal)
2. [Database Migrations](#database-migrations)
3. [Models](#models)
4. [Controllers](#controllers)
5. [Routes](#routes)
6. [Middleware](#middleware)
7. [Seeders](#seeders)
8. [Integration dengan Python API](#integration-python-api)
9. [Frontend Integration](#frontend-integration)

---

## 🔧 Setup Awal

### 1. Install Laravel
```bash
composer create-project laravel/laravel pulih-bersama-backend
cd pulih-bersama-backend
```

### 2. Install Dependencies
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 3. Setup Environment (.env)
```env
APP_NAME="Pulih Bersama API"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pulih_bersama
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DRIVER=cookie
```

### 4. Setup CORS (config/cors.php)
```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### 5. Update Kernel (bootstrap/app.php or app/Http/Kernel.php - tergantung Laravel version)
```php
// Tambahkan di api middleware
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

---

## 🗄️ Database Migrations

### 1. Migration: Update Users Table
**File:** `database/migrations/2025_01_01_000001_add_fields_to_users_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->enum('role', ['user', 'admin'])->default('user')->after('password');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'role']);
        });
    }
};
```

### 2. Migration: Diagnosis Results
**File:** `database/migrations/2025_01_01_000002_create_diagnosis_results_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diagnosis_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('diagnosis_date');
            
            // Category Results
            $table->enum('category_sleep_physical', ['Ringan', 'Sedang', 'Tinggi']);
            $table->enum('category_emotional', ['Ringan', 'Sedang', 'Tinggi']);
            $table->enum('category_motivation', ['Ringan', 'Sedang', 'Tinggi']);
            $table->enum('category_anxiety', ['Ringan', 'Sedang', 'Tinggi']);
            $table->enum('category_self_confidence', ['Ringan', 'Sedang', 'Tinggi']);
            
            $table->string('dominant_category');
            $table->enum('overall_risk', ['Ringan', 'Sedang', 'Tinggi']);
            
            // Recommendations as JSON
            $table->json('recommendations');
            
            // Raw answers as JSON (optional, untuk tracking)
            $table->json('raw_answers')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('diagnosis_date');
            $table->index('overall_risk');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diagnosis_results');
    }
};
```

### 3. Migration: Articles
**File:** `database/migrations/2025_01_01_000003_create_articles_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('summary');
            $table->longText('content');
            $table->string('image')->nullable();
            $table->string('category');
            $table->date('published_date');
            $table->boolean('is_published')->default(true);
            $table->timestamps();
            
            // Indexes
            $table->index('category');
            $table->index('published_date');
            $table->index('is_published');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
```

### 4. Migration: Symptoms
**File:** `database/migrations/2025_01_01_000004_create_symptoms_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('symptoms', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->text('text');
            $table->decimal('weight', 3, 2);
            $table->string('category');
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Indexes
            $table->index('category');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('symptoms');
    }
};
```

### 5. Migration: Recommendations
**File:** `database/migrations/2025_01_01_000005_create_recommendations_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->enum('type', ['Article', 'Video']);
            $table->string('title');
            $table->string('link');
            $table->json('tags');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Indexes
            $table->index('category');
            $table->index('type');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recommendations');
    }
};
```

### Run Migrations
```bash
php artisan migrate
```

---

## 🎮 Controllers

### 1. AuthController
**File:** `app/Http/Controllers/AuthController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => 'user',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 
---

## 📦 Models

### 1. User Model
**File:** `app/Models/User.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relationships
    public function diagnosisResults()
    {
        return $this->hasMany(DiagnosisResult::class);
    }

    // Helper methods
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
```

### 2. DiagnosisResult Model
**File:** `app/Models/DiagnosisResult.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiagnosisResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'diagnosis_date',
        'category_sleep_physical',
        'category_emotional',
        'category_motivation',
        'category_anxiety',
        'category_self_confidence',
        'dominant_category',
        'overall_risk',
        'recommendations',
        'raw_answers',
    ];

    protected $casts = [
        'diagnosis_date' => 'date',
        'recommendations' => 'array',
        'raw_answers' => 'array',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

### 3. Article Model
**File:** `app/Models/Article.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'summary',
        'content',
        'image',
        'category',
        'published_date',
        'is_published',
    ];

    protected $casts = [
        'published_date' => 'date',
        'is_published' => 'boolean',
    ];

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
```

### 4. Symptom Model
**File:** `app/Models/Symptom.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Symptom extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'text',
        'weight',
        'category',
        'order',
        'is_active',
    ];

    protected $casts = [
        'weight' => 'float',
        'order' => 'integer',
        'is_active' => 'boolean',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
```

### 5. Recommendation Model
**File:** `app/Models/Recommendation.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'type',
        'title',
        'link',
        'tags',
        'is_active',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_active' => 'boolean',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
```
'Registration successful',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:6',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }
}
```

### 2. DiagnosisController
**File:** `app/Http/Controllers/DiagnosisController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\DiagnosisResult;
use Illuminate\Http\Request;

class DiagnosisController extends Controller
{
    public function index(Request $request)
    {
        $results = $request->user()
            ->diagnosisResults()
            ->orderBy('diagnosis_date', 'desc')
            ->get();

        return response()->json($results);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'diagnosis_date' => 'required|date',
            'categories' => 'required|array',
            'categories.sleepAndPhysical' => 'required|in:Ringan,Sedang,Tinggi',
            'categories.emotional' => 'required|in:Ringan,Sedang,Tinggi',
            'categories.motivation' => 'required|in:Ringan,Sedang,Tinggi',
            'categories.anxiety' => 'required|in:Ringan,Sedang,Tinggi',
            'categories.selfConfidence' => 'required|in:Ringan,Sedang,Tinggi',
            'dominant_category' => 'required|string',
            'overall_risk' => 'required|in:Ringan,Sedang,Tinggi',
            'recommendations' => 'required|array',
            'raw_answers' => 'sometimes|array',
        ]);

        $result = $request->user()->diagnosisResults()->create([
            'diagnosis_date' => $validated['diagnosis_date'],
            'category_sleep_physical' => $validated['categories']['sleepAndPhysical'],
            'category_emotional' => $validated['categories']['emotional'],
            'category_motivation' => $validated['categories']['motivation'],
            'category_anxiety' => $validated['categories']['anxiety'],
            'category_self_confidence' => $validated['categories']['selfConfidence'],
            'dominant_category' => $validated['dominant_category'],
            'overall_risk' => $validated['overall_risk'],
            'recommendations' => $validated['recommendations'],
            'raw_answers' => $validated['raw_answers'] ?? null,
        ]);

        return response()->json([
            'message' => 'Diagnosis saved successfully',
            'result' => $result,
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $result = $request->user()
            ->diagnosisResults()
            ->findOrFail($id);

        return response()->json($result);
    }
}
```

### 3. ArticleController
**File:** `app/Http/Controllers/ArticleController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::published()
            ->orderBy('published_date', 'desc')
            ->get();

        return response()->json($articles);
    }

    public function show($id)
    {
        $article = Article::published()->findOrFail($id);
        return response()->json($article);
    }
}
```

### 4. Admin/SymptomController
**File:** `app/Http/Controllers/Admin/SymptomController.php`

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Symptom;
use Illuminate\Http\Request;

class SymptomController extends Controller
{
    public function index()
    {
        $symptoms = Symptom::orderBy('category')
            ->orderBy('order')
            ->get();

        return response()->json($symptoms);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:symptoms',
            'text' => 'required|string',
            'weight' => 'required|numeric|min:0|max:1',
            'category' => 'required|string',
            'order' => 'sometimes|integer',
        ]);

        $symptom = Symptom::create($validated);

        return response()->json([
            'message' => 'Symptom created successfully',
            'symptom' => $symptom,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $symptom = Symptom::findOrFail($id);

        $validated = $request->validate([
            'code' => 'sometimes|string|unique:symptoms,code,' . $id,
            'text' => 'sometimes|string',
            'weight' => 'sometimes|numeric|min:0|max:1',
            'category' => 'sometimes|string',
            'order' => 'sometimes|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        $symptom->update($validated);

        return response()->json([
            'message' => 'Symptom updated successfully',
            'symptom' => $symptom,
        ]);
    }

    public function destroy($id)
    {
        $symptom = Symptom::findOrFail($id);
        $symptom->delete();

        return response()->json([
            'message' => 'Symptom deleted successfully',
        ]);
    }
}
```

### 5. Admin/RecommendationController
**File:** `app/Http/Controllers/Admin/RecommendationController.php`

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Recommendation;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function index()
    {
        $recommendations = Recommendation::orderBy('category')->get();
        return response()->json($recommendations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'type' => 'required|in:Article,Video',
            'title' => 'required|string',
            'link' => 'required|string',
            'tags' => 'required|array',
        ]);

        $recommendation = Recommendation::create($validated);

        return response()->json([
            'message' => 'Recommendation created successfully',
            'recommendation' => $recommendation,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $recommendation = Recommendation::findOrFail($id);

        $validated = $request->validate([
            'category' => 'sometimes|string',
            'type' => 'sometimes|in:Article,Video',
            'title' => 'sometimes|string',
            'link' => 'sometimes|string',
            'tags' => 'sometimes|array',
            'is_active' => 'sometimes|boolean',
        ]);

        $recommendation->update($validated);

        return response()->json([
            'message' => 'Recommendation updated successfully',
            'recommendation' => $recommendation,
        ]);
    }

    public function destroy($id)
    {
        $recommendation = Recommendation::findOrFail($id);
        $recommendation->delete();

        return response()->json([
            'message' => 'Recommendation deleted successfully',
        ]);
    }
}
```

### 6. Admin/ArticleController
**File:** `app/Http/Controllers/Admin/ArticleController.php`

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::orderBy('published_date', 'desc')->get();
        return response()->json($articles);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'summary' => 'required|string',
            'content' => 'required|string',
            'image' => 'sometimes|string',
            'category' => 'required|string',
            'published_date' => 'required|date',
        ]);

        $article = Article::create($validated);

        return response()->json([
            'message' => 'Article created successfully',
            'article' => $article,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'summary' => 'sometimes|string',
            'content' => 'sometimes|string',
            'image' => 'sometimes|string',
            'category' => 'sometimes|string',
            'published_date' => 'sometimes|date',
            'is_published' => 'sometimes|boolean',
        ]);

        $article->update($validated);

        return response()->json([
            'message' => 'Article updated successfully',
            'article' => $article,
        ]);
    }

    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json([
            'message' => 'Article deleted successfully',
        ]);
    }
}
```

### 7. Admin/UserController
**File:** `app/Http/Controllers/Admin/UserController.php`

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('diagnosisResults')->get();
        return response()->json($users);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'role' => 'sometimes|in:user,admin',
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'sometimes|string|max:20',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user,
        ]);
    }
}
```

### 8. Admin/DiagnosisController
**File:** `app/Http/Controllers/Admin/DiagnosisController.php`

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DiagnosisResult;

class DiagnosisController extends Controller
{
    public function index()
    {
        $results = DiagnosisResult::with('user')
            ->orderBy('diagnosis_date', 'desc')
            ->get();

        return response()->json($results);
    }
}
```

---

## 🛣️ Routes

**File:** `routes/api.php`

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DiagnosisController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\Admin;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Articles
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);

// Public Symptoms (untuk questionnaire)
Route::get('/symptoms', function () {
    return response()->json(\App\Models\Symptom::active()->orderBy('category')->orderBy('order')->get());
});

// Public Recommendations
Route::get('/recommendations', function () {
    return response()->json(\App\Models\Recommendation::active()->get());
});

// Protected Routes (User & Admin)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'updatePassword']);

    // Diagnosis (User)
    Route::get('/diagnosis', [DiagnosisController::class, 'index']);
    Route::post('/diagnosis', [DiagnosisController::class, 'store']);
    Route::get('/diagnosis/{id}', [DiagnosisController::class, 'show']);

    // Admin Only Routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        // Articles Management
        Route::apiResource('articles', Admin\ArticleController::class);

        // Symptoms Management
        Route::apiResource('symptoms', Admin\SymptomController::class);

        // Recommendations Management
        Route::apiResource('recommendations', Admin\RecommendationController::class);

        // Users Management
        Route::get('users', [Admin\UserController::class, 'index']);
        Route::put('users/{id}', [Admin\UserController::class, 'update']);

        // All Diagnosis Results
        Route::get('diagnosis', [Admin\DiagnosisController::class, 'index']);
    });
});
```

---

## 🔒 Middleware

**File:** `app/Http/Middleware/IsAdmin.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }

        return $next($request);
    }
}
```

**Register Middleware in:** `bootstrap/app.php` (Laravel 11) atau `app/Http/Kernel.php` (Laravel 10)

**Laravel 11:**
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\IsAdmin::class,
    ]);
})
```

**Laravel 10:**
```php
protected $middlewareAliases = [
    'admin' => \App\Http\Middleware\IsAdmin::class,
];
```

---

## 🌱 Seeders

**File:** `database/seeders/DatabaseSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Article;
use App\Models\Symptom;
use App\Models\Recommendation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@pulihbersama.com',
            'phone' => '081234567890',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // Create Test Users
        User::create([
            'name' => 'Maya Sari',
            'email' => 'maya@example.com',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'phone' => '081234567892',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        // Create Articles
        Article::create([
            'title' => 'Memahami Perasaan Anak Saat Orang Tua Bercerai',
            'summary' => 'Perceraian adalah momen yang sulit bagi semua anggota keluarga, terutama anak-anak.',
            'content' => 'Konten artikel lengkap tentang memahami perasaan anak...',
            'image' => 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d',
            'category' => 'Psikologi Anak',
            'published_date' => '2025-01-15',
        ]);

        Article::create([
            'title' => 'Tips Menjaga Kesehatan Mental Remaja',
            'summary' => 'Kesehatan mental remaja sangat penting untuk perkembangan mereka.',
            'content' => 'Konten artikel lengkap tentang kesehatan mental remaja...',
            'image' => 'https://images.unsplash.com/photo-1544027993-37dbfe43562a',
            'category' => 'Kesehatan Mental',
            'published_date' => '2025-01-10',
        ]);

        // Create Symptoms
        $symptoms = [
            ['code' => 'G001', 'text' => 'Kesulitan tidur atau tidur berlebihan', 'weight' => 0.8, 'category' => 'Gangguan Tidur & Keluhan Fisik', 'order' => 1],
            ['code' => 'G002', 'text' => 'Sering merasa lelah tanpa alasan jelas', 'weight' => 0.7, 'category' => 'Gangguan Tidur & Keluhan Fisik', 'order' => 2],
            ['code' => 'G003', 'text' => 'Sakit kepala atau sakit perut berulang', 'weight' => 0.6, 'category' => 'Gangguan Tidur & Keluhan Fisik', 'order' => 3],
            ['code' => 'G004', 'text' => 'Mimpi buruk tentang keluarga', 'weight' => 0.7, 'category' => 'Gangguan Tidur & Keluhan Fisik', 'order' => 4],
            ['code' => 'G005', 'text' => 'Mudah marah atau tersinggung', 'weight' => 0.8, 'category' => 'Gangguan Emosi & Afektif', 'order' => 1],
            ['code' => 'G006', 'text' => 'Sering merasa sedih tanpa sebab', 'weight' => 0.9, 'category' => 'Gangguan Emosi & Afektif', 'order' => 2],
            ['code' => 'G007', 'text' => 'Kehilangan minat pada aktivitas favorit', 'weight' => 0.8, 'category' => 'Penurunan Motivasi & Aktivitas', 'order' => 1],
            ['code' => 'G008', 'text' => 'Sering merasa khawatir berlebihan', 'weight' => 0.9, 'category' => 'Kecemasan', 'order' => 1],
        ];

        foreach ($symptoms as $symptom) {
            Symptom::create($symptom);
        }

        // Create Recommendations
        Recommendation::create([
            'category' => 'Gangguan Tidur & Keluhan Fisik',
            'type' => 'Article',
            'title' => 'Teknik Relaksasi untuk Tidur Lebih Baik',
            'link' => '#',
            'tags' => ['tidur', 'relaksasi', 'kesehatan'],
        ]);

        Recommendation::create([
            'category' => 'Gangguan Emosi & Afektif',
            'type' => 'Video',
            'title' => 'Mengelola Emosi dengan Mindfulness',
            'link' => '#',
            'tags' => ['emosi', 'mindfulness', 'mental health'],
        ]);

        Recommendation::create([
            'category' => 'Kecemasan',
            'type' => 'Article',
            'title' => 'Cara Mengatasi Kecemasan pada Anak',
            'link' => '#',
            'tags' => ['kecemasan', 'anak', 'solusi'],
        ]);
    }
}
```

**Run Seeder:**
```bash
php artisan db:seed
```

---

## 🐍 Integration dengan Python API (Content-Based Filtering)

### Setup Python API untuk Rekomendasi

**File struktur Python:**
```
python-api/
├── app.py
├── requirements.txt
└── recommendation_engine.py
```

### 1. Python API (Flask/FastAPI)
**File:** `app.py`

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from recommendation_engine import get_recommendations

app = Flask(__name__)
CORS(app)

@app.route('/api/recommendations', methods=['POST'])
def get_article_recommendations():
    """
    Content-based filtering untuk rekomendasi artikel
    berdasarkan diagnosis result
    """
    data = request.json
    
    # Input dari Laravel
    dominant_category = data.get('dominant_category')
    overall_risk = data.get('overall_risk')
    user_history = data.get('history', [])
    
    # Process dengan ML/Content-based filtering
    recommendations = get_recommendations(
        dominant_category=dominant_category,
        overall_risk=overall_risk,
        history=user_history
    )
    
    return jsonify({
        'recommendations': recommendations
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

**File:** `requirements.txt`
```
flask
flask-cors
numpy
pandas
scikit-learn
```

**File:** `recommendation_engine.py`
```python
import numpy as np

def get_recommendations(dominant_category, overall_risk, history):
    """
    Content-based filtering algorithm
    Bisa pakai TF-IDF, Cosine Similarity, dll
    """
    # TODO: Implement actual ML algorithm
    # Ini contoh sederhana
    
    recommendations = {
        'articles': [],
        'videos': [],
        'activities': []
    }
    
    # Logic berdasarkan kategori dominan
    if dominant_category == 'Kecemasan':
        recommendations['articles'] = [1, 3, 5]  # Article IDs
        recommendations['videos'] = [2, 4]
    
    return recommendations
```

### 2. Call Python API dari Laravel

**File:** `app/Services/RecommendationService.php`

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RecommendationService
{
    protected $pythonApiUrl;

    public function __construct()
    {
        $this->pythonApiUrl = env('PYTHON_API_URL', 'http://localhost:5000');
    }

    public function getPersonalizedRecommendations($diagnosisResult, $userHistory = [])
    {
        try {
            $response = Http::timeout(10)->post($this->pythonApiUrl . '/api/recommendations', [
                'dominant_category' => $diagnosisResult->dominant_category,
                'overall_risk' => $diagnosisResult->overall_risk,
                'history' => $userHistory,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            \Log::error('Python API Error: ' . $e->getMessage());
            return null;
        }
    }
}
```

**Update DiagnosisController untuk pakai Python API:**

```php
use App\Services\RecommendationService;

public function store(Request $request, RecommendationService $recommendationService)
{
    // ... validation code ...

    $result = $request->user()->diagnosisResults()->create([...]);

    // Get personalized recommendations from Python API
    $userHistory = $request->user()
        ->diagnosisResults()
        ->orderBy('diagnosis_date', 'desc')
        ->take(5)
        ->get();

    $personalizedRecs = $recommendationService->getPersonalizedRecommendations(
        $result,
        $userHistory
    );

    return response()->json([
        'message' => 'Diagnosis saved successfully',
        'result' => $result,
        'personalized_recommendations' => $personalizedRecs,
    ], 201);
}
```

**Add to .env:**
```env
PYTHON_API_URL=http://localhost:5000
```

---

## 🚀 Running the Application

### 1. Start Laravel Backend
```bash
cd pulih-bersama-backend
php artisan serve
# Running at http://localhost:8000
```

### 2. Start Python API (Optional)
```bash
cd python-api
pip install -r requirements.txt
python app.py
# Running at http://localhost:5000
```

### 3. Start React Frontend
```bash
cd "Pulih Bersama"
npm run dev
# Running at http://localhost:5173
```

---

## 📝 Testing API dengan Postman/cURL

### Register
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "081234567890",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pulihbersama.com",
    "password": "admin123"
  }'
```

### Get Articles
```bash
curl -X GET http://localhost:8000/api/articles
```

### Create Diagnosis (with token)
```bash
curl -X POST http://localhost:8000/api/diagnosis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "diagnosis_date": "2025-01-20",
    "categories": {
      "sleepAndPhysical": "Sedang",
      "emotional": "Tinggi",
      "motivation": "Ringan",
      "anxiety": "Sedang",
      "selfConfidence": "Sedang"
    },
    "dominant_category": "Gangguan Emosi & Afektif",
    "overall_risk": "Sedang",
    "recommendations": ["Rec 1", "Rec 2"]
  }'
```

---

## 🔄 Next Steps

1. ✅ Setup Laravel project
2. ✅ Run migrations
3. ✅ Run seeders
4. ✅ Test API endpoints
5. ⏭️ Setup Python API (optional)
6. ⏭️ Update React frontend untuk consume API

---

## 📞 Support

Jika ada error atau butuh bantuan:
- Check Laravel logs: `storage/logs/laravel.log`
- Check PHP version: `php -v` (minimal 8.1)
- Check database connection di `.env`
- Pastikan Sanctum sudah ter-install

Good luck! 🚀
