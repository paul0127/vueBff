<template>
  <div class="w-100 flex-shrink-0">
    <slot />
  </div>
</template>

<script setup>
import { inject, onMounted } from 'vue'

const props = defineProps({
  time:{
    type:String
  }
})

const carousel = inject('carousel')

onMounted(() => {
  carousel?.registerItem(props.time)
})
</script>