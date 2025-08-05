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
        // Get roles
        $adminRole = Role::where('name', 'admin')->first();
        $userRole = Role::where('name', 'user')->first();

        // Create admin user
        if ($adminRole) {
            User::create([
                'name' => 'Administrator',
                'email' => 'admin@furniture.com',
                'password' => Hash::make('admin123'),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
            ]);
        }

        // Create regular user
        if ($userRole) {
            User::create([
                'name' => 'Pengguna Biasa',
                'email' => 'user@furniture.com',
                'password' => Hash::make('user123'),
                'role_id' => $userRole->id,
                'email_verified_at' => now(),
            ]);
        }
    }
}