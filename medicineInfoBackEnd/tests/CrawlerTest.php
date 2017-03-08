<?php

use App\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use \App\Http\Controllers\CrawlerController;

class CrawlerTest extends TestCase
{
    use DatabaseMigrations;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testGetStringBetween()
    {
        User::create([
            'email' => 'kirilrupasov@gmail.com',
            'password' => bcrypt('6688846993')
        ]);

        $user = new User(array('email'=>'kirilrupasov@gmail.com', 'password'=>'6688846993'));
        $this -> be($user);


        $str = "<p>this piece of string is needed</p>this one is not";

        $cc = new CrawlerController();

        $this -> assertEquals($cc->get_string_between($str, "<p>", "</p>"), "this piece of string is needed");
    }

    public function testGetSecondStringBetween()
    {
        User::create([
            'email' => 'kirilrupasov@gmail.com',
            'password' => bcrypt('6688846993')
        ]);

        $user = new User(array('email'=>'kirilrupasov@gmail.com', 'password'=>'6688846993'));
        $this -> be($user);


        $str = $str = "<p>first bit</p><p>second bit</p><p>third bit</p>";;

        $cc = new CrawlerController();

        $this -> assertEquals($cc->get_string_between($str, "<p>", "</p>", 2), "second bit");
    }

    public function testGetStringsBetween()
    {
        User::create([
            'email' => 'kirilrupasov@gmail.com',
            'password' => bcrypt('6688846993')
        ]);

        $user = new User(array('email'=>'kirilrupasov@gmail.com', 'password'=>'6688846993'));
        $this -> be($user);

        $str = "<p>first bit</p><p>second bit</p><p>third bit</p>";

        $cc = new CrawlerController();

        $this -> assertEquals($cc->get_tagged_strings($str, "<p>", "</p>")[2], "third bit");
    }

    public function testCheckIfAvailableInLloyds()
    {
        User::create([
            'email' => 'kirilrupasov@gmail.com',
            'password' => bcrypt('6688846993')
        ]);

        $user = new User(array('email'=>'kirilrupasov@gmail.com', 'password'=>'6688846993'));
        $this -> be($user);

        $cc = new CrawlerController();

        $this -> assertTrue($cc->checkIfAvailableInLloyds("Abilify"));
    }

    public function testFetchBarcodesByTitle()
    {
        User::create([
            'email' => 'kirilrupasov@gmail.com',
            'password' => bcrypt('6688846993')
        ]);

        $user = new User(array('email'=>'kirilrupasov@gmail.com', 'password'=>'6688846993'));
        $this -> be($user);

        $cc = new CrawlerController();

        $expected = array("8027950031801", "8027950031931", "8027950031788");
        sort($expected);

        $actual = $cc->fetchBarcodesByTitle("Abilify");
        sort($actual);

        $this -> assertEquals($actual, $expected);
    }

    public function testFetchData()
    {
        User::create([
            'email' => 'kirilrupasov@gmail.com',
            'password' => bcrypt('6688846993')
        ]);

        $user = new User(array('email'=>'kirilrupasov@gmail.com', 'password'=>'6688846993'));
        $this -> be($user);

        $cc = new CrawlerController();

        $this -> assertEquals($cc->fetchData("Abilify", false)[1]['title'], 'Abilify Maintena');
    }

    public function testFetchDataLimitOne()
    {
        User::create([
            'email' => 'kirilrupasov@gmail.com',
            'password' => bcrypt('6688846993')
        ]);

        $user = new User(array('email'=>'kirilrupasov@gmail.com', 'password'=>'6688846993'));
        $this -> be($user);

        $cc = new CrawlerController();

        $this -> assertEquals($cc->fetchData("Abilify", true)['title'], 'Abilify');
    }

    public function testFetchDataWrongRequest()
    {
        User::create([
            'email' => 'kirilrupasov@gmail.com',
            'password' => bcrypt('6688846993')
        ]);

        $user = new User(array('email'=>'kirilrupasov@gmail.com', 'password'=>'6688846993'));
        $this -> be($user);

        $cc = new CrawlerController();

        $this -> assertEquals($cc->fetchData("abcdefghijklmn", false), 'Wrong request');
    }

}
