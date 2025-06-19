<template>
  <div class="collapse-wrapper" :class="{ active: isOpen }">
    <div class="title" @click="toggle">
      <slot name="title" @click="toggle">{{ title }}</slot>
      <div class="collapse-toggle" v-if="togglePosition == 'right'">
        <slot name="toggle" :is-open="isOpen">切換</slot>
      </div>
    </div>
    <div
      ref="contentRef"
      class="collapse-content"
      :class="{ active: isOpen }"
      :style="contentStyle"
      @transitionend="onTransitionEnd"
    >
      <div class="divider-border"></div>
      <slot :is-open="isOpen" />
    </div>
    <div class="collapse-toggle" v-if="togglePosition == 'bottom'" @click="toggle">
      <slot name="toggle" :is-open="isOpen">切換</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  togglePosition: {
    type: String,
    default: 'bottom',
  },
})

const emit = defineEmits(['change'])

const isOpen = ref(props.isOpen)
const contentRef = ref<HTMLElement | null>(null)
const maxHeight = ref('0px')
const isAnimating = ref(false)

const positions = ref(['right', 'bottom'])

const toggle = () => {
  if (!contentRef.value) return

  if (!positions.value.includes(props.togglePosition)) return

  isAnimating.value = true

  if (isOpen.value) {
    maxHeight.value = contentRef.value.scrollHeight + 'px'
    // 在下一幀設定為 0
    requestAnimationFrame(() => {
      maxHeight.value = '0px'
      isOpen.value = false
    })
  } else {
    maxHeight.value = contentRef.value.scrollHeight + 'px'
    isOpen.value = true
  }
}

const onTransitionEnd = () => {
  isAnimating.value = false
  // 清除 max-height，讓內容自適應高度（展開時）
  if (isOpen.value) {
    maxHeight.value = 'none'
  }
}

const contentStyle = computed(() => {
  return {
    overflow: 'hidden',
    transition: 'max-height 0.3s ease',
    maxHeight: isAnimating.value || !isOpen.value ? maxHeight.value : 'none',
  }
})
</script>

<style lang="scss" scoped>
.collapse-content {
  will-change: max-height;
  .divider-border {
    padding-top: 10px;
    border-top: 1px solid #eee;
  }
}
.collapse-toggle {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
.title {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

