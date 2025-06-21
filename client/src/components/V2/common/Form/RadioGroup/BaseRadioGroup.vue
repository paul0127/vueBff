<template>
  <div :id="id" class="base-radio-group d-flex align-items-center">
    <slot />
  </div>
</template>

<script setup>
import { provide, useId, onMounted, inject } from 'vue'

const modelValue = defineModel()

provide('radioGroupContext', {
  modelValue,
  updateValue: (val) => {
    modelValue.value = val
  },
})

const id = `radio-${useId()}`
const addInputId = inject('addInputId')

onMounted(() => {
  if (typeof addInputId === 'function') {
    addInputId(id)
  }
})
</script>
