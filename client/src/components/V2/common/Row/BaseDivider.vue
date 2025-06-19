<template>
  <div class="divider" :style="style"></div>
</template>
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  position: {
    type: String,
    default: 'right',
  },
  margin: {
    type: String,
    default: 0,
  },
  width: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: 'solid',
  },
  color: {
    type: String,
    default: '#0097d4',
  },
})
const borderStyle = computed(() => {
  if (props.position == 'right') {
    return {
      borderRight: `${props.width}px ${props.type} ${props.color}`,
    }
  }
  if (props.position == 'bottom') {
    return {
      borderBottom: `${props.width}px ${props.type} ${props.color}`,
    }
  }
})

const marginStyle = computed(() => {
  if (props.position == 'right') {
    return {
      margin: `0 ${props.margin}`,
    }
  }
  if (props.position == 'bottom') {
    return {
      width: '100%',
      margin: `${props.margin} 0`,
    }
  }
})
const style = ref({
  ...borderStyle.value,
  ...marginStyle.value,
})
</script>
<style lang="scss" scoped>
.divider {
}
</style>