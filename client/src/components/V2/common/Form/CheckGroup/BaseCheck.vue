<template>
  <label class="base-check">
    <input
      type="checkbox"
      class="form-check-input"
      :value="checkValue"
      :checked="isChecked"
      @change="onChange"
    />
    <span><slot /></span>
  </label>
</template>

<script setup>
import { inject, computed } from 'vue'

const props = defineProps({
  value: [String, Number, Boolean],
  label: [String, Number],
})

const emit = defineEmits(['change'])

const modelValue = defineModel()

const context = inject('checkGroupContext')

const checkValue = computed(() => props.value ?? props.label)

const isChecked = computed(() => {
  if (context) {
    const val = context.modelValue.value
    return Array.isArray(val)
      ? val.includes(checkValue.value)
      : val === checkValue.value
  } else {
    return modelValue.value === true || modelValue.value === checkValue.value
  }
})

const elFormItem = inject('elFormItem', null)

const onChange = (e) => {
  const checked = e.target.checked
  if (context) {
    context?.updateValue(checkValue.value)
  } else {
    modelValue.value = checked ? checkValue.value : false
  }
  elFormItem?.validate?.('change')
}
</script>
<style lang="scss" scoped>
.base-check {
  height: 42px;
  display: flex;
  align-items: center;
}
</style>
