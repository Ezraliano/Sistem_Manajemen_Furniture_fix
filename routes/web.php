<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Named login route for Laravel authentication redirects
Route::get('/login', function () {
    return response()->json(['message' => 'Please login via the SPA application'], 401);
})->name('login');

// CSRF cookie route for Sanctum SPA authentication
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});
