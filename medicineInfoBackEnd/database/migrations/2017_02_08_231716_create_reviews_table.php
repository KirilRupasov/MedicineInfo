<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReviewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->increments('id');
            $table->string('user_email')->unique();
            $table->integer('medicine_id')->unsigned();
            $table->string('review_content');
            $table->enum('rating', [0, 1, 2, 3, 4, 5])->default(2);
            $table->timestamps();
            $table->foreign('medicine_id')->references('id')->on('medicines')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reviews');
    }
}
