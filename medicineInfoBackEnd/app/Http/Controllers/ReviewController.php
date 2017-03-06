<?php

namespace App\Http\Controllers;

use App\Medicine;
use App\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Review Controller
    |--------------------------------------------------------------------------
    | This controller handles reviews
    |
    */

    public function __construct()
    {
    }

    /**
     * This method stores new review if all parameters are found and user jas not
     * left review before
     * Otherwise it returns "Failure" message
     *
     * @param Request $request HTTP POST request containing user email, medicine name, and review
     * @return string  "Success" if review was successfully stored, failure otherwise
     */
    public function leaveReview(Request $request) {
        $input = $request->all();
        if(
            $input['user_email'] &&
            $input['review_content'] &&
            $input['medicine_name'] &&
            $input['rating'] &&
            $this->checkIfReviewExists($input['user_email'], $input['medicine_name']) == "false"
        ) {
            //if all parameters are found and user has not left review before -> store review
            $medicine = Medicine::where('title', trim($input['medicine_name']))->first();
            Review::create([
                'medicine_id' => $medicine->id,
                'review_content' => $input['review_content'],
                'user_email' => $input['user_email'],
                'rating' => $input['rating']
            ]);

            return "Success";
        } else {
            return "Failure";
        }
    }

    public static function getAverageRating($medicinename) {
        $medicinename = str_replace("%20", " ", $medicinename);
        $medicine = Medicine::where('title', $medicinename)->first();
        $reviews = Review::where('medicine_id', $medicine->id)->get();

        if(count($reviews) > 0) {
            $ratingSum = 0;
            $ratingCount = 0;
            for($x=0; $x<count($reviews); $x++) {
                $ratingCount++;
                $ratingSum += $reviews[$x] -> rating;
            }

            return $ratingSum/$ratingCount;
        } else {
            return 0;
        }




    }

    public function editReview(Request $request) {
        $input = $request->all();
        if(
            $input['user_email'] &&
            $input['review_content'] &&
            $input['medicine_name'] &&
            $input['rating']
        ) {
            $medicine = Medicine::where('title', trim($input['medicine_name']))->first();
            Review::where([
                ["user_email", '=', $input['user_email']],
                ["medicine_id", "=", $medicine->id]
            ])-> update([
                "review_content" => $input['review_content'],
                "rating" => $input['rating']
            ]);

            return "Success";
        } else {
            return "Failure";
        }
    }

    public function checkIfReviewExists($username, $medicinename) {
        if($this->getReview($username, $medicinename)) {
            return "true";
        } else {
            return "false";
        }
    }

    public function getReview($username, $medicinename) {
        $medicine = Medicine::where("title", $medicinename)->first();
        if($medicine) {
            return Review::where([["user_email", '=', $username], ["medicine_id", "=", $medicine->id]])->first();
        } else {
            return null;
        }
    }


    public function getReviews($title) {
        $medicine = Medicine::where('title', $title)->first();
        $reviews = Review::where('medicine_id', $medicine->id)->get();
        $reviews_array = [];
        for($x=0; $x<count($reviews); $x++) {
            $reviews_array[] = [
                "medicine_name" => $title,
                "review_content" => $reviews[$x] -> review_content,
                "rating" => $reviews[$x] -> rating,
                "user_email" => $reviews[$x] -> user_email
            ];
        }

        return response()->json($reviews_array);
    }
}