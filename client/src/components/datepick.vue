<template>
  <div class="datepicker" ref="picker">
    <input
      type="text"
      v-model="inputText"
      @blur="onBlur"
      @keyup.enter="onBlur"
      @focus="open = true"
      placeholder="民國 113-06-06"
    />

    <div v-if="open" class="calendar">
      <div class="calendar-header">
        <button @click="prevYear">« 年</button>
        <button @click="prevMonth">← 月</button>
        <span>民國 {{ minguoYear }} 年 {{ currentMonth + 1 }} 月</span>
        <button @click="nextMonth">月 →</button>
        <button @click="nextYear">年 »</button>
      </div>

      <div class="calendar-grid">
        <div class="day-name" v-for="d in days" :key="d">{{ d }}</div>
        <div v-for="n in startOffset" :key="'blank-' + n" class="day blank"></div>
        <div
          v-for="day in daysInMonth"
          :key="day"
          class="day"
          :class="{ selected: isSelected(day) }"
          @click="selectDate(day)"
        >
          {{ day }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const model = defineModel() // 父層傳入 v-model

const open = ref(false)
const selectedDate = ref(null)
const inputText = ref('')

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())

const days = ['日', '一', '二', '三', '四', '五', '六']

const minguoYear = computed(() => currentYear.value - 1911)

const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate())

const startOffset = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay())

const formatMinguoYMD = (date) => {
  const y = date.getFullYear() - 1911
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const parseMinguoYMD = (str) => {
  const match = str.match(/^(\d{2,3})-(\d{1,2})-(\d{1,2})$/)
  if (!match) return null
  const y = parseInt(match[1]) + 1911
  const m = parseInt(match[2]) - 1
  const d = parseInt(match[3])
  const date = new Date(y, m, d)
  return isNaN(date.getTime()) ? null : date
}

// 選擇日曆
const selectDate = (day) => {
  const date = new Date(currentYear.value, currentMonth.value, day)
  selectedDate.value = date
  model.value = date
  inputText.value = formatMinguoYMD(date)
  open.value = false
}

const isSelected = (day) => {
  if (!selectedDate.value) return false
  return (
    selectedDate.value.getFullYear() === currentYear.value &&
    selectedDate.value.getMonth() === currentMonth.value &&
    selectedDate.value.getDate() === day
  )
}

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}
const prevYear = () => currentYear.value--
const nextYear = () => currentYear.value++

// 當使用者手動輸入後離開 input，觸發解析
const onBlur = () => {
  const parsed = parseMinguoYMD(inputText.value)
  if (parsed) {
    selectedDate.value = parsed
    currentYear.value = parsed.getFullYear()
    currentMonth.value = parsed.getMonth()
    model.value = parsed
  }
}

// 外部 v-model 傳入更新
watch(
  () => model.value,
  (val) => {
    if (typeof val === 'string') {
      const parsed = new Date(val)
      selectedDate.value = parsed
    } else if (val instanceof Date) {
      selectedDate.value = val
    }

    if (selectedDate.value && !isNaN(selectedDate.value.getTime())) {
      inputText.value = formatMinguoYMD(selectedDate.value)
      currentYear.value = selectedDate.value.getFullYear()
      currentMonth.value = selectedDate.value.getMonth()
    }
  },
  { immediate: true }
)

// 點外部關閉 popup
const picker = ref(null)
const handleClickOutside = (e) => {
  if (picker.value && !picker.value.contains(e.target)) {
    open.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.datepicker {
  position: relative;
  display: inline-block;
  font-family: sans-serif;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  width: 200px;
  cursor: pointer;
}

.calendar {
  position: absolute;
  top: 110%;
  background: white;
  border: 1px solid #ccc;
  width: 350px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f7f7f7;
  font-weight: bold;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 8px;
}

.day-name {
  font-size: 0.8rem;
  text-align: center;
  color: #666;
  margin-bottom: 4px;
}

.day {
  text-align: center;
  padding: 6px;
  margin: 2px;
  border-radius: 4px;
  cursor: pointer;
}

.day:hover {
  background-color: #eee;
}

.day.selected {
  background-color: #007bff;
  color: white;
}

.blank {
  visibility: hidden;
}
</style>
