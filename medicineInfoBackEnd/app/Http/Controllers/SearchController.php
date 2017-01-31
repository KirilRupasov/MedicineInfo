<?php
/**
 * Created by PhpStorm.
 * User: kiril
 * Date: 19/01/17
 * Time: 16:01
 */

namespace App\Http\Controllers;


use App\Medicine;
use Illuminate\Support\Facades\Log;

class SearchController extends Controller
{

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

                return $posts[0];

            } else if(sizeof($posts) > 0) {
                return $posts;
            } else {
                $cc = new CrawlerController();
                return $cc -> fetchData($query, true, false);
            }

        }

        return null;
    }

    public function searchByBarcode($query) {
        if($query != "") {
            $result = Medicine::where('barcode', $query)->first();

            if($result != "") {
                return $result;
            }


            $cc = new CrawlerController();
            return $cc -> fetchData($cc -> fetchTitleByBarcode($cc -> fetchBarcodes($query)), true, false) ;
        }



        return null;
    }

}