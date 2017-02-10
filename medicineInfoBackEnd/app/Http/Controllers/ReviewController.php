<?php
/**
 * Created by PhpStorm.
 * User: kiril
 * Date: 08/02/17
 * Time: 23:31
 */

namespace App\Http\Controllers;

use App\Medicine;
use App\Review;
use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent;

class ReviewController extends Controller
{
    public function leaveReview(Request $request) {
        $input = $request->all();
        if($input['user_email'] && $input['review_content'] && $input['medicine_name'] && $input['rating']) {
            //get medicine id


            $medicine = Medicine::where('title', trim($input['medicine_name']))->first();


        
            Review::create([
                'medicine_id' => $medicine->id,
                'review_content' => $input['review_content'],
                'user_email' => $input['user_email'],
                'rating' => '3'
            ]);

            return $input['rating'];
        } else {
            return "Failure";
        }
    }

    public function checkIfReviewExists($username) {
        $review = Review::where("user_email", $username) -> first();

        if($review) {
            return "true";
        } else {
            return "false";
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