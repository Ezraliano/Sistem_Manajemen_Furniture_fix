<template>
  <button
    :type="type"
    :disabled="disabled"
    class="btn-primary"
    :class="[
      disabled && 'opacity-50 cursor-not-allowed',
      $attrs.class
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>