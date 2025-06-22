<template>
  <div class="datepicker" ref="picker">
    <input
      class="form-control"
      type="text"
      :id="id"
      v-model="inputText"
      :disabled="disabled"
      @blur="onBlur"
      @keyup.enter="onEnter"
      @keydown.tab="onTab"
      @focus="open = true"
      placeholder=""
    />

    <div v-if="open" class="calendar">
      <div class="calendar-header">
        <button @click.prevent="prevYear" :disabled="!canPrevYear">«</button>
        <button @click.prevent="prevMonth" :disabled="!canPrevMonth">←</button>
        <span>民國 {{ minguoYear }} 年 {{ currentMonth + 1 }} 月</span>
        <button @click.prevent="nextMonth" :disabled="!canNextMonth">→</button>
        <button @click.prevent="nextYear" :disabled="!canNextYear">»</button>
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
          :class="{
            selected: isSelected(day),
            'range-start': isRangeStart(day),
            'range-end': isRangeEnd(day),
            'in-range': isInRange(day),
            'out-of-range': !isInRange(day),
          }"
          @click="isInRange(day) && selectDate(day)"
        >
          {{ day }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  inject,
  useId,
  defineExpose,
} from 'vue'
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  rangeStart: String, // yyyy-mm-dd
  rangeEnd: String, // yyyy-mm-dd
})

const model = defineModel() // 父層傳入 v-model

const emit = defineEmits(['change', 'blur'])

const open = ref(false)
const selectedDate = ref(null)
const inputText = ref('')

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())

const days = ['日', '一', '二', '三', '四', '五', '六']

const minguoYear = computed(() => currentYear.value - 1911)

const daysInMonth = computed(() =>
  new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
)

const startOffset = computed(() =>
  new Date(currentYear.value, currentMonth.value, 1).getDay()
)

const normalizeDate = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const isInRange = (day) => {
  const d = normalizeDate(new Date(currentYear.value, currentMonth.value, day))

  const start = props.rangeStart ? normalizeDate(props.rangeStart) : null
  const end = props.rangeEnd ? normalizeDate(props.rangeEnd) : null

  if (!start && !end) return true

  if (start && !end) return d >= start

  if (!start && end) return d <= end

  if (start && end) return d >= start && d <= end

  return false
}

const isRangeStart = (day) => {
  if (!props.rangeStart) return false
  const d = new Date(currentYear.value, currentMonth.value, day)
  return formatYMD(d) === props.rangeStart
}

const isRangeEnd = (day) => {
  if (!props.rangeEnd) return false
  const d = new Date(currentYear.value, currentMonth.value, day)
  return formatYMD(d) === props.rangeEnd
}

const formatMinguoYMD = (date) => {
  const y = date.getFullYear() - 1911
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const formatYMD = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return null

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const parseMinguoYMD = (str) => {
  const match = str ? str.match(/^(\d{2,3})-(\d{1,2})-(\d{1,2})$/) : null
  if (!match) return null
  const y = parseInt(match[1]) + 1911
  const m = parseInt(match[2]) - 1
  const d = parseInt(match[3])
  const date = new Date(y, m, d)
  return isNaN(date.getTime()) ? null : date
}

const elFormItem = inject('elFormItem', null)

// 選擇日曆
const selectDate = (day) => {
  const date = new Date(currentYear.value, currentMonth.value, day)
  selectedDate.value = date
  model.value = formatYMD(date)
  inputText.value = formatMinguoYMD(date)
  open.value = false

  emit('change')
  elFormItem?.validate?.('change')
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

const minDate = computed(() =>
  props.rangeStart ? new Date(props.rangeStart) : null
)
const maxDate = computed(() =>
  props.rangeEnd ? new Date(props.rangeEnd) : null
)

// 限制年份
const canPrevYear = computed(() => {
  if (!minDate.value) return true
  return currentYear.value > minDate.value.getFullYear()
})

const canNextYear = computed(() => {
  if (!maxDate.value) return true
  return currentYear.value < maxDate.value.getFullYear()
})

// 限制月份
const canPrevMonth = computed(() => {
  if (!minDate.value) return true
  return (
    currentYear.value > minDate.value.getFullYear() ||
    (currentYear.value === minDate.value.getFullYear() &&
      currentMonth.value > minDate.value.getMonth())
  )
})

const canNextMonth = computed(() => {
  if (!maxDate.value) return true
  return (
    currentYear.value < maxDate.value.getFullYear() ||
    (currentYear.value === maxDate.value.getFullYear() &&
      currentMonth.value < maxDate.value.getMonth())
  )
})

// 當使用者手動輸入後離開 input，觸發解析
const onBlur = () => {
  const parsed = parseMinguoYMD(inputText.value)
  if (!parsed) inputText.value = null
  selectedDate.value = parsed ? parsed : null
  currentYear.value = parsed ? parsed.getFullYear() : today.getFullYear()
  currentMonth.value = parsed ? parsed.getMonth() : today.getMonth()
  model.value = formatYMD(parsed)

  emit('blur')
  elFormItem?.validate?.('blur')
}

const onEnter = () => {
  onBlur()
  if (!inputText.value) open.value = false
}

const onTab = () => {
  onBlur()
  open.value = false
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
const id = `datePicker-${useId()}`
const addInputId = inject('addInputId')

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (typeof addInputId === 'function') {
    addInputId(id)
  }
})
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

defineExpose({
  open: () => (open.value = true),
  close: () => (open.value = false),
  focus: () => document.getElementById(id)?.focus?.(),
})
</script>

<style lang="scss" scoped>
.datepicker {
  position: relative;
  display: inline-block;
  width: 100%;
  &:after {
    color: #333;
    content: '\F214';
    font-family: 'bootstrap-icons' !important;
    position: absolute;
    right: 5px;
    top: 10px;
  }
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  width: 100%;
  cursor: pointer;
}

.calendar {
  position: absolute;
  top: 110%;
  background: white;
  border: 1px solid #ccc;
  width: 300px;
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

  &.in-range {
    // background-color: #cce5ff;
  }
  &.out-of-range {
    color: #ccc;
    pointer-events: none;
  }
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
