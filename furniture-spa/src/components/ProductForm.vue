<template>
  <form @submit.prevent="$emit('submit')" class="space-y-6">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label for="name" class="form-label">Name *</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="form-input"
          :class="{ 'border-red-300': errors.name }"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
      </div>

      <div>
        <label for="category_id" class="form-label">Category *</label>
        <v-select
          v-model="form.category_id"
          :options="categories"
          :reduce="category => category.id"
          label="name"
          placeholder="Select a category"
          class="form-select"
          :class="{ 'border-red-300': errors.category_id }"
        />
        <p v-if="errors.category_id" class="mt-1 text-sm text-red-600">{{ errors.category_id[0] }}</p>
      </div>

      <div>
        <label for="price" class="form-label">Price *</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            id="price"
            v-model="form.price"
            type="number"
            step="0.01"
            min="0"
            required
            class="form-input pl-7"
            :class="{ 'border-red-300': errors.price }"
          />
        </div>
        <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price[0] }}</p>
      </div>

      <div>
        <label for="stock" class="form-label">Stock *</label>
        <input
          id="stock"
          v-model="form.stock"
          type="number"
          min="0"
          required
          class="form-input"
          :class="{ 'border-red-300': errors.stock }"
        />
        <p v-if="errors.stock" class="mt-1 text-sm text-red-600">{{ errors.stock[0] }}</p>
      </div>
    </div>

    <div>
      <label for="description" class="form-label">Description</label>
      <textarea
        id="description"
        v-model="form.description"
        rows="4"
        class="form-input"
        :class="{ 'border-red-300': errors.description }"
      ></textarea>
      <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description[0] }}</p>
    </div>

    <div>
      <label for="attachment" class="form-label">PDF Attachment</label>
      <input
        id="attachment"
        ref="fileInput"
        type="file"
        accept=".pdf"
        @change="handleFileChange"
        class="form-input"
        :class="{ 'border-red-300': errors.attachment_path || fileError }"
      />
      <p class="mt-1 text-xs text-gray-500">
        Upload a PDF file (100KB - 500KB)
      </p>
      <p v-if="errors.attachment_path" class="mt-1 text-sm text-red-600">{{ errors.attachment_path[0] }}</p>
      <p v-if="fileError" class="mt-1 text-sm text-red-600">{{ fileError }}</p>
    </div>

    <div class="flex items-center">
      <input
        id="is_available"
        v-model="form.is_available"
        type="checkbox"
        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
      />
      <label for="is_available" class="ml-2 block text-sm text-gray-900">
        Available for sale
      </label>
    </div>

    <div>
      <label for="specifications" class="form-label">Specifications (JSON)</label>
      <textarea
        id="specifications"
        v-model="specificationsText"
        rows="4"
        placeholder='{"material": "Wood", "dimensions": "120x80x75cm", "weight": "25kg"}'
        class="form-input font-mono text-sm"
        :class="{ 'border-red-300': errors.specifications || specificationsError }"
      ></textarea>
      <p class="mt-1 text-xs text-gray-500">
        Enter specifications as JSON format
      </p>
      <p v-if="errors.specifications" class="mt-1 text-sm text-red-600">{{ errors.specifications[0] }}</p>
      <p v-if="specificationsError" class="mt-1 text-sm text-red-600">{{ specificationsError }}</p>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    default: () => []
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const fileInput = ref(null)
const fileError = ref('')
const specificationsError = ref('')

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const specificationsText = ref('')

// Watch for changes in specifications text and validate JSON
watch(specificationsText, (newValue) => {
  specificationsError.value = ''
  
  if (!newValue.trim()) {
    form.value.specifications = null
    return
  }

  try {
    const parsed = JSON.parse(newValue)
    form.value.specifications = parsed
  } catch (error) {
    specificationsError.value = 'Invalid JSON format'
    form.value.specifications = null
  }
})

// Initialize specifications text from form data
onMounted(() => {
  if (form.value.specifications) {
    specificationsText.value = JSON.stringify(form.value.specifications, null, 2)
  }
})

const handleFileChange = (event) => {
  const file = event.target.files[0]
  fileError.value = ''

  if (!file) {
    form.value.attachment = null
    return
  }

  // Validate file type
  if (file.type !== 'application/pdf') {
    fileError.value = 'Please select a PDF file'
    fileInput.value.value = ''
    form.value.attachment = null
    return
  }

  // Validate file size (100KB - 500KB)
  const minSize = 100 * 1024 // 100KB
  const maxSize = 500 * 1024 // 500KB

  if (file.size < minSize) {
    fileError.value = 'File size must be at least 100KB'
    fileInput.value.value = ''
    form.value.attachment = null
    return
  }

  if (file.size > maxSize) {
    fileError.value = 'File size must not exceed 500KB'
    fileInput.value.value = ''
    form.value.attachment = null
    return
  }

  form.value.attachment = file
}
</script>

<style>
.vs__dropdown-toggle {
  @apply border border-gray-300 rounded-md shadow-sm;
}

.vs__dropdown-toggle:focus-within {
  @apply border-indigo-500 ring-1 ring-indigo-500;
}

.vs__selected {
  @apply text-gray-900;
}

.vs__search {
  @apply text-gray-900;
}

.vs__search::placeholder {
  @apply text-gray-500;
}

.vs__dropdown-menu {
  @apply border border-gray-300 rounded-md shadow-lg;
}

.vs__dropdown-option {
  @apply px-3 py-2 text-gray-900;
}

.vs__dropdown-option--highlight {
  @apply bg-indigo-600 text-white;
}
</style>