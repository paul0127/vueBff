<template>
  <div
    class="baseCarousel"
    :style="{ height: computedHeight }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- Carousel items -->
    <div
      class="baseCarouselItem"
      :style="{
        transform: `translateX(-${currentIndex * 100}%)`,
        transitionDuration: '0.5s',
      }"
    >
      <slot />
    </div>
    <div class="pagination">
      <div class="timer" v-if="itemTime[currentIndex]">
        {{ itemTime[currentIndex] }}
      </div>
      <button class="cbtn pre" @click="prev" aria-label="Previous">‹</button>
      <div class="dots">
        <button
          v-for="(dot, i) in itemCount"
          :key="i"
          class="dot"
          :class="currentIndex === i ? 'active' : ''"
          @click="goTo(i)"
          aria-label="'Go to slide ' + (i + 1)"
        ></button>
      </div>
      <button class="cbtn next" @click="next" aria-label="Next">›</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed, provide } from 'vue'

const props = defineProps({
  height: {
    type: String,
    default: '300px',
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  interval: {
    type: Number,
    default: 3000,
  },
  time: {
    type: String,
  },
})

const currentIndex = ref(0)
const itemCount = ref(0)
const itemTime = ref([])

provide('carousel', {
  registerItem: (time) => {
    itemTime.value.push(time)
    itemCount.value++
  },
})

const computedHeight = computed(() => (props.height === 'auto' ? 'auto' : props.height))

// Autoplay
let timer = null
const startAutoplay = () => {
  if (props.autoplay) {
    stopAutoplay()
    timer = setInterval(() => {
      next()
    }, props.interval)
  }
}
const stopAutoplay = () => {
  if (timer) clearInterval(timer)
}

// Navigation
const next = () => {
  currentIndex.value = (currentIndex.value + 1) % itemCount.value
}
const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + itemCount.value) % itemCount.value
}
const goTo = (index) => {
  currentIndex.value = index
}

// Touch
let startX = 0
const onTouchStart = (e) => {
  startX = e.touches[0].clientX
  stopAutoplay()
}
const onTouchEnd = (e) => {
  const deltaX = e.changedTouches[0].clientX - startX
  if (deltaX > 50) prev()
  else if (deltaX < -50) next()
  startAutoplay()
}

// Lifecycle
onMounted(() => startAutoplay())
onBeforeUnmount(() => stopAutoplay())
watch(
  () => props.autoplay,
  (val) => {
    val ? startAutoplay() : stopAutoplay()
  }
)
</script>
<style lang="scss" scoped>
.baseCarousel {
  position: relative;
  overflow: hidden;
  width: 100%;
  .baseCarouselItem {
    display: flex;
  }
  .pagination {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .timer {
      position: absolute;
      left: 0;
      bottom: 15px;
      color: #036f75;
    }
    .dots {
      display: flex;
      align-items: center;
      margin: 5px 50px 0 50px;
      .dot {
        width: 15px;
        height: 15px;
        border-radius: 100%;
        margin: 0 2px;
        border: 1px solid #bbb;
        transform: scale(0.8);
        &.active {
          background: #000;
        }
      }
    }
    .cbtn {
      border: none;
      font-size: 35px;
      font-weight: 600;
      background: none;
    }
  }
}
</style>