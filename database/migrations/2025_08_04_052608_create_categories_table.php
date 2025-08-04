<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique(); // Field UUID
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true); // Field Boolean
            $table->timestamps();
            $table->softDeletes(); // Untuk fitur Soft Deletes
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
