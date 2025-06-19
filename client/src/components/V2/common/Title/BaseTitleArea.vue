<template>
  <div class="titleArea" :class="{'mb-20':!searchOpenSubject}">
    <div class="title">
      <div class="text">{{ title }}</div>
      <BreadcrumbNav :breadcrumbLists="breadcrumbLists" />
    </div>

    <div class="breadcrumb_group">
      <div class="right_btn_group">
        <slot />
      </div>
      <div class="right_tab_title" v-if="searchOpenSubject">
        <a @click="showFormsActive"> <i class="bi bi-search"></i>{{ searchOpenSubject }} </a>
      </div>
    </div>
  </div>
</template>
<script setup>
import BreadcrumbNav from './BreadcrumbNav.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  pageTitle: {
    type: String,
  },
  breadcrumbLists: {
    type: Array,
    required: true,
    default: [],
  },
  searchOpenSubject: {
    type: String,
    default: '',
  },
})

const title = computed(() => {
  return props.pageTitle || useRoute()?.meta?.title
})

const emit = defineEmits(['showFormsActive'])
const showFormsActive = () => {
  emit('showFormsActive')
}
</script>
<style lang="scss" scoped>
.titleArea {
  width: 100%;
  margin: 30px 0 0 0;
  padding: 0 10px 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  &.mb-20{
    margin-bottom: 20px;
  }

  .title {
    border-left: 3px solid #116975;
    padding-left: 38px;
    .text {
      color: #014f73;
      font-size: 28px;
      font-weight: bolder;
      text-align: left;
    }
  }
  .breadcrumb_group {
    display: flex;
    align-items: flex-end;
    .right_btn_group {
      margin-left: auto;
    }
  }
}
</style>