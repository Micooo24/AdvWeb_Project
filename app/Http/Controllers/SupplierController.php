<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use DataTables;
use Storage;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    if ($request->ajax()) {
        $data = Supplier::all();
        return Datatables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function($row){
                    $btn = '<a href="javascript:void(0)" data-toggle="tooltip" data-id="'.$row->id.'" data-original-title="Edit" class="edit btn btn-primary btn-sm editSupplier">Edit</a>';
                    $btn .= ' <a href="javascript:void(0)" data-toggle="tooltip" data-id="'.$row->id.'" data-original-title="Delete" class="btn btn-danger btn-sm deleteSupplier">Delete</a>';
                    return $btn;
                })
                ->editColumn('img_path', function($row) {
                    return $row->img_path ? "<img src='" . url('images/'.$row->img_path) . "' width='50' class='img-thumbnail' />" : '';
                })
                ->rawColumns(['action', 'img_path'])
                ->make(true);
    }

    return view('supplier.index');
}

public function show($id)
{
    $supplier = Supplier::findOrFail($id);
    return view('suppliers.show', compact('supplier'));
}



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{

    dd($request->file('img_path'));

    $supplier = new Supplier();
    $supplier->name = $request->name;
    $supplier->email = $request->email;
    $supplier->contact_number = $request->contact_number;

    if ($request->hasFile('img_path')) {
        $file = $request->file('img_path');
        $fileName = $file->getClientOriginalName();
        $file->storeAs('public/images', $fileName);
        $supplier->img_path = 'storage/images/' . $fileName;
    }

    $supplier->save();

    return response()->json([
        "success" => "Supplier created successfully.",
        "customer" => $supplier,
        "status" => 200
    ]);
}


    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $supplier = Supplier::find($id);
        return response()->json($supplier);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Supplier::find($id)->delete();
        return response()->json(['success' => 'Supplier deleted successfully.']);
    }
}
