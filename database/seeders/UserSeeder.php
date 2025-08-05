<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cari role 'admin' yang sudah dibuat oleh RoleSeeder
        $adminRole = Role::where('name', 'admin')->first();

        // Buat user admin
        if ($adminRole) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'), // Password default adalah 'password'
                'role_id' => $adminRole->id,
            ]);
        }
    }
}