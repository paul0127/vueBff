<template>
  <li class="option" :class="{ highlighted: isHighlighted }" @click.stop="select">
    <slot />
  </li>
</template>

<script setup>
import { inject, ref, onMounted, computed, useSlots } from 'vue'

const props = defineProps({
  value: [String, Number],
  disabled: Boolean,
})
const slots = useSlots()

const selectValue = inject('selectValue')
const registerOption = inject('registerOption')
const highlightedIndex = inject('highlightedIndex')

const label = ref('')
const index = ref(-1)

onMounted(() => {
  label.value = slots.default?.()[0]?.children || ''
  index.value = registerOption?.({
    value: props.value,
    label: label.value,
  })
})

const select = () => {
  if (!props.disabled) {
    selectValue?.(props.value, label.value)
  }
}

const isHighlighted = computed(() => highlightedIndex?.value === index.value)
</script>

<style scoped>
.option {
  padding: 8px;
  cursor: pointer;
  text-align: left;
}
.option:hover,
.option.highlighted {
  background-color: #f0f0f0;
}
</style>
