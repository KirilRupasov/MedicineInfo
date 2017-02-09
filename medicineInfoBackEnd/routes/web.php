<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/
Route::get('/',  function () {
    return 'Hello World';
});
Route::get('/title/{query}', "SearchController@searchByTitle");

Route::get('/barcode/{query}', "SearchController@searchByBarcode");
Route::get('/crawler/fetch/{query}', "CrawlerController@fetchData");
Route::get('/crawler/fetchBestSellingDrugs', 'CrawlerController@fetchBestSellingDrugs');
Route::get('/crawler/fetchRandomDrugs', 'CrawlerController@fetchRandomDrugs');

Route::get('/login', 'Auth\LoginController@getLoginForm');
Route::post('/verify', 'Auth\LoginController@verifyUser');
Route::get('/setuser', 'Auth\LoginController@createUser');

Route::post('/storereview', 'ReviewController@leaveReview');