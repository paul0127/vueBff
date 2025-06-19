<template>
  <div class="base-radio-group d-flex align-items-center">
    <slot />
  </div>
</template>

<script setup>
import { provide, computed } from 'vue'

const modelValue = defineModel()

provide('radioGroupContext', {
  modelValue,
  updateValue: (val) => {
    modelValue.value = val
  }
})
</script>