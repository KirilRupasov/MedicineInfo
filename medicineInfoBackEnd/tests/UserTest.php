<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\User;

class UserTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testCreateAdmin()
    {
        //before setting admin delete the old one if exists
        User::where("email", "kirilrupasov@gmail.com")->delete();

        $this->visit('/setuser');

        $this->assertEquals(User::where("email", "kirilrupasov@gmail.com")->first() -> status, "admin");

    }

    public function testCreateUser() {

    }
}