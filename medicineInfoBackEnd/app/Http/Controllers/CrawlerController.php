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
    public function fetchDataByBarcode($query) {
        $client = new Client(['base_url' => "http://www.itembarcode.com"]);
        $request = $client->get('http://www.itembarcode.com/search-barcode-data?search_api_views_fulltext='.$query);
    }

    public function fetchData($query) {
        $title = strtolower(trim($query));
        $client = new Client(['base_url' => "http://www.ema.europa.eu"]);

        $request = $client->get('www.ema.europa.eu/ema/index.jsp?curl=pages%2Fmedicines%2Flanding%2Fepar_search.jsp&mid=WC0b01ac058001d124&searchTab=searchByKey&alreadyLoaded=true&isNewQuery=true&status=Authorised&status=Withdrawn&status=Suspended&status=Refused&keyword='.$title.'&keywordSearch=Submit&searchType=name&taxonomyPath=&treeNumber=&searchGenericType=generics');
        //return 'www.ema.europa.eu/ema/index.jsp?curl=pages%2Fmedicines%2Flanding%2Fepar_search.jsp&mid=WC0b01ac058001d124&searchTab=searchByKey&alreadyLoaded=true&isNewQuery=true&status=Authorised&status=Withdrawn&status=Suspended&status=Refused&keyword='.$title.'&keywordSearch=Submit&searchType=name&taxonomyPath=&treeNumber=&searchGenericType=generics';

        if($request->getStatusCode() == 200) {
            $content = $request->getBody()->getContents();
            $results = $this->get_tagged_strings($content, "<th scope=\"row\" class=\"key-detail name word-wrap\">", "</th>");
            //return $results;
            if(sizeof($results) == 1) {
                $links = [];
                $link = $this->get_string_between($results[0], "href=\"", "\">");

                $request = $client->get('www.ema.europa.eu/ema/'.$link);
                $content = $request -> getBody() -> getContents();
                $text = $this->get_string_between($content, "<dl class=\"toggle-list\">", "</dl>");

                $headers = $this->get_tagged_strings($text, "<a title=\"Link title\" href=\"#\">", "</a>");

                $side_effect_pos = 0;

                foreach($headers as $key=>$header) {


                    if ((strpos($header, 'What is the risk associated') !== false) || (strpos($header, 'What are the risks associated') !== false)) {
                        $side_effect_pos = $key;
                        break;
                    }
                }
                //return $headers;

                return response()->json([
                    'title' => $query,
                    'description' => $this->get_string_between($content, "<dd>", "</dd>"),
                    'side_effects' => $this->get_string_between($content, "<dd>", "</dd>", $side_effect_pos+1),
                    'barcodes' => implode(",", $this->fetchBarcodesByTitle($this->fetchBarcodes($title)))
                ]);



                //preg_match("/docs\/en_GB\/document_library\/EPAR_-_Product_Information\/human\/[0-9]+\/WC[0-9]+/", $content, $matches);

                //$link = $matches[0].".pdf";
                //return $this -> fetchRecord($link, $query);
            } else if(sizeof($results) > 0) {
                return $results;
            } else {
                return "Wrong request";
            }

        }

        return "Wrong request";

    }



    public function fetchRecord($link, $title) {
        // Parse pdf file and build necessary objects.
        $parser = new \Smalot\PdfParser\Parser();
        $pdf = $parser->parseFile("http://www.ema.europa.eu/".$link);

        if($pdf->getPages() == 0) {
            return "Wrong request";
        }

        $text = $pdf->getText();

        //$text = nl2br($text, false);
        //$text = trim(preg_replace('/\t+/', ' ', $text));

        $text = str_replace("  ", " ", $text);
        $text = str_replace("4.  Possible side effects", "4.Possible side effects", $text);
        $text = str_replace("4. Possible side effects", "4.Possible side effects", $text);
        $text = str_replace("2.  What you need to know before you", "2.What you need to know before you", $text);
        $text = str_replace("2. What you need to know before you", "2.What you need to know before you", $text);

        return response()->json([
            'title' => $title,
            'side_effects' => $this->fetchSideEffects($text),
            'description' => $this->fetchBenefits($text),
            'barcodes' => implode(",", $this->fetchBarcodes($title))
        ]);

    }

    public function fetchSideEffects($text) {
        $side_effects = $this->get_string_between($text, "4.Possible side effects", "Reporting of side effects", 2);
        return $side_effects;
    }

    public function fetchBenefits($text) {
        $benefits = $this->get_string_between($text, "what it is used for", "2.What you need to know before you", 2);
        return $benefits;
    }

    public function fetchBarcodesByTitle($body) {
        $results = $this->get_tagged_strings($body, "<td class=\"views-field views-field-title\" >", "</td>");
        $results_formatted = [];

        foreach($results as $result) {
            preg_match_all('!\d+!', $result, $matches);
            $results_formatted[] = $matches[0][0];
        }


        return $results_formatted;
    }

    public function fetchTitleByBarcode($body) {
        $result = $this->get_string_between($body, "<td class=\"views-field views-field-body\" >", "</td>");


        $first_num = -1;
        $num_loc = 0;

        $result2 = str_split($result);

        foreach ($result2 AS $a_char) {
            if (is_numeric($a_char)) {
                $first_num = $num_loc;
                break;
            }
            $num_loc++;
        }

        $title = substr($result, 0, $first_num-1);

        return trim($title);
    }

    public function fetchBarcodes($query) {
        $client = new Client(['base_url' => "http://www.itembarcode.com"]);
        $request = $client->get('http://www.itembarcode.com/search-barcode-data?search_api_views_fulltext='.$query);

        $body = $request->getBody()->getContents();

        return $body;



    }

    public function get_tagged_strings($string, $start_tag, $end_tag) {
        $string = ' ' . $string;
        $results = [];
        $ini = 0;

        while(strpos($string, $start_tag, $ini) != false) {
            $ini = strpos($string, $start_tag, $ini) + strlen($start_tag);
            $len = strpos($string, $end_tag, $ini) - $ini;
            //$result = $len;
            $result = substr($string, $ini, $len);
            $results[] = $result;
        }

        return $results;

        /*$string = " ".$string;
        $ini = strpos($string,$start);
        if ($ini == 0) return "";
        $ini += strlen($start);
        $len = strpos($string,$end,$ini) - $ini;
        return substr($string,$ini,$len);*/

    }


    public function get_string_between($string, $start, $end, $occurence=1){
        $string = ' ' . $string;
        $ini = strpos($string, $start);

        if($ini === false) {
            return "Start tag not found";
        }

        for($i=1; $i<$occurence; $i++) {
            $ini = strpos($string, $start, $ini + strlen($start));
            if($ini === false) {
                return "Start tag not found";
            }
        }

        if ($ini == 0) return '';
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;
        return substr($string, $ini, $len);
    }

}