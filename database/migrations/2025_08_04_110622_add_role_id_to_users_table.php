<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // RELASI: Tambahkan kolom foreign key 'role_id' setelah kolom 'id'
            $table->foreignId('role_id')
                  ->after('id') // Opsional: untuk posisi kolom yang rapi
                  ->constrained('roles')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Hapus relasi dan kolom jika migrasi di-rollback
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });
    }
};
