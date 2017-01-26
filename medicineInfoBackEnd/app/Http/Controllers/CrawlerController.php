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

    public function fetchData($query) {
        $title = strtolower($query);

        //let's try to fetch something
        $letters = [];
        $client = new Client(['base_url' => "http://www.ema.europa.eu"]);

        $request = $client->get('www.ema.europa.eu/ema/index.jsp?curl=pages%2Fmedicines%2Flanding%2Fepar_search.jsp&mid=WC0b01ac058001d124&searchTab=searchByKey&alreadyLoaded=true&isNewQuery=true&status=Authorised&status=Withdrawn&status=Suspended&status=Refused&keyword='.$title.'&keywordSearch=Submit&searchType=name&taxonomyPath=&treeNumber=&searchGenericType=generics');
        $content = $request->getBody()->getContents();
        $results = $this->get_tagged_strings($content, "<th scope=\"row\" class=\"key-detail name word-wrap\">", "</th>");
        $links = [];
        $link = $this->get_string_between($results[0], "href=\"", "\">");

        $request = $client->get('www.ema.europa.eu/ema/'.$link);
        $content = $request -> getBody() -> getContents();
        preg_match("/docs\/en_GB\/document_library\/EPAR_-_Product_Information\/human\/[0-9]+\/WC[0-9]+/", $content, $matches);

        $link = $matches[0].".pdf";
        return $this -> fetchRecord($link, $query);
    }

    public function fetchRecord($link, $title) {
        // Parse pdf file and build necessary objects.
        $parser = new \Smalot\PdfParser\Parser();
        $pdf = $parser->parseFile("http://www.ema.europa.eu/".$link);
        //$text = $pdf->getText();
        $pages = $pdf->getPages();
        $text = "";

        foreach ($pages as $page) {
            $text .= $page->getText();
        }

        $text = nl2br($text, false);

        return response()->json([
            'title' => $title,
            'side_effects' => $this->fetchSideEffects($text),
            'description' => $this->fetchBenefits($text),
            'barcodes' => implode(",", $this->fetchBarcodes($title))
        ]);

    }

    public function fetchSideEffects($text) {
        $side_effects = $this->get_string_between($text, "4.  Possible side effects ", "Reporting of side effects", 2);
        return $side_effects;
    }

    public function fetchBenefits($text) {
        $benefits = $this->get_string_between($text, "is and what it is used for", "2.  What you need to know before you", 2);
        return $benefits;
    }

    public function fetchBarcodes($query) {
        $client = new Client(['base_url' => "http://www.itembarcode.com"]);
        $request = $client->get('http://www.itembarcode.com/search-barcode-data?search_api_views_fulltext='.$query);

        $body = $request->getBody()->getContents();
        $results = $this->get_tagged_strings($body, "<td class=\"views-field views-field-title\" >", "</td>");
        $results_formatted = [];

        foreach($results as $result) {
            preg_match_all('!\d+!', $result, $matches);
            $results_formatted[] = $matches[0][0];
        }


        return $results_formatted;

    }

    public function get_tagged_strings($string, $start_tag, $end_tag) {
        $string = ' ' . $string;
        $results = [];
        $ini = 0;

        while(strpos($string, $start_tag, $ini + strlen($start_tag)) != false) {
            $ini = strpos($string, $start_tag, $ini + strlen($start_tag));
            $len = strpos($string, $end_tag, $ini) - $ini;
            $result = substr($string, $ini + strlen($start_tag), $len);
            $results[] = $result;
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