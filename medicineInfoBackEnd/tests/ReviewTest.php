<?php

use App\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Medicine;
use App\Review;

class ReviewTest extends TestCase
{
    use DatabaseMigrations;

    public function testLeaveReview() {
        //create user before with session started
        $email = 'abc12@abc.com';
        $session_id = '123456';

        User::create([
            'email' => $email,
            'password' => bcrypt('123123'),
            'session_id' => $session_id
        ]);

        Medicine::create([
            'title' => 'Abilify',
        ]);

        $response = $this->call('POST', '/storereview', array(
            '_token' => csrf_token(),
            'user_email' => $email,
            'medicine_name' => 'Abilify',
            'review_content' => 'Good Medicine',
            'rating' => 4,
            'session_id' => $session_id
        ));

        $this->assertEquals($response->getContent(), "Success!");
    }

    public function testLeaveReviewWrongSessionID() {
        //create user before with session started
        $email = 'abc12@abc.com';
        $session_id = '123456';

        User::create([
            'email' => $email,
            'password' => bcrypt('123123'),
            'session_id' => $session_id
        ]);

        Medicine::create([
            'title' => 'Abilify',
        ]);

        $response = $this->call('POST', '/storereview', array(
            '_token' => csrf_token(),
            'user_email' => $email,
            'medicine_name' => 'Abilify',
            'review_content' => 'Good Medicine',
            'rating' => 4,
            'session_id' => '123457'
        ));

        $this->assertEquals($response->getContent(), "Failure!");
    }

    public function testLeaveReviewWrongUser() {
        //create user before with session started
        $email = 'abc12@abc.com';
        $session_id = '123456';

        User::create([
            'email' => $email,
            'password' => bcrypt('123123'),
            'session_id' => $session_id
        ]);

        Medicine::create([
            'title' => 'Abilify',
        ]);

        $response = $this->call('POST', '/storereview', array(
            '_token' => csrf_token(),
            'user_email' => "abc11@abc.com",
            'medicine_name' => 'Abilify',
            'review_content' => 'Good Medicine',
            'rating' => 4,
            'session_id' => '123457'
        ));

        $this->assertEquals($response->getContent(), "Failure!");
    }

    public function testGetAverageRating() {
        Medicine::create([
            'title' => 'Abilify',
        ]);

        Review::create([
            'user_email' => 'abc@abc.com',
            'medicine_id' => 1,
            'review_content' => 'Not a good medicine',
            'rating' => 2
        ]);

        Review::create([
            'user_email' => 'abc2@abc.com',
            'medicine_id' => 1,
            'review_content' => 'Good medicine',
            'rating' => 4
        ]);

        $response = $this->call('GET', '/averagerating/Abilify');
        $this -> assertEquals($response->getContent(), 3);
    }

    public function testGetAverageRatingNonExistendMedicine() {
        Medicine::create([
            'title' => 'Abilify',
        ]);

        $response = $this->call('GET', '/averagerating/Nicotin');
        $this -> assertEmpty($response->getContent());
    }

    public function testGetAverageRatingNotRatetYet() {
        Medicine::create([
            'title' => 'Abilify',
        ]);
        $response = $this->call('GET', '/averagerating/Abilify');
        $this -> assertEquals($response->getContent(), 0);
    }

    public function testGetReview() {
        $email = 'abc2@abc.com';
        $medicine_name = 'Abilify';

        Medicine::create([
            'title' => $medicine_name,
        ]);

        Review::create([
            'user_email' => $email,
            'medicine_id' => 1,
            'review_content' => 'Good medicine',
            'rating' => 4
        ]);

        $response = $this->call('GET', '/getreview/'.$email.'/'.$medicine_name);
        $this -> assertEquals(json_decode($response->getContent()) -> review_content, 'Good medicine');
    }

    public function testGettingNonExistentReview() {
        $email = 'abc2@abc.com';
        $medicine_name = 'Abilify';

        Medicine::create([
            'title' => $medicine_name,
        ]);

        Review::create([
            'user_email' => $email,
            'medicine_id' => 1,
            'review_content' => 'Good medicine',
            'rating' => 4
        ]);

        $response = $this->call('GET', '/getreview/abc3@abc.com/'.$medicine_name);
        $this -> assertEquals($response->getContent(), null);
    }

    public function testGetReviews() {
        $medicine_name = 'Abilify';

        Medicine::create([
            'title' => $medicine_name,
        ]);

        Review::create([
            'user_email' => "abc@abc.com",
            'medicine_id' => 1,
            'review_content' => 'Good medicine',
            'rating' => 3
        ]);

        Review::create([
            'user_email' => "abc2@abc.com",
            'medicine_id' => 1,
            'review_content' => 'Very good medicine',
            'rating' => 4
        ]);

        $response = $this->call('GET', '/getreviews/'.$medicine_name);
        $this -> assertEquals(json_decode($response->getContent())[1] -> review_content, 'Very good medicine');
    }

    public function testGetReviewsNoReviews() {
        $medicine_name = 'Abilify';

        Medicine::create([
            'title' => $medicine_name,
        ]);

        $response = $this->call('GET', '/getreviews/'.$medicine_name);
        $this -> assertEquals(json_decode($response->getContent()), array());
    }

    public function testEditReview() {
        $medicine_name = 'Abilify';
        $email = "abc2@abc.com";
        $session_id = "123456";

        User::create([
            'email' => $email,
            'password' => bcrypt('123123'),
            'session_id' => $session_id
        ]);

        Medicine::create([
            'title' => $medicine_name,
        ]);

        Review::create([
            'user_email' => $email,
            'medicine_id' => 1,
            'review_content' => 'Very good medicine',
            'rating' => 4
        ]);

        $response = $this->call('POST', '/editreview', array(
            '_token' => csrf_token(),
            'user_email' => $email,
            'medicine_name' => $medicine_name,
            'review_content' => 'Fairly good medicine',
            'rating' => 3,
            'session_id' => $session_id
        ));

        $this->assertEquals($response->getContent(), "Success!");
    }

    public function testEditReviewBadSessionID() {
        $medicine_name = 'Abilify';
        $email = "abc2@abc.com";
        $session_id = "123456";

        User::create([
            'email' => $email,
            'password' => bcrypt('123123'),
            'session_id' => $session_id
        ]);

        Medicine::create([
            'title' => $medicine_name,
        ]);

        Review::create([
            'user_email' => $email,
            'medicine_id' => 1,
            'review_content' => 'Very good medicine',
            'rating' => 4
        ]);

        $response = $this->call('POST', '/editreview', array(
            '_token' => csrf_token(),
            'user_email' => $email,
            'medicine_name' => $medicine_name,
            'review_content' => 'Fairly good medicine',
            'rating' => 3,
            'session_id' => '123457'
        ));

        $this->assertEquals($response->getContent(), "Failure!");
    }

    public function testEditReviewBadUser() {
        $medicine_name = 'Abilify';
        $email = "abc2@abc.com";
        $session_id = "123456";

        User::create([
            'email' => $email,
            'password' => bcrypt('123123'),
            'session_id' => $session_id
        ]);

        Medicine::create([
            'title' => $medicine_name,
        ]);

        Review::create([
            'user_email' => $email,
            'medicine_id' => 1,
            'review_content' => 'Very good medicine',
            'rating' => 4
        ]);

        $response = $this->call('POST', '/editreview', array(
            '_token' => csrf_token(),
            'user_email' => "abc3@abc.com",
            'medicine_name' => $medicine_name,
            'review_content' => 'Fairly good medicine',
            'rating' => 3,
            'session_id' => '123457'
        ));

        $this->assertEquals($response->getContent(), "Failure!");
    }

}
