@extends('layouts.master')
@section('content')
        <div class="card-body">
            @if (session('status'))
                <div class="alert alert-success" role="alert">
                    {{ session('status') }}
                </div>
            @endif
            {{ __('You are logged in as Customer!') }}
        </div>
@endsection
