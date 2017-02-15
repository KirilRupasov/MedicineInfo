<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Review extends Model
{
    protected $table = "reviews";
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_email', 'review_content', 'medicine_id', 'rating'
    ];

    protected $hidden = [
        //none for now
    ];
}
