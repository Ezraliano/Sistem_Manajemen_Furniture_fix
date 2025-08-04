<template>
  <div class="flex justify-center items-center" :class="containerClass">
    <div class="animate-spin rounded-full border-b-2 border-indigo-600" :class="spinnerClass"></div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  containerClass: {
    type: String,
    default: 'py-4'
  }
})

const spinnerClass = computed(() => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }
  return sizes[props.size] || sizes.md
})
</script>

<script>
import { computed } from 'vue'

export default {
  props: {
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    containerClass: {
      type: String,
      default: 'py-4'
    }
  },
  setup(props) {
    const spinnerClass = computed(() => {
      const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
      }
      return sizes[props.size] || sizes.md
    })

    return {
      spinnerClass
    }
  }
}
</script>