<template>
  <div class="base-check-group">
    <slot />
  </div>
</template>

<script setup>
import { provide, computed } from 'vue'

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
</script>