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

const onBlur = (e) => {
  emit('change', e)
}

const onInput = (e) => {
  emit('change', e)
}
</script>