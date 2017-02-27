<?php
/**
 * Created by PhpStorm.
 * User: kiril
 * Date: 19/01/17
 * Time: 16:01
 */

namespace App\Http\Controllers;


use App\Medicine;

class SearchController extends Controller {

    /*
    |--------------------------------------------------------------------------
    | Search Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles search requests for medicines.
    |
    */

    /**
     * This method searches medicines by title letters and returns matching results
     *
     * @param $query medicine title letters
     * @return \Elasticquent\ElasticquentResultCollection|mixed|null collection of Medicines if more than one are found, one Medicine if only one match, null if nothing found
     */
    public function searchByTitle($query) {
        if($query != "") {
            $posts = \App\Medicine::searchByQuery([
                "query" => [
                    "multi_match" => [
                        "fields" => ["title"],
                        "query" => $query,
                        "type" => "phrase_prefix"
                    ]
                ]], null, null, 5, null, null);

            if(sizeof($posts) == 1) {
                $posts[0]->rating = ReviewController::getAverageRating($posts[0]->title);
                return $posts[0];
            } else if(sizeof($posts) > 0) {
                return $posts;
            } else {
                return null;
            }
        } else {
            return null;
        }


    }

    /**
     * This method returns medicine that exactly matches the barcode sequence provided.
     *
     * @param $query the barcode consisting of digits
     * @return array medicine that has that barcode assigned
     */
    public function searchByBarcode($query) {
        if($query != "") {
            $result = Medicine::where('barcodes','like', '%'.$query.'%')->first();

            if($result != "") {
                return $result;
            }
        }
        return [];
    }

}