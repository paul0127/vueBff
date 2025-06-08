<template>
  <div class="divider" :style="{ borderRight: boderStyle }"></div>
</template>
<script setup>
const props = defineProps({
  width: {
    type: Number,
    default: 1,
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
const boderStyle = `${props.width}px ${props.type} ${props.color}`
</script>
<style lang="scss" scoped>
.divider {
}
</style>