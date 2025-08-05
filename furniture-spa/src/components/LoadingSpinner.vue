<script setup>
import { computed } from 'vue';

// --- TAMBAHKAN BAGIAN INI UNTUK MENDEFINISIKAN PROPS ---
const props = defineProps({
  size: {
    type: String,
    default: 'md', // sm, md, lg
  },
  color: {
    type: String,
    default: 'indigo',
  },
  containerClass: {
    type: String,
    default: 'flex justify-center items-center',
  },
});
// --- AKHIR BAGIAN TAMBAHAN ---

const sizeClass = computed(() => {
  return {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }[props.size];
});

const colorClass = computed(() => {
  return {
    indigo: 'text-indigo-600',
    white: 'text-white',
    gray: 'text-gray-600',
  }[props.color];
});
</script>

<template>
  <div :class="containerClass">
    <svg
      class="animate-spin"
      :class="[sizeClass, colorClass]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
</template>
