<template>
  <div class="baseRow" :style="{ justifyContent: justify, alignItems: align }">
    <slot />
  </div>
</template>
<script setup>
import { provide } from 'vue'
const props = defineProps({
  gutter: {
    type: Number,
  },
  justify: {
    type: String,
    default: 'start',
  },
  align: {
    type: String,
    default: '',
  },
})

provide('gutter', props.gutter)
</script>
<style lang="scss" scoped>
.baseRow {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  box-sizing: border-box;
}
</style>