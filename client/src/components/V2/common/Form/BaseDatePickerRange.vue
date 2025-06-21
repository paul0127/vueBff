<template>
  <div class="datePickerRange">
    <BaseDatePicker v-model="startTemp" @change="onChange" @blur="onBlur" />
    ~
    <BaseDatePicker v-model="endTemp" @change="onChange" @blur="onBlur" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseDatePicker from './BaseDatePicker.vue'

const model = defineModel()
const emit = defineEmits(['change'])

const startTemp = ref(null)
const endTemp = ref(null)

// 初始同步 model 到暫存
watch(
  model,
  (val) => {
    startTemp.value = val?.[0] ?? null
    endTemp.value = val?.[1] ?? null
  },
  { immediate: true }
)

const onChange = () => {
  if (startTemp.value && endTemp.value) {
    model.value = [startTemp.value, endTemp.value]
    emit('change', model.value)
  } else {
    model.value = null
  }
}

const onBlur = () => {
  
}
</script>

<style lang="scss" scoped>
.datePickerRange {
  display: flex;
}
</style>
