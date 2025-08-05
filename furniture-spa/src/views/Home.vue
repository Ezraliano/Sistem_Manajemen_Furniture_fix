<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          Selamat Datang di Sistem Manajemen Furniture
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Sederhanakan manajemen inventori furniture Anda dengan solusi komprehensif kami. 
          Lacak produk, kelola kategori, proses pesanan, dan pertahankan kontrol penuh 
          atas bisnis furniture Anda.
        </p>
        
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <router-link
            to="/login"
            class="btn-primary inline-block px-8 py-3 text-lg"
          >
            Mulai Sekarang
          </router-link>
          <a
            href="#features"
            class="btn-secondary inline-block px-8 py-3 text-lg"
          >
            Pelajari Lebih Lanjut
          </a>
        </div>
      </div>
      
      <div id="features" class="mt-20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CubeIcon class="w-8 h-8 text-indigo-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Manajemen Produk</h3>
            <p class="text-gray-600">
              Kelola inventori furniture Anda secara efisien dengan informasi produk yang detail, 
              kategori, dan pelacakan stok.
            </p>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCartIcon class="w-8 h-8 text-indigo-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Pemrosesan Pesanan</h3>
            <p class="text-gray-600">
              Tangani pesanan pelanggan dengan lancar menggunakan manajemen pesanan yang komprehensif 
              dan kemampuan pelacakan.
            </p>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon class="w-8 h-8 text-indigo-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Manajemen Pengguna</h3>
            <p class="text-gray-600">
              Kontrol akses dengan izin berbasis peran dan fitur manajemen pengguna 
              yang komprehensif.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CubeIcon, ShoppingCartIcon, UsersIcon } from '@heroicons/vue/24/outline'
</script>