<template>
  <a
    class="btn btn-outline-secondary"
    :style="{
      color: color,
      borderColor: color,
      '--hover-backgroundColor': color,
    }"
  >
    <i v-if="icon" :class="icon"></i> {{ title }}
  </a>
</template>
<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: '#6c757d',
  },
})
</script>
<style lang="scss" scoped>
.btn-outline-secondary{
  &:hover{
    color: #fff !important;
    background-color: var(--hover-backgroundColor) !important;
  }
}
</style>