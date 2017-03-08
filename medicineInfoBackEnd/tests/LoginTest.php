<?php

use App\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class LoginTest extends TestCase
{
    use DatabaseMigrations;

    public function testVerifyUser() {
        $this->visit('/setuser');

        $response = $this->call('POST', '/verify', array(
            '_token' => csrf_token(),
            'email' => 'kirilrupasov@gmail.com',
            'password' => '6688846993'
        ));

        $this->assertNotFalse(strpos($response->getContent(), "Load Best-Selling Drugs"));
    }

    public function testVerifyUserNonExistentUser() {
        $this->visit('/setuser');

        $response = $this->call('POST', '/verify', array(
            '_token' => csrf_token(),
            'email' => 'abc3@gmail.com',
            'password' => '123123'
        ));

        $this->assertEquals($response->getContent(), "Login Failed!");
    }

    public function testVerifyUserWrongUser() {
        $this->visit('/setuser');

        User::create([
            'email' => 'abc3@gmail.com',
            'password' => bcrypt('123123')
        ]);

        $response = $this->call('POST', '/verify', array(
            '_token' => csrf_token(),
            'email' => 'abc3@gmail.com',
            'password' => '123123'
        ));

        $this->assertEquals($response->getContent(), "Login Failed!");
    }
}
