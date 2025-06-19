<template>
  <div class="overView">
    <div class="title">
      {{ title }}
      <SmallBtn @click="emit('goBack')" title="回上一頁" icon="bi bi-reply-fill" />
    </div>
    <slot />
  </div>
</template>
<script setup>
import SmallBtn from '../Buttons/SmallBtn.vue'
const prop = defineProps({
  title: {
    type: String,
    default: null,
  },
})
const emit = defineEmits(['goBack'])
</script>
<style lang="scss" scoped>
.overView {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 30px;
  .title{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      font-size: 20px;
      font-weight: 600;
  }
}
</style>