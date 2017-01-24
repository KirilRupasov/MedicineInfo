<?php
/**
 * Created by PhpStorm.
 * User: kiril
 * Date: 19/01/17
 * Time: 16:01
 */

namespace App\Http\Controllers;


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

            return $posts;
        }

        return null;
    }

    public function searchByBarcode($query) {

        if($query != "") {

            $posts = \App\Medicine::searchByQuery([
                "query" => [
                    "multi_match" => [
                        "fields" => ["title"],
                        "query" => $query,
                        "type" => "phrase_prefix"
                    ]
                ]], null, null, 5, null, null);

            return $posts;
        }

        return null;
    }

}