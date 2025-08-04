<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            // RELASI: Foreign key ke tabel 'users'
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->dateTime('order_date'); // Field Datetime
            $table->decimal('total_amount', 15, 2);
            $table->string('status')->default('pending');
            $table->json('shipping_details')->nullable();
            $table->boolean('is_paid')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};