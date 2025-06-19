<template>
  <a
    class="btn btn-outline-secondary"
    :style="{
      color: color,
      borderColor: color,
      '--hover-backgroundColor': color,
    }"
    @click="emit('click')"
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

const emit = defineEmits(['click'])
</script>
<style lang="scss" scoped>
.btn-outline-secondary {
  border-radius: 30px;
  padding: 2px 8px;
  margin: auto 8px;
  &:hover {
    color: #fff !important;
    background-color: var(--hover-backgroundColor) !important;
  }
  i{
    margin-right: 5px;
  }
}
</style>