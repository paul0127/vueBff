<template>
  <Transition name="fade">
    <div v-show="visible" :class="['messageBox', type]" @click="close">
      {{ text }}
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: {
    type: String,
  },
  type: {
    type: String,
    default: 'info',
  },
  second: {
    type: Number,
    default: 3000,
  },
})

const visible = ref(true)

const close = () => {
  visible.value = false
}
setTimeout(close, props.second)
</script>

<style lang="scss" scoped>
.messageBox {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 20px;
  border-radius: 6px;
  z-index: 9999;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  &.info {
    background: #e9ecef;
    color: #7e8081;
    border: 1px solid #d1d4d6;
    &::before {
      content: '\F332';
      font-family: bootstrap-icons !important;
      margin-right: 10px;
      display: block;
    }
  }
  &.success {
    background: #d5f5c4;
    color: #67c23a;
    border: 1px solid #aef18c;
    &::before {
      content: '\F26A';
      font-family: bootstrap-icons !important;
      margin-right: 10px;
      display: block;
    }
  }
  &.error {
    background-color: #f7beba;
    color: #f34d42;
    border: 1px solid #fa8d85;

    &::before {
      content: '\F622';
      font-family: bootstrap-icons !important;
      margin-right: 10px;
      display: block;
    }
  }
  &.warning {
    background-color: #facd8b;
    color: #ff9800;
    border: 1px solid #e6bc7f;
    &::before {
      content: '\F332';
      font-family: bootstrap-icons !important;
      margin-right: 10px;
      display: block;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}
</style>