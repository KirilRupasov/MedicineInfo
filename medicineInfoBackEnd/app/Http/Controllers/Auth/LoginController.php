<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/verify';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('guest', ['except' => 'logout']);
    }

    public function getLoginForm() {
        return view('login');
    }

    public function createUser() {
        User::create([
            'email' => 'kirilrupasov@gmail.com',
            'password' => bcrypt('6688846993'),
        ]);
    }


    public function verifyUser(Request $request) {


        $input = $request->all();

        if (Auth::attempt(['email' => $input['email'], 'password' => $input['password']])) {
            return view("adminPanel");
        } else {
            return "Login Failed!";
        }
    }
}
