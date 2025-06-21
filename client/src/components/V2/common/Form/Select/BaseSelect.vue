<template>
  <div
    class="base-select"
    tabindex="0"
    ref="root"
    @click="toggle"
    @keydown.prevent="onKeydown"
  >
    <ul v-if="open" class="dropdown">
      <slot />
    </ul>
  </div>
</template>

<script setup>
import { ref, provide, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  modelValue: [String, Number]
})
const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'change'])

const open = ref(false)
const selectedLabel = ref('')
const isFocused = ref(false)
const highlightedIndex = ref(-1)

const root = ref()
const optionElements = ref([]) // 存選項的 ref 陣列（由子元件報名）

// ------- 點擊事件處理 -------
const toggle = async () => {
  open.value = !open.value
  if (open.value) {
    focus()
    await nextTick()
    // 開啟時自動將目前 modelValue 對應項目設為高亮
    highlightedIndex.value = optionElements.value.findIndex(
      (opt) => opt.value === props.modelValue
    )
  }
}

// ------- focus / blur 管理 -------
const handleClickOutside = (e) => {
  if (!root.value?.contains(e.target)) {
    blur()
    open.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

const focus = () => {
  if (!isFocused.value) {
    isFocused.value = true
    emit('focus')
  }
}
const blur = () => {
  if (isFocused.value) {
    isFocused.value = false
    emit('blur')
  }
}

// ------- keyboard 支援 -------
const onKeydown = (e) => {
  if (!open.value) return

  const max = optionElements.value.length - 1

  if (e.key === 'ArrowDown') {
    highlightedIndex.value = highlightedIndex.value < max ? highlightedIndex.value + 1 : 0
  } else if (e.key === 'ArrowUp') {
    highlightedIndex.value = highlightedIndex.value > 0 ? highlightedIndex.value - 1 : max
  } else if (e.key === 'Enter') {
    const opt = optionElements.value[highlightedIndex.value]
    if (opt) selectValue(opt.value, opt.label)
  } else if (e.key === 'Escape') {
    open.value = false
    blur()
  }
}

// ------- 選擇邏輯 -------
const selectValue = (val, label) => {
  if (val !== props.modelValue) {
    emit('update:modelValue', val)
    emit('change', val)
  }
  selectedLabel.value = label
  open.value = false
  blur()
}

provide('selectValue', selectValue)

// 子元件會報名自己進來
provide('registerOption', (option) => {
  optionElements.value.push(option)
})
provide('highlightedIndex', highlightedIndex)
</script>

<style scoped>
.base-select {
  position: relative;
  display: inline-block;
  width: 200px;
  border: 1px solid #ccc;
  cursor: pointer;
  user-select: none;
}
.selected {
  padding: 8px;
  background-color: #fff;
}
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}
</style>
