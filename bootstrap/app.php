<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors; // <-- 1. TAMBAHKAN INI

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // --- AWAL DARI KODE YANG DIPERBARUI ---

        // Menambahkan middleware CORS ke semua rute.
        // Ini akan menangani header 'Access-Control-Allow-Origin'.
        $middleware->use([
             HandleCors::class,
        ]);

        // Middleware ini memastikan bahwa rute API Anda akan menggunakan session state,
        // yang penting untuk otentikasi SPA dengan Sanctum.
        $middleware->statefulApi();

        // Menambahkan middleware Sanctum ke grup 'api'.
        // Ini akan memeriksa setiap permintaan API untuk memastikan otentikasi valid.
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        // Memberi pengecualian pada rute CSRF cookie Sanctum dari verifikasi token CSRF.
        $middleware->validateCsrfTokens(except: [
            'sanctum/csrf-cookie',
        ]);

        // --- AKHIR DARI KODE YANG DIPERBARUI ---
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
