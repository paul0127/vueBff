<template>
  <label class="base-radio d-flex align-items-center">
    <input
      type="radio"
      class="form-check-input"
      :value="radioValue"
      :checked="isChecked"
      @keyup.enter="onChange"
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

const context = inject('radioGroupContext')

const radioValue = computed(() => props.value ?? props.label)

const isChecked = computed(() => context?.modelValue?.value === radioValue.value)

const onChange = () => {
  context?.updateValue(radioValue.value)
}
</script>
<style lang="scss" scoped>
.base-radio {
    margin-right: 10px;
}
</style>