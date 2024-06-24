@extends('layouts.master')

@section('content')
<div id="products" class="container">
    <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#productModal">Add <span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
    <div class="card-body" style="height: 210px;">
        <input type="text" id='productSearch' placeholder="--search--">
    </div>
    <div class="table-responsive">
        <!-- Changed table ID from "itable" to "productTable" -->
        <table id="productTable" class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Product ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Supplier</th>
                    <th>Description</th>
                    <th>Cost</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <!-- Changed tbody ID from "ibody" to "productTbody" -->
            <tbody id="productTbody">
            </tbody>
        </table>
    </div>
</div>

<div class="modal fade" id="productModal" role="dialog" style="display:none">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Products Management</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="productform" method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="name_id" class="control-label">Name</label>
                        <input type="text" class="form-control" id="name_id" name="name">
                    </div>
                    <div class="form-group">
                        <label for="brand_id" class="col-sm-2 control-label">Brand</label>
                        <div class="col-sm-12">
                            <select name="brand_id" id="brand_id" class="form-control">
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="supplier_id" class="col-sm-2 control-label">Supplier</label>
                        <div class="col-sm-12">
                            <select name="supplier_id" id="supplier_id" class="form-control">
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="description_id" class="control-label">Description</label>
                        <input type="text" class="form-control" id="description_id" name="description">
                    </div>
                    <div class="form-group">
                        <label for="cost_id" class="control-label">Cost</label>
                        <input type="text" class="form-control" id="cost_id" name="cost">
                    </div>
                    <div class="form-group">
                        <label for="image" class="control-label">Image</label>
                        <input type="file" class="form-control" id="image" name="uploads[]" multiple />
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button id="productSubmit" type="submit" class="btn btn-primary">Save</button>
                <button id="productUpdate" type="submit" class="btn btn-primary">Update</button>
            </div>
        </div>
    </div>
</div>

<div class ="card-body">
    <form action = "{{url('products/import')}}" method = "POST" enctype = "multipart/form-data">
        @csrf

        <div class = "input-group">
            <input type = "file" name = "importFile" class = "form-control"/>
            <button type = "submit" class = "btn btn-primary"> Import </button>
        </div>
    </form>
</div>


@endsection

@section('scripts')
<script src="{{ asset('js/product.js') }}"></script>
@endsection
