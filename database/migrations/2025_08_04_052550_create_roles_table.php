<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name')->unique(); // e.g., 'Administrator', 'User'
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes(); // Untuk fitur Soft Deletes
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
