<template>
  <div class="datepicker" ref="picker">
    <input
      type="text"
      :value="displayText"
      readonly
      @click="toggle"
      placeholder="選擇民國日期"
    />

    <div v-if="open" class="calendar">
      <div class="calendar-header">
        <button @click="prevYear">« 年</button>
        <button @click="prevMonth">← 月</button>

        <span class="selector" @click="toggleYearMonthSelect">
          民國 {{ minguoYear }} 年 {{ currentMonth + 1 }} 月 ▾
        </span>

        <button @click="nextMonth">月 →</button>
        <button @click="nextYear">年 »</button>
      </div>

      <!-- Year Select -->
      <div v-if="showYearSelect" class="year-select">
        <div v-for="y in yearRange" :key="y" @click="selectYear(y)">
          民國 {{ y }} 年
        </div>
      </div>

      <!-- Month Select -->
      <div v-if="showMonthSelect" class="month-select">
        <div v-for="(m, i) in 12" :key="i" @click="selectMonth(i)">
          {{ i + 1 }} 月
        </div>
      </div>

      <transition name="fade">
        <div class="calendar-grid" :key="`${currentYear}-${currentMonth}`">
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
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: Date
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const selectedDate = ref(props.modelValue ?? null)

const today = new Date()
const currentYear = ref(selectedDate.value?.getFullYear() ?? today.getFullYear())
const currentMonth = ref(selectedDate.value?.getMonth() ?? today.getMonth())

const days = ['日', '一', '二', '三', '四', '五', '六']
const minguoYear = computed(() => currentYear.value - 1911)

const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate())
const startOffset = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay())

const displayText = computed(() => {
  if (!selectedDate.value) return ''
  const y = selectedDate.value.getFullYear() - 1911
  const m = selectedDate.value.getMonth() + 1
  const d = selectedDate.value.getDate()
  return `民國 ${y} 年 ${m} 月 ${d} 日`
})

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

const selectDate = (day) => {
  const date = new Date(currentYear.value, currentMonth.value, day)
  selectedDate.value = date
  emit('update:modelValue', date)
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

const toggle = () => {
  open.value = !open.value
  showMonthSelect.value = false
  showYearSelect.value = false
}

const picker = ref(null)
const handleClickOutside = (e) => {
  if (picker.value && !picker.value.contains(e.target)) {
    open.value = false
    showMonthSelect.value = false
    showYearSelect.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

watch(() => props.modelValue, (val) => {
  selectedDate.value = val
  if (val) {
    currentYear.value = val.getFullYear()
    currentMonth.value = val.getMonth()
  }
})

const showMonthSelect = ref(false)
const showYearSelect = ref(false)

const toggleYearMonthSelect = () => {
  showMonthSelect.value = !showMonthSelect.value
  showYearSelect.value = !showYearSelect.value
}

const selectMonth = (m) => {
  currentMonth.value = m
  showMonthSelect.value = false
}

const yearRange = computed(() => Array.from({ length: 61 }, (_, i) => i + 90))
const selectYear = (minguo) => {
  currentYear.value = minguo + 1911
  showYearSelect.value = false
}
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
  width: 260px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
  padding: 8px;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 6px;
  font-weight: bold;
}
.selector {
  cursor: pointer;
  user-select: none;
}
.year-select,
.month-select {
  max-height: 140px;
  overflow-y: auto;
  margin: 4px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 4px 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}
.year-select div,
.month-select div {
  text-align: center;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
}
.year-select div:hover,
.month-select div:hover {
  background-color: #eee;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-top: 8px;
}
.day-name {
  text-align: center;
  font-size: 0.8rem;
  color: #666;
}
.day {
  text-align: center;
  padding: 6px;
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
