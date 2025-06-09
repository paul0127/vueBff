<template>
  <div class="datepicker" ref="picker">
    <input
      type="text"
      :value="displayText"
      readonly
      @click="toggle"
      placeholder="選擇民國日期區間"
    />

    <div v-if="open" class="calendar">
      <!-- 顯示目前選擇區間 -->
      <div class="calendar-range-display">{{ displayText || '請選擇日期區間' }}</div>

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
        <div v-for="y in yearRange" :key="y" @click="selectYear(y)">民國 {{ y }} 年</div>
      </div>

      <!-- Month Select -->
      <div v-if="showMonthSelect" class="month-select">
        <div v-for="(m, i) in 12" :key="i" @click="selectMonth(i)">{{ i + 1 }} 月</div>
      </div>

      <transition name="fade">
        <div class="calendar-grid" :key="`${currentYear}-${currentMonth}`">
          <div class="day-name" v-for="d in days" :key="d">{{ d }}</div>
          <div v-for="n in startOffset" :key="'blank-' + n" class="day blank"></div>
          <div
            v-for="day in daysInMonth"
            :key="day"
            class="day"
            :class="{ selected: isSelected(day), inRange: isInRange(day) }"
            @click="selectDate(day)"
          >
            {{ day }}
          </div>
        </div>
      </transition>

      <div class="footer">
        <button class="apply" @click="applyDateRange" :disabled="!startDate || !endDate">確認</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const startDate = ref(props.modelValue?.startDate ?? null)
const endDate = ref(props.modelValue?.endDate ?? null)

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())

const days = ['日', '一', '二', '三', '四', '五', '六']

const minguoYear = computed(() => currentYear.value - 1911)

const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate())
const startOffset = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay())

const formatDate = (date) => {
  if (!date) return ''
  const y = date.getFullYear() - 1911
  const m = date.getMonth() + 1
  const d = date.getDate()
  return ` ${y} / ${m} / ${d}`
}

const displayText = computed(() => {
  if (!startDate.value && !endDate.value) return ''
  if (startDate.value && endDate.value) return `${formatDate(startDate.value)} 到 ${formatDate(endDate.value)}`
  if (startDate.value) return ` ${formatDate(startDate.value)}`
  if (endDate.value) return ` ${formatDate(endDate.value)}`
  return ''
})

const toggle = () => {
  open.value = !open.value
  showMonthSelect.value = false
  showYearSelect.value = false
}

// 自動判斷選擇開始/結束日期
const selecting = ref('start')
const selectDate = (day) => {
  const date = new Date(currentYear.value, currentMonth.value, day)

  if (!startDate.value || (startDate.value && endDate.value)) {
    startDate.value = date
    endDate.value = null
    selecting.value = 'end'
  } else if (selecting.value === 'end') {
    if (date < startDate.value) {
      endDate.value = startDate.value
      startDate.value = date
    } else {
      endDate.value = date
    }
    selecting.value = 'start'
  }
}

const isSelected = (day) => {
  const date = new Date(currentYear.value, currentMonth.value, day)
  return (
    (startDate.value &&
      startDate.value.getFullYear() === date.getFullYear() &&
      startDate.value.getMonth() === date.getMonth() &&
      startDate.value.getDate() === date.getDate()) ||
    (endDate.value &&
      endDate.value.getFullYear() === date.getFullYear() &&
      endDate.value.getMonth() === date.getMonth() &&
      endDate.value.getDate() === date.getDate())
  )
}

const isInRange = (day) => {
  if (!startDate.value || !endDate.value) return false
  const date = new Date(currentYear.value, currentMonth.value, day)
  return date > startDate.value && date < endDate.value
}

const applyDateRange = () => {
  if (startDate.value && endDate.value) {
    emit('update:modelValue', {
      startDate: startDate.value,
      endDate: endDate.value
    })
    open.value = false
  }
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

const showMonthSelect = ref(false)
const showYearSelect = ref(false)

const toggleYearMonthSelect = () => {
  showMonthSelect.value = !showMonthSelect.value
  showYearSelect.value = !showYearSelect.value
}

const yearRange = computed(() => Array.from({ length: 61 }, (_, i) => i + 90))
const selectYear = (minguo) => {
  currentYear.value = minguo + 1911
  showYearSelect.value = false
}
const selectMonth = (m) => {
  currentMonth.value = m
  showMonthSelect.value = false
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
</script>

<style scoped>
.datepicker {
  position: relative;
  display: inline-block;
}
.calendar {
  position: absolute;
  top: 110%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 10px;
  z-index: 10;
  width: 280px;
  border-radius: 6px;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 5px;
  gap: 4px;
}
.selector {
  cursor: pointer;
  padding: 2px 6px;
  background-color: #f0f0f0;
  border-radius: 4px;
}
.year-select,
.month-select {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin: 8px 0;
}
.year-select div,
.month-select div {
  padding: 4px;
  background: #eee;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
}
.year-select div:hover,
.month-select div:hover {
  background: #ddd;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin: 8px 0;
}
.day-name {
  font-size: 0.8rem;
  text-align: center;
  font-weight: bold;
  user-select: none;
}
.day {
  padding: 8px 0;
  text-align: center;
  cursor: pointer;
  border-radius: 6px;
  user-select: none;
  background: #f9f9f9;
  transition: background-color 0.2s ease;
}
.day:hover {
  background: #e0e0e0;
}
.day.selected {
  background: #007bff;
  color: white;
  font-weight: 700;
}
.day.inRange {
  background-color: #cce4ff;
  border-radius: 0;
}
.day.blank {
  background: transparent;
  cursor: default;
}
.calendar-range-display {
  margin-bottom: 8px;
  font-weight: 600;
  text-align: center;
  color: #333;
}
.footer {
  display: flex;
  justify-content: flex-end;
}
button.apply {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.3s ease;
}
button.apply:disabled {
  background-color: #bbb;
  cursor: not-allowed;
}
button.apply:hover:enabled {
  background-color: #0056b3;
}

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
