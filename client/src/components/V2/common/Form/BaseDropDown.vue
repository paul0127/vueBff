<template>
  <div class="dropdown select_dropdown" :id="id" :style="{ width: width }">
    <button
      class="btn btn_input_select_dropdown dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      :disabled="disabled"
    >
      {{ slectedItem }}
    </button>
    <ul class="dropdown-menu">
      <li v-for="(item, index) in optionList" :key="index" @click.prevent="selectItem(item)">
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: { type: Number },
  optionList: { type: Array },
  width: {
    type: String,
    default: '100%',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const model = defineModel()

const emit = defineEmits(['change'])

const slectedItem = computed(() => {
  if (!Array.isArray(props.optionList)) return null
  const item = props.optionList.find((item) => item.value == model.value)

  return item ? item.text : null
})

const selectItem = (item) => {
  model.value = item.value
  emit('change')
}
</script>
<style lang="scss" scoped>
.btn_input_select_dropdown:disabled {
  background-color: var(--bs-secondary-bg);
  opacity: 1;
}
</style>
