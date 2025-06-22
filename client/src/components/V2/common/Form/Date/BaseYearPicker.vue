<template>
  <div class="minguo-year-grid-picker" ref="picker">
    <div class="trigger" @click="toggleOpen">
      <input
        type="text"
        class="input"
        v-model="inputText"
        @focus.stop
        @input="onInput"
        @keydown.enter="onEnter"
      />
      <span class="suffix">年</span>
    </div>

    <div v-if="open" class="dropdown">
      <div class="grid">
        <div
          v-for="year in visibleYears"
          :key="year"
          class="cell"
          :class="{ disabled: isDisabled(year), selected: year === modelValue }"
          @click="selectYear(year)"
        >
          {{ year - 1911 }} 年
        </div>
      </div>

      <div class="nav">
        <button
          @click.prevent="prevPage"
          :disabled="visibleYears[0] <= minYear"
        >
          ‹
        </button>
        <button
          @click.prevent="nextPage"
          :disabled="visibleYears[visibleYears.length - 1] >= maxYear"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue: Number, // 西元年
  rangeStart: Number,
  rangeEnd: Number,
})

const inputText = ref(props.modelValue ? String(props.modelValue - 1911) : '')

watch(
  () => props.modelValue,
  (val) => {
    inputText.value = val ? String(val - 1911) : ''
  }
)

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const picker = ref(null)

const minYear = props.rangeStart ?? 1950
const maxYear = props.rangeEnd ?? new Date().getFullYear() + 20

// pagination 起始位置（每頁 12 年）
const pageStart = ref(
  Math.floor((props.modelValue ?? new Date().getFullYear() - 1911) / 12) * 12 +
    1911
)

const visibleYears = computed(() => {
  const years = []
  for (let i = 0; i < 12; i++) {
    const y = pageStart.value + i
    if (y >= minYear && y <= maxYear) years.push(y)
  }
  return years
})

const isDisabled = (year) => year < minYear || year > maxYear
const displayYear = computed(() =>
  props.modelValue ? props.modelValue - 1911 : ''
)

const toggleOpen = () => (open.value = !open.value)
const selectYear = (year) => {
  if (isDisabled(year)) return
  emit('update:modelValue', year)
  open.value = false
}

const prevPage = () => {
  if (pageStart.value - 12 >= minYear) {
    pageStart.value -= 12
  }
}
const nextPage = () => {
  if (pageStart.value + 12 <= maxYear) {
    pageStart.value += 12
  }
}

// 手動輸入觸發轉換
const onInput = () => {
  const num = parseInt(inputText.value)
  if (!isNaN(num)) {
    const westernYear = num + 1911
    if (!isDisabled(westernYear)) {
      emit('update:modelValue', westernYear)
      pageStart.value = Math.floor(num / 12) * 12 + 1911
    }
  }
}

// 按 Enter 鍵時觸發確認
const onEnter = (e) => {
  e.preventDefault()
  onInput()
  open.value = false
}

// 點擊外部關閉
const handleClickOutside = (e) => {
  if (picker.value && !picker.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<style lang="scss" scoped>
.minguo-year-grid-picker {
  position: relative;
  display: inline-block;
  width: 160px;
}

.trigger {
  padding: 4px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  .input {
    border: none;
    width: 60px;
    text-align: right;
    font-size: 1rem;
    outline: none;
  }

  .suffix {
    margin-left: 4px;
    font-size: 1rem;
  }
}

.dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  width: 270px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 20;
  padding: 10px;
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    .cell {
      padding: 6px;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid transparent;
      font-size: 0.9rem;
      &:hover {
        background: #f0f0f0;
      }
      &.disabled {
        color: #ccc;
        pointer-events: none;
      }
      &.selected {
        background: #007bff;
        color: white;
        font-weight: bold;
        border-color: #007bff;
      }
    }
  }
}

.nav {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
  }
}
</style>
