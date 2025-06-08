<template>
  <input
    class="form-control"
    v-model="model"
    @input="onInput"
    @blur="onBlur"
  />
</template>

<script setup>
const model = defineModel()
const emit = defineEmits([ 'blur', 'input'])

const onInput = (e) => {
  emit('input', e)
}

const onBlur = (e) => {
  emit('blur', e)
}
</script>
