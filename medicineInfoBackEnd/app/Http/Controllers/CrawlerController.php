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




class CrawlerController extends Controller {
    /**
     * CrawlerController constructor
     *
     * constructor is using middleware to restrict its' usage to registered users only
     */
    public function __construct() {
        $this->middleware('auth');
    }

    /**
     * This function tries to get and store information  about 100 best selling durgs according to Drugs.com.
     *
     * @return string "Success! (count) drugs are stored" if function connected to Drugs.com and completed the operation,
     *  Otherwise -> "Resource down" message.
     *
     */
    public function fetchBestSellingDrugs() {
        //authorize user
        set_time_limit(300);

        $client = new Client(['base_url' => "https://www.drugs.com"]);
        $request = $client->get('https://www.drugs.com/stats/top100/sales');
        $count = 0;
        if($request->getStatusCode() == 200) {
            $content = $request->getBody()->getContents();
            $results = $this -> get_tagged_strings($content, "<b>", "</b>");
            foreach($results as $result) {
                $formatted = $this->get_string_between($result, "'>", "</a>");
                if ($formatted != "Start tag not found") {
                    $data = $this -> fetchData($formatted, true);
                    if ($data != "Wrong request" && (array_keys($data) !== range(0, count($data) - 1))) {


                        $medicine = Medicine::create([
                            'title' => $data['title'],
                            'description' => $data['description'],
                            'barcodes' => $data['barcodes'],
                            'side_effects' => $data['side_effects'],
                            'benefits' => $data['benefits'],
                            'elderly' => $data['elderly'],
                            'status' => $data['status'],
                            'stores' => $data['stores']
                        ]);
                        $medicine->addToIndex();
                        $count++;

                    }
                }
            }

            return "Success! ".$count." drugs are stored.";

        } else {
            return "Resource is down";
        }
    }

    /**
     * This function populates the database with 5 drugs from each list that correspond to letters of alphabet
     * There are 32 lists, corresponding to 32 letters A-Z, function fetches first 5 drugs from each list., resultion in 160 overall.
     *
     * @return string
     */
    public function fetchRandomDrugs() {
        set_time_limit(300);
        $client = new Client(['base_url' => "http://www.ema.europa.eu"]);
        $letters = range('A', 'Z');
        $counter_overall = 0;
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
                    if(!Medicine::where('title', trim($title))->first()) {
                        $data = $this->fetchDrugsFromPage($results[$counter_to_complete], $client, $title);
                        if ($data != "Wrong request" && (array_keys($data) !== range(0, count($data) - 1))) {
                            $medicine = Medicine::create([
                                'title' => $data['title'],
                                'description' => $data['description'],
                                'barcodes' => $data['barcodes'],
                                'side_effects' => $data['side_effects'],
                                'benefits' => $data['benefits'],
                                'elderly' => $data['elderly'],
                                'status' => $data['status']
                            ]);

                            $medicine->addToIndex();
                            $counter_overall++;
                        }


                    }
                    $counter_to_complete++;
                }
            }
        }
        return "Fetched ".$counter_to_complete." drugs";
    }

    /**
     * This function tries to find drug page by keywords on EMA website.
     *
     *
     * @param $query medicine name
     * @param $limitOne if true -> functions only loads first result, otherwise -> all results that matches keywords
     * @return array|string array of result(s) if found, string "Wrong request" otherwise
     */
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

    /**
     * This function loads all information about drug from its Page on EMA and EPAR document on that page
     *
     * @param $result string containing link to drug page
     * @param $client client that creates requests to EMA website and loads responses
     * @param $query medicine title
     * @return array array containing all needed drug information
     */
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
        $what_benefits_pos = 0;

        foreach ($headers as $key => $header) {
            if ((strpos($header, 'What is the risk associated') !== false) || (strpos($header, 'What are the risks associated') !== false)) {
                $side_effect_pos = $key;
            } else if (strpos($header, 'What benefit') !== false) {
                $what_benefits_pos = $key;
            }
        }

        $status = "withdrawn";

        if($approved) {
            $status = "approved";
        }

        $stores = "";
        if($this->checkIfAvailableInLloyds($title)) {
            $stores .= "lloyds pharmacy";
        }

        $response = [
            'title' => $query,
            'status' => $status,
            'elderly' => $add_info,
            'description' => $this->get_string_between($content, "<dd>", "</dd>"),
            'side_effects' => $this->get_string_between($content, "<dd>", "</dd>", $side_effect_pos + 1),
            'benefits' => $this->get_string_between($content, "<dd>", "</dd>", $what_benefits_pos + 1),
            'barcodes' => implode(",", $this->fetchBarcodesByTitle($title)),
            'stores' => $stores
        ];

        return $response;
    }

    /**
     * This function leads text from EPAR document provided
     *
     * @param $link link to EPAR document
     * @return null|string null if document not found/not loaded, otherwise -> string containing text
     */
    public function fetchEPAR($link) {
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
            return "";
        }
    }

    /**
     * This function fetches the information for elderly patients
     *
     * @param $text string containing all EPAR text
     * @return null|string string if information for elderly is found, null otherwise
     */
    public function fetchElderlyStatus($text) {
        $elderly = $this->get_string_between($text, "Elderly patients", ".");
        if(strpos($elderly, "(see") != false) {
            $elderly = substr($elderly, 0, strpos($elderly, "(see"));
        }
        return $elderly;
    }

    /**
     * This function gets barcodes by medicine title
     *
     * @param $query title of medicine
     * @return array|null array of barcodes if medcine found, null otherwise
     */
    public function fetchBarcodesByTitle($query) {
        try {
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
        } catch (\Exception $exception) {
            return [];
        }
    }

    /**
     * This function checks if given medicine can be obtained in Lloyds Pharmacy.
     *
     * @param $title title of medicine
     * @return bool true if it can be obtained, false if not or exception happened during the checks
     */
    public function checkIfAvailableInLloyds($title) {
        try {
            $client = new Client(['base_url' => "http://www.lloydspharmacy.com"]);
            $request = $client->get('http://www.lloydspharmacy.com/SearchDisplay?categoryId=&storeId=10151&catalogId=10152&langId=44&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=&beginIndex=0&pageSize=12&searchTerm='.$title.'#tabId:tab2');

            $body = $request->getBody()->getContents();

            if(strpos($body, "Sorry, we didn't find anything for") != false) {
                return false;
            } else if(strpos($body, "Prescriptions (") != false) {
                return true;
            } else {
                return false;
            }

        } catch (\Exception $exception) {
            return false;
        }
    }

    /**
     * This function get all occurencies of strings between tags within string
     *
     * @param $string string containing search strings
     * @param $start_tag start tag
     * @param $end_tag end tag
     * @return array array of matches
     */
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


    /**
     * This function returns string betweem tags extracted from larger string.
     *
     * @param $string string containing search string
     * @param $start start tag
     * @param $end end tag
     * @param int $occurence number of occurence to be returned, i.e. if value is 3 it is going to look for 3rd occurence (default=1)
     * @return null|string null if start tag or occurence not found, result string otherwise
     */
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

        if ($ini == 0) return null;
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;
        return substr($string, $ini, $len);
    }

}