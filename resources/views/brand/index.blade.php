@extends('layouts.master')
@section('content')
    <div id="items" class="container">
        <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#brandModal">add<span
            class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
        {{-- @include('layouts.flash-messages') --}}
        {{-- <a class="btn btn-primary" href="{{ route('items.create') }}" role="button">add</a> --}}
        {{-- <form method="POST" enctype="multipart/form-data" action="{{ route('item-import') }}">
            {{ csrf_field() }}
            <input type="file" id="uploadName" name="item_upload" required>
            <button type="submit" class="btn btn-info btn-primary ">Import Excel File</button>

        </form> --}}
        <div class="card-body" style="height: 210px;">
            <input type="text" id='itemSearch' placeholder="--search--">
        </div>
        <div class="table-responsive">
            <table id="ctable" class="table table-striped table-hover " >
                <thead>
                    <tr>
                        <th>brand ID</th>
                        <th>brand name</th>
                        <th>logo</th>
                        <th>description</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody id="dbody"></tbody>
            </table>
        </div>
    </div>
    <div class="modal fade" id="brandModal" role="dialog" style="display:none">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Create new brand</h4>
              <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="dform" method="#" action="#" enctype="multipart/form-data">

                  <div class="form-group">
                      <label for="brandId" class="control-label">brand id</label>
                      <input type="text" class="form-control" id="brandId" name="brand_id" readonly>
                    </div>

                <div class="form-group">
                  <label for="brand name" class="control-label">brand name</label>
                  <input type="text" class="form-control " id="brand name" name="brand name">
                </div>
                <div class="form-group">
                    <label for="logo" class="control-label">Logo</label>
                    <input type="file" class="form-control" id="logo" name="uploads" />
                </div>
                <div class="form-group">
                  <label for="descrition" class="control-label">description</label>
                  <input type="text" class="form-control " id="description" name="description">
                </div>

              </form>
            </div>
            <div class="modal-footer" id="footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button id="brandSubmit" type="submit" class="btn btn-primary">Save</button>
              <button id="brandUpdate" type="submit" class="btn btn-primary">update</button>
            </div>

          </div>
        </div>
      </div>
@endsection
