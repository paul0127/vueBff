<template>
  <div class="baseCol" :class="[colClass]" :style="{ '--padding': padding }">
      <slot />
  </div>
</template>
<script setup>
import { inject, ref } from 'vue'
const props = defineProps({
  span: {
    type: Number,
    default: 24,
  },
})

const gutter = inject('gutter')
const padding = gutter ? `${gutter / 2}px` : '0'

const colClass = ref()
colClass.value = `base-col-${props.span}`
</script>
<style lang="scss" scoped>
.baseCol {
  padding: 0 var(--padding);
}
@for $i from 1 through 24 {
  .base-col-#{$i} {
    display: block;
    max-width: calc(100% / 24 * $i);
    flex: 0 0 calc(100% / 24 * $i);
  }
}
</style>