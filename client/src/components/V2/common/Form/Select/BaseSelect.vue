<template>
  <div
    class="base-select form-select"
    tabindex="0"
    ref="root"
    @click="toggle"
    @keydown="onKeydown"
  >
    <!-- 隱藏 input，給 label 的 for="id" 連結用 -->
    <input
      :id="id"
      class="visually-hidden"
      type="text"
      @focus="focus"
      @blur="blur"
    />
    <div class="selected">
      {{ selectedLabel || placeholder }}
    </div>
    <ul v-show="open" class="dropdown">
      <slot />
    </ul>
  </div>
</template>

<script setup>
import {
  ref,
  provide,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
  useId,
  inject,
} from 'vue'

const props = defineProps({
  id: [String, Number],
  placeholder: {
    type: String,
    default: '',
  },
  modelValue: [String, Number],
})
const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'change'])

const open = ref(false)
const selectedLabel = ref('')
const isFocused = ref(false)
const highlightedIndex = ref(-1)

const root = ref()
const optionElements = ref([])
const optionMap = ref(new Map())

const generatedId = `select-${useId()}`
const id = props.id || generatedId

// ------- 點擊事件處理 -------
const toggle = async () => {
  open.value = !open.value
  if (open.value) {
    focus()
    await nextTick()
    highlightedIndex.value = optionElements.value.findIndex(
      (opt) => opt.value === props.modelValue
    )
  }
}

// ------- 外部點擊關閉 -------
const handleClickOutside = (e) => {
  if (!root.value?.contains(e.target)) {
    blur()
    open.value = false
  }
}

// ------- focus / blur -------
const elFormItem = inject('elFormItem', null)

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
    elFormItem?.validate?.('blur')
  }
}

// ------- keyboard 支援 -------
const onKeydown = (e) => {
  if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape', ' '].includes(e.key)) {
    e.preventDefault()
  }

  if (!open.value) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      toggle()
    }
    return
  }

  const max = optionElements.value.length - 1

  if (e.key === 'ArrowDown') {
    highlightedIndex.value =
      highlightedIndex.value < max ? highlightedIndex.value + 1 : 0
  } else if (e.key === 'ArrowUp') {
    highlightedIndex.value =
      highlightedIndex.value > 0 ? highlightedIndex.value - 1 : max
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

  // 延遲處理 open = false
  nextTick(() => {
    open.value = false
  })

  blur()
}

// ------- option 註冊與對應 -------
provide('selectValue', selectValue)
provide('highlightedIndex', highlightedIndex)
provide('registerOption', (option) => {
  if (!optionMap.value.has(option.value)) {
    optionElements.value.push(option)
    optionMap.value.set(option.value, option)


    if (option.value === props.modelValue) {
      selectedLabel.value = option.label
    }
  }
  return optionElements.value.length - 1
})

watch(
  () => props.modelValue,
  (newVal) => {
    const opt = optionMap.value.get(newVal)
    selectedLabel.value = opt?.label || ''

    elFormItem?.validate?.('change')
  }
)

// ------- 提供 id 給 form item -------
const addInputId = inject('addInputId')
onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  if (typeof addInputId === 'function') {
    addInputId(id)
  }
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.base-select {
  position: relative;
  display: inline-block;
  width: 200px;
  border: 1px solid #ccc;
  cursor: pointer;
  user-select: none;
  padding: 0 2.25rem 0 0.75rem;
}
.selected {
  padding: 8px;
  background-color: #fff;
  height: 40px;
  text-align: left;
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
  z-index: 11;
  list-style: none;
  padding-left: 0;
}
.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
  border: 0;
  padding: 0;
  margin: -1px;
}
</style>
