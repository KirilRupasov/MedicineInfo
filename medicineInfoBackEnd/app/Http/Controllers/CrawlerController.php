<?php
/**
 * Created by PhpStorm.
 * User: kiril
 * Date: 25/01/17
 * Time: 16:30
 */

namespace App\Http\Controllers;

use App\Medicine;
use ClientException;
use GuzzleHttp\Client;
use League\Flysystem\Exception;


class CrawlerController extends Controller
{

    public function fetchBestSellingDrugs() {
        //authorize user


        set_time_limit(300);

        $client = new Client(['base_url' => "https://www.drugs.com"]);
        $request = $client->get('https://www.drugs.com/stats/top100/sales');

        if($request->getStatusCode() == 200) {
            $content = $request->getBody()->getContents();
            $results = $this -> get_tagged_strings($content, "<b>", "</b>");
            $formatted_results = [];
            foreach($results as $result) {
                $formatted = $this->get_string_between($result, "'>", "</a>");
                if ($formatted != "Start tag not found") {
                    $data = $this->fetchData($formatted, true);
                    if ($data != "Wrong request" && (array_keys($data) !== range(0, count($data) - 1))) {
                        $medicine = Medicine::create([
                            'title' => $data['title'],
                            'description' => $data['description'],
                            'barcodes' => $data['barcodes'],
                            'side_effects' => $data['side_effects'],
                            'how_does_it' => $data['how_does_it'],
                            'benefits' => $data['benefits'],
                            'elderly' => $data['elderly'],
                            'status' => $data['status']
                        ]);
                        $medicine->addToIndex();

                    }
                }
            }

            return "Success!";

        } else {
            return "Resource is down";
        }
    }

    public function fetchRandomDrugs() {
        set_time_limit(300);
        $client = new Client(['base_url' => "http://www.ema.europa.eu"]);

        $letters = range('A', 'Z');

        foreach ($letters as $letter) {
            $request = $client -> get('http://www.ema.europa.eu/ema/index.jsp?curl=pages%2Fmedicines%2Flanding%2Fepar_search.jsp&mid=WC0b01ac058001d124&searchTab=&alreadyLoaded=true&isNewQuery=true&status=Authorised&status=Withdrawn&status=Suspended&status=Refused&startLetter='.$letter.'&keyword=Enter+keywords&searchType=name&taxonomyPath=&treeNumber=&searchGenericType=generics');

            if($request->getStatusCode() == 200) {
                $content = $request->getBody()->getContents();
                $results = $this->get_tagged_strings($content, "<th scope=\"row\" class=\"key-detail name word-wrap\">", "</th>");

                if(sizeof($results) > 5) {
                    $number_to_reach = 6;
                } else {
                    $number_to_reach = sizeof($results);
                }

                $counter_to_complete = 0;

                while($counter_to_complete < $number_to_reach) {
                    $title = $this->get_string_between($results[$counter_to_complete], "\">", "</a>");
                    if(Medicine::where('title', trim($title))->first() == null) {
                        //return $title;
                        $data = $this->fetchDrugsFromPage($results[$counter_to_complete], $client, $title);
                        if ($data != "Wrong request" && (array_keys($data) !== range(0, count($data) - 1))) {
                            //return $data;
                            $medicine = Medicine::create([
                                'title' => $data['title'],
                                'description' => $data['description'],
                                'barcodes' => $data['barcodes'],
                                'side_effects' => $data['side_effects'],
                                'how_does_it' => $data['how_does_it'],
                                'benefits' => $data['benefits'],
                                'elderly' => $data['elderly'],
                                'status' => $data['status']
                            ]);

                            $medicine->addToIndex();
                        }


                    }
                    $counter_to_complete++;
                }
            }
        }

        return "Success!";


    }

    public function fetchDataByBarcode($query) {
        try {
            $client = new Client(['base_url' => "http://www.itembarcode.com"]);
            $request = $client->get('http://www.itembarcode.com/search-barcode-data?search_api_views_fulltext='.$query);
        } catch(\Exception $exception) {
            return null;
        }

    }

    public function fetchData($query, $limitOne) {
        $title = strtolower(trim($query));
        $client = new Client(['base_url' => "http://www.ema.europa.eu"]);

        $request = $client->get('www.ema.europa.eu/ema/index.jsp?curl=pages%2Fmedicines%2Flanding%2Fepar_search.jsp&mid=WC0b01ac058001d124&searchTab=searchByKey&alreadyLoaded=true&isNewQuery=true&status=Authorised&status=Withdrawn&status=Suspended&status=Refused&keyword='.$title.'&keywordSearch=Submit&searchType=name&taxonomyPath=&treeNumber=&searchGenericType=generics');

        if($request->getStatusCode() == 200) {
            $content = $request->getBody()->getContents();
            $results = $this->get_tagged_strings($content, "<th scope=\"row\" class=\"key-detail name word-wrap\">", "</th>");
            if(sizeof($results) == 1 || ($limitOne && sizeof($results) > 1)) {
                return $this->fetchDrugsFromPage($results[0], $client, $query);
            } else if(sizeof($results) > 0) {
                $final_results = [];
                foreach ($results as $value) {
                    $final_results[]['title'] = $this->get_string_between($value, "\">", "</a>");
                }

                return $final_results;
            } else {
                return "Wrong request";
            }

        }

        return "Wrong request";

    }

    public function fetchDrugsFromPage($result, $client, $query) {
        $title = strtolower(trim($query));
        $link = $this->get_string_between($result, "href=\"", "\">");
        $request = $client->get('www.ema.europa.eu/ema/'.$link);
        $content = $request -> getBody() -> getContents();
        $text = $this->get_string_between($content, "<dl class=\"toggle-list\">", "</dl>");
        $approved = false;

        if(strpos($content, "status Authorised") !== false) {
            $approved = true;
        }

        $headers = $this->get_tagged_strings($text, "<a title=\"Link title\" href=\"#\">", "</a>");
        preg_match("/docs\/en_GB\/document_library\/EPAR_-_Product_Information\/human\/[0-9]+\/WC[0-9]+/", $content, $matches);


        if ($approved && (sizeof($matches) > 0)) {
            $link = $matches[0] . ".pdf";
            $add_info = $this->fetchEPAR($link, $title);
        } else {
            $add_info = "";
        }


        $side_effect_pos = 0;
        $how_does_pos = 0;
        $what_benefits_pos = 0;

        foreach ($headers as $key => $header) {
            if ((strpos($header, 'What is the risk associated') !== false) || (strpos($header, 'What are the risks associated') !== false)) {
                $side_effect_pos = $key;
            } else if (strpos($header, 'How does') !== false) {
                $how_does_pos = $key;
            } else if (strpos($header, 'What benefit') !== false) {
                $what_benefits_pos = $key;
            }
        }

        $status = "withdrawn";

        if ($approved) {
            $status = "approved";
        }

        $response = [
            'title' => $query,
            'status' => $status,
            'elderly' => $add_info,
            'description' => $this->get_string_between($content, "<dd>", "</dd>"),
            'side_effects' => $this->get_string_between($content, "<dd>", "</dd>", $side_effect_pos + 1),
            'how_does_it' => $this->get_string_between($content, "<dd>", "</dd>", $how_does_pos + 1),
            'benefits' => $this->get_string_between($content, "<dd>", "</dd>", $what_benefits_pos + 1),
            'barcodes' => implode(",", $this->fetchBarcodesByTitle($this->fetchBarcodes($title)))
        ];

        return $response;
    }



    public function fetchEPAR($link, $title) {
        try {
            // Parse pdf file and build necessary objects.
            $parser = new \Smalot\PdfParser\Parser();
            $pdf = $parser->parseFile("http://www.ema.europa.eu/" . $link);

            if ($pdf->getText() == null || $pdf->getText() == "") {
                return "Wrong request";
            }

            $text = $pdf->getText();
            return $this->fetchElderlyStatus($text);
        } catch (\Exception $exception) {
            return null;
        }

    }

    public function fetchElderlyStatus($text) {
        $elderly = $this->get_string_between($text, "Elderly patients", ".");
        if(strpos($elderly, "(see") != false) {
            $elderly = substr($elderly, 0, strpos($elderly, "(see"));
        }
        return $elderly;
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
        try {
            $client = new Client(['base_url' => "http://www.itembarcode.com"]);
            $request = $client->get('http://www.itembarcode.com/search-barcode-data?search_api_views_fulltext='.$query);

            $body = $request->getBody()->getContents();

            return $body;
        } catch (\Exception $exception) {
            return null;
        }


    }


    public function get_tagged_strings($string, $start_tag, $end_tag) {
        $string = ' ' . $string;
        $results = [];
        $ini = 0;

        while(strpos($string, $start_tag, $ini) != false) {
            $ini = strpos($string, $start_tag, $ini) + strlen($start_tag);
            $len = strpos($string, $end_tag, $ini) - $ini;
            $result = substr($string, $ini, $len);
            $results[] = $result;
        }

        return $results;
    }


    public function get_string_between($string, $start, $end, $occurence=1){
        $string = ' ' . $string;
        $ini = strpos($string, $start);

        if($ini === false) {
            return null;
        }

        for($i=1; $i<$occurence; $i++) {
            $ini = strpos($string, $start, $ini + strlen($start));
            if($ini === false) {
                return null;
            }
        }

        if ($ini == 0) return '';
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;
        return substr($string, $ini, $len);
    }

}