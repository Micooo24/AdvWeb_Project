<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Brand;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Brand::all();
        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'brand_name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'uploads' => 'required|file|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        $brand = new Brand();
        $brand->brand_name = $request->brand_name;
        $brand->description = $request->description;

        $file = $request->file('uploads');
        if ($file) {
            $filePath = 'images/' . $file->getClientOriginalName();
            Storage::put('public/' . $filePath, file_get_contents($file));
            $brand->logo = $filePath;
        }

        $brand->save();

        return response()->json([
            "success" => "Brand created successfully.",
            "brand" => $brand,
            "status" => 200
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $brand = Brand::findOrFail($id);
        return response()->json($brand);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'brand_name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'uploads' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                "error" => "Brand not found.",
                "status" => 404
            ], 404);
        }

        $brand->brand_name = $request->brand_name;
        $brand->description = $request->description;

        $file = $request->file('uploads');
        if ($file) {
            $filePath = 'images/' . $file->getClientOriginalName();
            Storage::put('public/' . $filePath, file_get_contents($file));
            $brand->logo = $filePath;
        }
        $brand->save();

        return response()->json([
            "success" => "Brand updated successfully.",
            "brand" => $brand,
            "status" => 200
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $brand = Brand::findOrFail($id);
        if ($brand->logo) {
            Storage::delete('public/' . $brand->logo);
        }
        $brand->delete();

        return response()->json(['success' => 'Brand deleted successfully.', 'code' => 200]);
    }
}
