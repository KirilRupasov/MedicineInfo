<?php
/**
 * Created by PhpStorm.
 * User: kiril
 * Date: 25/01/17
 * Time: 16:30
 */

namespace App\Http\Controllers;

use GuzzleHttp\Client;




class CrawlerController extends Controller
{

    public function fetchData() {

        // Parse pdf file and build necessary objects.
        $parser = new \Smalot\PdfParser\Parser();
        $client = new Client();
        $pdf = $parser->parseFile("http://www.ema.europa.eu/docs/en_GB/document_library/EPAR_-_Product_Information/human/000165/WC500025821.pdf");
        $text = $pdf->getText();
        return $text;
    }

}