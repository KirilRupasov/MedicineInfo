<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View Login UI
     */
    public function getLoginForm() {
        return view('login');
    }

    /**
     * This method creates user for database management and then redirects user to Login UI
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector redirects to Login UI
     */
    public function createUser() {
        if(!(User::where("email", "kirilrupasov@gmail.com") -> first())) {
            User::create([
                'email' => 'kirilrupasov@gmail.com',
                'password' => bcrypt('6688846993'),
            ]);
        }
        return redirect("/");
    }


    /**
     * This method check user login/password combination.
     * If it matches records -> returns admin panel for database management
     * Otherwise -> return "Login Failed!" message
     *
     * @param Request $request HTTP POST request containing email and password
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View|string
     */
    public function verifyUser(Request $request) {
        $input = $request->all();

        if (Auth::attempt(['email' => $input['email'], 'password' => $input['password']])) {
            return view("adminPanel");
        } else {
            return "Login Failed!";
        }
    }
}
