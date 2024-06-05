@extends('layouts.master')
@section('content')
    <div class="container-fluid">
            <h1>Sign Up</h1>
            @include('layouts.flash-messages')
            <form class="" action="{{ route('user.signup') }}" method="post" enctype="multipart/form-data">
                @csrf
                <div class="form-group">
                    <label for="Name"> Name: </label>
                    <input type="text" name="name" id="name" class="form-control">
                </div>
                <div class="form-group">
                    <label for="Userame"> Username: </label>
                    <input type="text" name="username" id="username" class="form-control">
                </div>
                <div class="form-group">
                    <label for="email">Email: </label>
                    <input type="text" name="email" id="email" class="form-control">
                </div>
                <div class="form-group">
                    <label for="address">Address: </label>
                    <input type="text" name="address" id="address" class="form-control">
                </div>
                <div class="form-group">
                    <label for="contact_number">Contact Number: </label>
                    <input type="text" name="contact_number" id="contact_number" class="form-control">
                </div>
                <div class="form-group">
                    <label for="password">Password: </label>
                    <input type="password" name="password" id="password" class="form-control">
                </div>
                <div class="form-group">
                    <label for="img_path">Image: </label>
                    <input type="file" class="form-control-file" name="img_path[]" multiple>
                </div>
                <input type="submit" value="Sign Up" class="btn btn-primary">
            </form>
    </div>
@endsection
