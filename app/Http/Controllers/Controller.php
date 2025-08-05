<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // ... (fungsi register tidak perlu diubah)

    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $userRole = Role::where('name', 'user')->first();

        if (!$userRole) {
            return response()->json(['message' => 'Default user role not found.'], 500);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $userRole->id,
        ]);

        Auth::login($user);

        // Muat relasi role setelah login
        $user->load('role');

        return response()->json($user);
    }


    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();

            // --- TAMBAHKAN BAGIAN INI ---
            // Ambil user yang sedang login dan muat relasi rolenya
            $user = Auth::user()->load('role');
            return response()->json($user);
            // --- AKHIR BAGIAN TAMBAHAN ---
        }

        throw ValidationException::withMessages([
            'email' => [__('auth.failed')],
        ]);
    }

    // ... (fungsi logout tidak perlu diubah)
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->noContent();
    }
}
