<template>
  <button v-if="type == 'secondary'" type="button" class="btn btn-secondary" @click="$emit('click')">清除重新查詢</button>
  <button v-if="type == 'success'" type="button" class="btn btn-success ms-2" @click="$emit('click')">
    <i class="bi bi-search"></i>查詢
  </button>
</template>
<script setup>
const props = defineProps({
  // type : success | secondary
  type: {
    type: String,
    default: 'success',
  },
})
</script>