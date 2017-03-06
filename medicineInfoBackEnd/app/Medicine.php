<?php
/**
 * Created by PhpStorm.
 * User: kiril
 * Date: 19/01/17
 * Time: 16:23
 */

namespace App;

use Elasticquent\ElasticquentTrait;
use Illuminate\Database\Eloquent\Model;


class Medicine extends Model
{
    use ElasticquentTrait;

    public $timestamps = false;

    protected $table = 'medicines';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'description', 'side_effects', 'barcodes', 'elderly', 'benefits', 'status', 'stores'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        //none for now
    ];

    protected $mappingProperties = array(
        'title' => [
            'type' => 'string',
            "analyzer" => "standard",
        ],
        'description' => [
            'type' => 'string',
            "analyzer" => "standard",
        ],
        'side_effects' => [
            'type' => 'string',
            "analyzer" => "standard",
        ],
        'barcodes' => [
            'type' => 'string',
            "analyzer" => "standard",
        ]
    );

    /**
     * The elasticsearch settings.
     *
     * @var array
     * */

    protected $indexSettings = [
        'analysis' => [
            'char_filter' => [
                'replace' => [
                    'type' => 'mapping',
                    'mappings' => [
                        '&=> and '
                    ],
                ],
            ],
            'filter' => [
                'word_delimiter' => [
                    'type' => 'word_delimiter',
                    'split_on_numerics' => false,
                    'split_on_case_change' => true,
                    'generate_word_parts' => true,
                    'generate_number_parts' => true,
                    'catenate_all' => true,
                    'preserve_original' => true,
                    'catenate_numbers' => true,
                ]
            ],
            'analyzer' => [
                'default' => [
                    'type' => 'custom',
                    'char_filter' => [
                        'html_strip',
                        'replace',
                    ],
                    'tokenizer' => 'whitespace',
                    'filter' => [
                        'lowercase',
                        'word_delimiter',
                    ],
                ],
            ],
        ],
    ];

    function getIndexName(){
        return "medicine_index";
    }
}