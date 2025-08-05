<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Panggil RoleSeeder PERTAMA agar tabel roles terisi
        $this->call(RoleSeeder::class);

        // Panggil UserSeeder KEDUA, yang akan menggunakan roles yang sudah ada
        $this->call(UserSeeder::class);

        // Anda bisa menambahkan seeder lain di sini jika perlu
        // $this->call(ProductSeeder::class);
        // $this->call(CategorySeeder::class);
    }
}
