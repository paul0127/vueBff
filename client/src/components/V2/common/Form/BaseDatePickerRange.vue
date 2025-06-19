<template>
  <div class="datePickerRange">
    <BaseDatePicker v-model="model[0]" @change="change" />
    ~
    <BaseDatePicker v-model="model[1]" @change="change" />
  </div>
</template>
<script setup>
import BaseDatePicker from './BaseDatePicker.vue'

const model = defineModel()

const emit = defineEmits(['change'])
const change = () => {
  emit('change')
}
</script>
<style lang="scss" scoped>
.datePickerRange {
  display: flex;
}
</style>