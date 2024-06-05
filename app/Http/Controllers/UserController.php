<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Customer;
use Auth;

class UserController extends Controller
{
    public function register()
    {
        return view('user.register');
    }

    public function login()
    {
        return view('user.login');
    }

    public function SignUp(Request $request)
    {
        $this->validate($request, [
            'email' => 'email| required| unique:users',
            'password' => 'required| min:4',
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'contact_number' => 'required|string|max:15',
            'img_path.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:4048'
        ]);
        $user = new User([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        $user->save();
        $customer = new Customer;
        $customer->user_id = $user->id;
        $customer->username = $request->username;
        $customer->address = $request->address;
        $customer->contact_number = $request->contact_number;

        $img_paths = [];
        if ($request->hasFile('img_path')) {
            foreach ($request->file('img_path') as $image) {
                $originalName = $image->getClientOriginalName();
                $path = $image->storeAs('public/images', $originalName);
                $img_paths[] = $originalName;
            }
            $customer->img_path = implode(',', $img_paths);
        }
        $customer->save();
        Auth::login($user);
        return redirect()->route('user.register')->with('success', 'You are successfully registered!');
    }

    public function SignIn(Request $request)
    {
        $input = $request->all();

        $this->validate($request, [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (auth()->attempt(['email' => $input['email'], 'password' => $input['password']])) {
            if (auth()->user()->deleted_at !== null) {
                auth()->logout();
                return redirect()->route('login')->with('error', 'You are restricted from logging in. Please contact the administrator.');
            }

            if (auth()->user()->role == 'admin') {
                return redirect()->route('admin.dashboard');
            } else {
                return redirect()->route('user.dashboard');
            }
        } else {
            return redirect()->route('login')->with('error', 'Incorrect email or password.');
        }
    }

    public function logout()
    {
        Auth::logout();
        return redirect('/');
    }
}
