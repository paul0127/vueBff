<template>
  <div class="datePickerRange">
    <BaseYearPicker
      v-model="startTemp"
      :range-start="rangeStart"
      :range-end="minDate(model?.[1], rangeEnd)"
      @change="onChange"
      @blur="onChange"
    />
    ~
    <BaseYearPicker
      v-model="endTemp"
      :range-start="maxDate(model?.[0], rangeStart)"
      :range-end="rangeEnd"
      @change="onChange"
      @blur="onChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseYearPicker from './BaseDatePicker.vue'

const props = defineProps({
  rangeStart: Number, // yyyy
  rangeEnd: Number, // yyyy
})

const model = defineModel()
const emit = defineEmits(['change'])

const startTemp = ref(null)
const endTemp = ref(null)

const parse = (v) => (v ? new Date(v) : null)

// 傳回較小者（排除 null）
const minDate = (a, b) => {
  const d1 = parse(a)
  const d2 = parse(b)
  if (d1 && d2) return d1 < d2 ? format(d1) : format(d2)
  return format(d1 || d2)
}

// 傳回較大者（排除 null）
const maxDate = (a, b) => {
  const d1 = parse(a)
  const d2 = parse(b)
  if (d1 && d2) return d1 > d2 ? format(d1) : format(d2)
  return format(d1 || d2)
}

// 日期轉回 yyyy-mm-dd
const format = (d) => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

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
</script>

<style lang="scss" scoped>
.datePickerRange {
  display: flex;
}
</style>
