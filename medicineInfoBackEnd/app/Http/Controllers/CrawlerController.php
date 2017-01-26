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
        $pdf = $parser->parseFile("http://www.ema.europa.eu/docs/en_GB/document_library/EPAR_-_Product_Information/human/000165/WC500025821.pdf");
        //$text = $pdf->getText();
        $pages = $pdf->getPages();
        $text = "";

        foreach ($pages as $page) {
            $text .= $page->getText();
        }


        $text = nl2br($text, false);
        return $this->fetchBarcodes();

    }

    public function fetchSideEffects($text) {
        $side_effects = $this->get_string_between($text, "4.  Possible side effects  ", "Reporting of side effects", 1);
        return $side_effects;
    }

    public function fetchBenefits($text) {
        $benefits = $this->get_string_between($text, "is and what it is used for", "2.  What you need to know before you", 2);
        return $benefits;
    }

    public function fetchBarcodes() {
        $client = new Client(['base_url' => "http://www.itembarcode.com"]);
        $request = $client->get('http://www.itembarcode.com/search-barcode-data?search_api_views_fulltext=mabthera');

        $body = $request->getBody()->getContents();
        //$results = $this->get_tagged_strings($body, '<td class="views-field views-field-title">', '</td>');
        $results = $this->get_tagged_strings($body, "<td class=\"views-field views-field-title\" >", "</td>");

        return $results;

    }

    public function get_tagged_strings($string, $start_tag, $end_tag) {
        $string = ' ' . $string;
        $results = [];
        $ini = 0;

        while(strpos($string, $start_tag, $ini + strlen($start_tag)) != false) {
            $ini = strpos($string, $start_tag, $ini + strlen($start_tag));
            $len = strpos($string, $end_tag, $ini) - $ini;
            $result = substr($string, $ini, $len);
            preg_match_all('!\d+!', $result, $matches);
            $results[] = $matches[0][0];
        }

        return $results;
    }

    public function get_string_between($string, $start, $end, $occurence=1){
        $string = ' ' . $string;
        $ini = strpos($string, $start);

        for($i=1; $i<$occurence; $i++) {
            $ini = strpos($string, $start, $ini + strlen($start));
        }

        if ($ini == 0) return '';
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;
        return substr($string, $ini, $len);
    }

}