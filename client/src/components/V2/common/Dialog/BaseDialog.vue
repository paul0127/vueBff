<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="dialog-overlay" @click.self="close">
        <div class="dialog-content" role="dialog" @keydown.esc="close" tabindex="0">
          <div class="close" v-if="showClose" @click="close"><i class="bi bi-x-circle" /></div>
          <header v-if="$slots.header" class="dialog-header">
            <slot name="header" />
          </header>
          <div class="dialog-body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="dialog-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
})

const visible = defineModel()

const close = () => {
  visible.value = false
}

const trapFocus = (e) => {
  if (visible.value && e.key === 'Tab') {
    e.preventDefault()
  } else if (visible.value && e.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', trapFocus)
})

onUnmounted(() => {
  window.removeEventListener('keydown', trapFocus)
})
</script>

<style lang="scss" scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  .dialog-content {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    padding: 40px;
    position: relative;
    .close {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }

    .dialog-header{
      margin-bottom: 1rem;
    }
    .dialog-footer{
      margin-top: 1rem;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

