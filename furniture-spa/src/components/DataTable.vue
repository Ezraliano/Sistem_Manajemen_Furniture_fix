<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">
            {{ column.label }}
          </th>
          <th v-if="showActions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td v-for="column in columns" :key="column.key">
            <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
              {{ formatCellValue(item[column.key], column.type) }}
            </slot>
          </td>
          <td v-if="showActions" class="space-x-2">
            <slot name="actions" :item="item">
              <SecondaryButton @click="$emit('view', item)" class="text-xs">
                View
              </SecondaryButton>
              <SecondaryButton @click="$emit('edit', item)" class="text-xs">
                Edit
              </SecondaryButton>
              <DangerButton @click="$emit('delete', item)" class="text-xs">
                Delete
              </DangerButton>
            </slot>
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length + (showActions ? 1 : 0)" class="text-center py-8 text-gray-500">
            No data available
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import SecondaryButton from './SecondaryButton.vue'
import DangerButton from './DangerButton.vue'

defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

defineEmits(['view', 'edit', 'delete'])

const formatCellValue = (value, type) => {
  if (value === null || value === undefined) return '-'
  
  switch (type) {
    case 'boolean':
      return value ? 'Yes' : 'No'
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value)
    case 'date':
      return new Date(value).toLocaleDateString()
    case 'datetime':
      return new Date(value).toLocaleString()
    default:
      return value
  }
}
</script>