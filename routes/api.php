<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ProductController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('customers', CustomerController::class);

Route::apiResource('brands', BrandController::class);
Route::apiResource('suppliers', SupplierController::class);
Route::apiResource('products', ProductController::class);


//try
Route::post('/suppliers/import', [SupplierController::class, 'import']);

Route::post('/products/import', [ProductController::class, 'import']);

Route::get('/form-data', function () {
    return response()->json([
        'brands' => \App\Models\Brand::all(),
        'suppliers' => \App\Models\Supplier::all()
    ]);
});

