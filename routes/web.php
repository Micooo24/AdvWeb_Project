<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SupplierController;
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
Route::resource('suppliers', SupplierController::class);
