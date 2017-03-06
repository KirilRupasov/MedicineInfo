<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMedicinesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('medicines', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title')->unique();
            $table->text('barcodes')->nullable();
            $table->text('description')->nullable();
            $table->text('side_effects')->nullable();
            $table->text('benefits')->nullable();
            $table->text('elderly')->nullable();
            $table->enum('status',['approved','withdrawn'])->default('approved');
            $table->text('stores')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('medicines');
    }
}
