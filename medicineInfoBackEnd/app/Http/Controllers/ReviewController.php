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
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function leaveReview(Request $request) {
        $input = $request->all();
        if($input['user_email'] && $input['review_content'] && $input['medicine_name']) {
            //get medicine id
            $medicine = Medicine::where('title', trim($input['medicine_name']))->first();
            Review::create([
                'medicine_id' => $medicine->id,
                'review_content' => $input['review_content'],
                'user_email' => $input['user_email']
            ]);
            return "Success";
        } else {
            return $input['user_email'] . ";". $input['review_content'] . ";" . $input['medicine_name'];
        }
    }
}