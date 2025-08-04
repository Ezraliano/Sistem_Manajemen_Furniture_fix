<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Furniture Management</h1>
        <p class="mt-2 text-sm text-gray-600">Manage your furniture inventory with ease</p>
      </div>

      <div class="bg-white p-8 shadow-xl rounded-lg">
        <slot />
      </div>
    </div>
  </div>
</template>