<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BrandController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('user')->group(function () {
    Route::get('register', [UserController::class, 'register'])->name('user.register');
    Route::post('signup', [UserController::class, 'SignUp'])->name('user.signup');
    Route::get('login', [UserController::class, 'login'])->name('user.login');
    Route::post('signin', [UserController::class,'SignIn'])->name('user.signin');
});

Route::group(['prefix' => 'admin',  'middleware' => 'role:admin'], function () {
    Route::get('dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
});


Route::group(['prefix' => 'user',  'middleware' => 'role:customer'], function () {
    Route::get('dashboard', [CustomerController::class, 'dashboard'])->name('user.dashboard');
});

Route::view('/customer-all', 'customer.index');

Route::view('/brand-all', 'brand.index');


// Route::view('/product-all', 'product.index');

//bawal na pala tong mga to kapag nakapag API na
// Route::resource('suppliers', SupplierController::class);
// Route::resource('brands', BrandController::class);
// Route::resource('products', ProductController::class);


Route::view('/supplier', 'supplier.index');
 Route::view('/product', 'product.index');
