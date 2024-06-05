@extends('layouts.master')
@section('content')
    <div id="items" class="container">
        @include('layouts.flash-messages')
        {{-- <a class="btn btn-primary" href="{{ route('items.create') }}" role="button">add</a> --}}
        {{-- <form method="POST" enctype="multipart/form-data" action="{{ route('item-import') }}">
            {{ csrf_field() }}
            <input type="file" id="uploadName" name="item_upload" required>
            <button type="submit" class="btn btn-info btn-primary ">Import Excel File</button>

        </form> --}}
        {{-- <div class="card-body" style="height: 210px;">
            <input type="text" id='itemSearch' placeholder="--search--">
        </div> --}}
        <div class="table-responsive">
            <table id="itable" class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>customer ID</th>
                        <th>username</th>
                        <th>address</th>
                        <th>contact_number</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
    {{-- <div class="modal fade" id="itemModal" role="dialog" style="display:none">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Create new item</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="iform" method="{{ route('items.store') }}" action="POST" enctype="multipart/form-data">
                        @csrf
                        <div class="form-group">
                            <label for="desc" class="control-label">Description</label>
                            <input type="text" class="form-control" id="desc" name="description">
                        </div>
                        <div class="form-group">
                            <label for="sell" class="control-label">sell price</label>
                            <input type="text" class="form-control " id="sell" name="sell_price">
                        </div>
                        <div class="form-group">
                            <label for="cost" class="control-label">Cost Price</label>
                            <input type="text" class="form-control " id="cost" name="cost_price">
                        </div>
                        <div class="form-group">
                            <label for="image" class="control-label">Image</label>
                            <input type="file" class="form-control" id="image" name="img_path" />
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    {!! Form::submit('submit', ['class' => 'btn btn-primary']) !!}
                </div>

            </div>
        </div>
    </div> --}}
@endsection
