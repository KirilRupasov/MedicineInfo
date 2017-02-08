<?php
/**
 * Created by PhpStorm.
 * User: kiril
 * Date: 08/02/17
 * Time: 23:31
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function leaveReview(Request $request) {
        $input = $request->all();
        if($input['user_email'] && $input['review_content'] && $input['medicine_name']) {
            //get medicine id
        }
    }
}