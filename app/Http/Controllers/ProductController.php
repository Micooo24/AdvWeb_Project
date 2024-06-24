<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Supplier;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

//Excel Import
use App\Imports\ProductsImport;
use Maatwebsite\Excel\Facades\Excel;
class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Eager load brand and supplier relationships
        $products = Product::with(['brand', 'supplier'])->orderByDesc('id')->get();
        $brands = Brand::all();
        $suppliers = Supplier::all();

        return response()->json([
            'products' => $products,
            'brands' => $brands,
            'suppliers' => $suppliers
        ]);
    }

//     public function index()
// {
//     // Eager load brand and supplier relationships
//     $products = Product::with(['brand:id,brand_name', 'supplier:id,name'])->orderByDesc('id')->get();
//     $brands = Brand::all();
//     $suppliers = Supplier::all();

//     return response()->json([
//         'products' => $products,
//         'brands' => $brands,
//         'suppliers' => $suppliers
//     ]);
// }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'description' => 'nullable|string',
            'cost' => 'required|numeric',
            'uploads.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Create a new product
        $product = new Product;
        $product->name = $request->name;
        $product->brand_id = $request->brand_id;
        $product->supplier_id = $request->supplier_id;
        $product->description = $request->description;
        $product->cost = $request->cost;
        $product->img_path = '';

        // Handle image uploads
        if ($request->hasFile('uploads')) {
            foreach ($request->file('uploads') as $file) {
                $fileName = Str::random(20) . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/images', $fileName);
                $product->img_path .= 'storage/images/' . $fileName . ',';
            }
            $product->img_path = rtrim($product->img_path, ',');
        }

        // Save the product
        $product->save();

        // Return a success response with the created product
        return response()->json([
            "success" => "Product created successfully.",
            "product" => $product->load(['brand', 'supplier']),
            "status" => 200
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Find the product by ID with its associated brand and supplier
        $product = Product::with(['brand', 'supplier'])->find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found.', 'status' => 404]);
        }

        // Return a JSON response with the product
        return response()->json([
            'product' => $product,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'description' => 'nullable|string',
            'cost' => 'required|numeric',
            'uploads.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Find the product by ID
        $product = Product::find($id);

        if (!$product) {
            return response()->json(["error" => "Product not found.", "status" => 404]);
        }

        // Update product details
        $product->name = $request->name;
        $product->brand_id = $request->brand_id;
        $product->supplier_id = $request->supplier_id;
        $product->description = $request->description;
        $product->cost = $request->cost;

        // Handle image uploads
        if ($request->hasFile('uploads')) {
            $imagePaths = [];
            foreach ($request->file('uploads') as $file) {
                $fileName = Str::random(20) . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/images', $fileName);
                $imagePaths[] = 'storage/images/' . $fileName;
            }
            $product->img_path = implode(',', $imagePaths);
        }

        // Save the updated product
        $product->save();

        // Return a success response with the updated product
        return response()->json([
            "success" => "Product updated successfully.",
            "product" => $product->load(['brand', 'supplier']),
            "status" => 200
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Check if the product exists
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found', 'status' => 404]);
        }

        // Delete the product
        Product::destroy($id);

        // Return a success response
        return response()->json(['success' => 'Product deleted', 'status' => 200]);
    }

    public function import (Request $request)
    {
      $request ->validate([
          'importFile' => ['required', 'file', 'mimes:xlsx,xls']
      ]);

      Excel::import(new ProductsImport, $request->file('importFile'));

      return redirect()->back()->with('success', 'Products imported successfully');
    }
}
