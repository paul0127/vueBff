<template>
  <div class="base-check-group">
    <slot />
  </div>
</template>

<script setup>
import { provide, useId, onMounted, inject } from 'vue'

const modelValue = defineModel()

provide('checkGroupContext', {
  modelValue,
  updateValue: (val) => {
    const current = modelValue.value || []

    if (current.includes(val)) {
      modelValue.value = current.filter((item) => item !== val)
    } else {
      modelValue.value = [...current, val]
    }
  },
})

const id = `check-${useId()}`
const addInputId = inject('addInputId')

onMounted(() => {
  if (typeof addInputId === 'function') {
    addInputId(id)
  }
})
</script>
