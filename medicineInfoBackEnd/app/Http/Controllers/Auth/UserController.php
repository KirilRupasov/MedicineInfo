<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
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
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {

    }

    public function createUser(Request $request) {
        $input = $request -> all();

        if(!(User::where("email", $input['email']) -> first())) {
            User::create([
                'email' => $input['email'],
                'password' => bcrypt($input['password'])
            ]);
            return "Success";
        }

        return "User already exists";
    }

    public function storeSession(Request $request) {
        $input = $request -> all();

        if((User::where("email", $input['email']) -> first())) {
            User::where("email", $input['email'])->update(['session_id' => $input['session_id']]);
            return "Session started";
        }

        return "Session not started";
    }

    /**
     * This method creates user for database management and then redirects user to Login UI
     *
     */
    public function createAdmin() {
        if(!(User::where("email", "kirilrupasov@gmail.com") -> first())) {
            User::create([
                'email' => 'kirilrupasov@gmail.com',
                'password' => bcrypt('6688846993'),
                'status' => 'admin'
            ]);

            return redirect("/");
        }

        return "User already exists";
    }

}
