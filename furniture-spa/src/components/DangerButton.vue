<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'btn-danger',
      disabled && 'opacity-50 cursor-not-allowed'
    ]"
    @click="$emit('click')"
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

defineEmits(['click'])
</script>