<template>
  <div class="datePickerRange">
    <BaseYearPicker
      v-model="startTemp"
      :rangeStart="rangeStart"
      :rangeEnd="minNumber(endTemp, rangeEnd)"
      @change="onChange"
      @blur="onChange"
    />
    ~
    <BaseYearPicker
      v-model="endTemp"
      :rangeStart="maxNumber(startTemp, rangeStart)"
      :rangeEnd="rangeEnd"
      @change="onChange"
      @blur="onChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseYearPicker from './BaseYearPicker.vue'

// 🧩 Props 接收 yyyy-mm-dd 字串
const props = defineProps({
  rangeStart: Number, // 2010
  rangeEnd: Number,   // 2020
})

// 🧩 v-model: [number, number]
const model = defineModel()
const emit = defineEmits(['change'])

const startTemp = ref(null)
const endTemp = ref(null)

const minNumber = (d1, d2) => {
  return d1 && d2 ? (d1 < d2 ? d1 : d2) : d1 || d2
}

const maxNumber = (d1, d2) => {
  return d1 && d2 ? (d1 > d2 ? d1 : d2) : d1 || d2
}

// 同步外部 model 到內部 temp
watch(
  model,
  (val) => {
    startTemp.value = val?.[0] ?? null
    endTemp.value = val?.[1] ?? null
  },
  { immediate: true }
)

// 處理變更，只有合法年份才設定
const onChange = () => {
  if (startTemp.value && endTemp.value) {
    model.value = [startTemp.value, endTemp.value]
    emit('change', model.value)
  } else {
    model.value = null
  }
}
</script>

<style lang="scss" scoped>
.datePickerRange {
  display: flex;
  gap: 4px;
}
</style>
