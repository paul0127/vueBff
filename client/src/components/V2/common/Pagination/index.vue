
<template>
  <div class="pagination">
    <div class="control">
      <button class="pBtn pre" @click="goPrev" :class="{ disabled: currentPage === 1 }">‹</button>

      <div class="pager">
        <button
          v-for="(page, index) in displayedPages"
          :key="index"
          @click="typeof page === 'number' && changePage(page)"
          :class="['', page === currentPage ? 'active' : '', { disabled: page === '...' }]"
        >
          {{ page }}
        </button>
      </div>

      <buttons class="pBtn next" @click="goNext" :class="{ disabled: currentPage === totalPages }">
        ›
      </buttons>
    </div>

    <div class="setting">
      <div class="goTo">
        到第
        <select v-model.number="goToPage" class="form-select form-select-sm" style="width: auto">
          <option v-for="page in totalPages" :key="page" :value="page">
            {{ page }}
          </option>
        </select>
        <div class="go" @click="changePage(goToPage)">
          <i class="bi bi-arrow-right-short" />
        </div>
        頁
      </div>

      <span class="mx-2">/</span>

      <div class="pageView">
        顯示
        <select
          v-model.number="internalPageSize"
          class="form-select form-select-sm mx-2"
          style="width: auto"
          @change="emitPageSize"
        >
          <option :value="10">10</option>
          <option :value="30">30</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
          <option :value="500">500</option>
        </select>
        筆
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue'

// v-model
const modelValue = defineModel({ default: 1 }) // current page
const pageSize = defineModel('pageSize', { default: 10 }) // per page

const props = defineProps({
  total: Number,
})
const emit = defineEmits(['change'])

const currentPage = ref(modelValue.value)
const internalPageSize = ref(pageSize.value)
const goToPage = ref(currentPage.value)

watch(
  () => modelValue.value,
  (val) => {
    currentPage.value = val
    goToPage.value = val
  }
)

watch(currentPage, (val) => {
  modelValue.value = val
  emitChange()
})

const totalPages = computed(() => Math.ceil(props.total / internalPageSize.value))

const goPrev = () => {
  if (currentPage.value > 1) changePage(currentPage.value - 1)
}

const goNext = () => {
  if (currentPage.value < totalPages.value) changePage(currentPage.value + 1)
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const emitPageSize = () => {
  pageSize.value = internalPageSize.value
  currentPage.value = 1
  goToPage.value = 1
  emitChange()
}

const emitChange = () => {
  emit('change', {
    page: currentPage.value,
    pageSize: internalPageSize.value,
  })
}

const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = 5
  const pages = []

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) pages.push(1, 2, 3, '...', total)
    else if (current >= total - 2) pages.push(1, '...', total - 2, total - 1, total)
    else pages.push(1, '...', current - 1, current, current + 1, '...', total)
  }

  return pages
})
</script>


<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  .control {
    display: flex;
    align-items: center;
    .pBtn {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #aaa;
      background: none;
      border-radius: 100%;
      cursor: pointer;
      &.disabled {
        background: #ddd;
        border: none;
      }
    }
    .pager {
      margin: 0 20px;
      button {
        border: none;
        background: none;
        padding: 2px 8px;
        margin: 0 2px;
        color: #aaa;
        &.active {
          border-bottom: 1px solid #2153c3;
          color: #2153c3;
        }
        &:hover {
          color: #2153c3;
        }
      }
    }
  }
  .setting {
    display: flex;
    align-items: center;

    .goTo {
      display: flex;
      align-items: center;
      .form-select {
        margin-left: 5px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      .go {
        width: 45px;
        height: 31px;
        background: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        margin-right: 5px;
        font-size: 30px;
      }
    }
    .pageView{
        display: flex;
        align-items: center;
    }
  }
}
.pBtn.disabled {
  pointer-events: none;
  opacity: 0.4;
}
.pager button.disabled {
  pointer-events: none;
  opacity: 0.6;
}
</style>

