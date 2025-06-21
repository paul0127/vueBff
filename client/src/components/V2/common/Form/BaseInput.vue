<template>
  <input
    :type="type"
    v-model="model"
    :id="id"
    :disabled="disabled"
    class="form-control"
    :style="{ width: width }"
    @input="onInput"
    @blur="onBlur"
  />
</template>
<script setup>
import { onMounted, inject, useId } from 'vue'

const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
  type: {
    type: String,
    default: 'text',
  },
  width: {
    type: String,
    default: '100%',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const model = defineModel()
const emit = defineEmits(['change'])

const elFormItem = inject('elFormItem', null)

const onBlur = (e) => {
  elFormItem?.validate?.('blur')
}

const onInput = (e) => {
  elFormItem?.validate?.('change')
}

const id = props.id || `input-${useId()}`
const addInputId = inject('addInputId')

onMounted(() => {
  if (typeof addInputId === 'function') {
    addInputId(id)
  }
})
</script>
