<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Courier;

class CourierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Courier::orderBy('id', 'DESC')->get();
        return response()->json($data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json([]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'courier_name' => 'required|array',
            'contact_number' => 'required|image|mimes:jpeg,jpg,png',
            'email' => 'email| required| unique:users',
            'img_path.*' => 'required|image|mimes:jpeg,jpg,png',
        ];

        $messages = [
            'img_path.required' => 'Please Input a brand Image',
            'image' => 'Image format not supported',
            'courier_name.required' => 'Please Input the Courier Name',
            'contact_number.required' => 'Please Input the Courier contact number',
            'email.required' => 'Please Input the email of the courier',
        ];

        Validator::make($request->all(), $rules, $messages)->validate();

        $couriers = new Courier;

        $img_paths = [];
        if ($request->hasFile('img_path')) {
            foreach ($request->file('img_path') as $image) {
                $originalName = $image->getClientOriginalName();
                $path = $image->storeAs('public/images', $originalName);
                $img_paths[] = $originalName;
            }
            $couriers->img_path = implode(',', $img_paths);
        }
        $couriers->save();
        
        return response()->json([]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
