<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\User;

class UserTest extends TestCase
{
    use DatabaseMigrations;
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testCreateAdmin()
    {

        $this->visit('/setuser');

        $this->assertEquals(User::where("email", "kirilrupasov@gmail.com")->first() -> status, "admin");

    }

    public function testCreateUser() {
        $email = "abc12@abc.com";
        $password = "123123";

        $response = $this->call('POST', '/storeuser', array(
            '_token' => csrf_token(),
            'email' => $email,
            'password' => $password
        ));

        $this->assertEquals(User::where("email", $email)->first() -> status, "basic");
    }

    public function testCreateSameUser() {
        User::create([
            'email' => 'abc12@abc.com',
            'password' => bcrypt('123123'),
        ]);

        $email = "abc12@abc.com";
        $password = "123123";

        $response = $this->call('POST', '/storeuser', array(
            '_token' => csrf_token(),
            'email' => $email,
            'password' => $password
        ));

        $this->assertEquals($response -> getContent(), 'User already exists');
    }

    public function testCreateSameAdmin() {
        $response = $this->call('GET', '/setuser');
        $response = $this->call('GET', '/setuser');

        $this->assertEquals($response -> getContent(), 'User already exists');
    }

    public function testStoreSession() {
        User::create([
            'email' => 'abc12@abc.com',
            'password' => bcrypt('123123'),
        ]);

        $email = "abc12@abc.com";
        $session_id = "A395BE";

        $response = $this->call('POST', '/storesession', array(
            '_token' => csrf_token(),
            'email' => $email,
            'session_id' => $session_id
        ));

        $this->assertEquals($response -> getContent(), "Session started");
    }

    public function testStoreSessionInvalidEmail() {
        $email = "abcdef@abc.com";
        $session_id = "123456";

        $response = $this->call('POST', '/storesession', array(
            '_token' => csrf_token(),
            'email' => $email,
            'session_id' => $session_id
        ));

        $this->assertEquals($response -> getContent(), "Session not started");
    }
}