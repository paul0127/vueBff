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
        <span>
            民國 {{ minguoYear }} 年 {{ currentMonth + 1 }} 月
        </span>
        <button @click="nextMonth">月 →</button>
        <button @click="nextYear">年 »</button>
      </div>

      <div class="calendar-grid">
        <div class="day-name" v-for="d in days" :key="d">{{ d }}</div>
        <div
          v-for="n in startOffset"
          :key="'blank-' + n"
          class="day blank"
        ></div>
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

// define model
const props = defineProps({
  modelValue: Date
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const selectedDate = ref(props.modelValue ?? null)

const today = new Date()
const currentYear = ref(selectedDate.value?.getFullYear() ?? today.getFullYear())
const currentMonth = ref(selectedDate.value?.getMonth() ?? today.getMonth())

// 星期（日到六）
const days = ['日', '一', '二', '三', '四', '五', '六']

// 民國年
const minguoYear = computed(() => currentYear.value - 1911)

// 每月天數
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

// 本月第一天是星期幾
const startOffset = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

// 顯示格式
const displayText = computed(() => {
  if (!selectedDate.value) return ''
  const y = selectedDate.value.getFullYear() - 1911
  const m = selectedDate.value.getMonth() + 1
  const d = selectedDate.value.getDate()
  return `民國 ${y} 年 ${m} 月 ${d} 日`
})

// 切換月份
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

// 切換年
const prevYear = () => {
  currentYear.value--
}

const nextYear = () => {
  currentYear.value++
}

// 選擇日期
const selectDate = (day) => {
  const date = new Date(currentYear.value, currentMonth.value, day)
  selectedDate.value = date
  emit('update:modelValue', date)
  open.value = false
}

// 是否已選中
const isSelected = (day) => {
  if (!selectedDate.value) return false
  return (
    selectedDate.value.getFullYear() === currentYear.value &&
    selectedDate.value.getMonth() === currentMonth.value &&
    selectedDate.value.getDate() === day
  )
}

// 切換 popup
const toggle = () => {
  open.value = !open.value
}

// 關閉 popup 點外面
const picker = ref(null)
const handleClickOutside = (e) => {
  if (picker.value && !picker.value.contains(e.target)) {
    open.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 外部值變更時同步更新
watch(() => props.modelValue, (val) => {
  selectedDate.value = val
  if (val) {
    currentYear.value = val.getFullYear()
    currentMonth.value = val.getMonth()
  }
})
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
