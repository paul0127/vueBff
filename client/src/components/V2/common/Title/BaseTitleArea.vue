<template>
  <div class="title_area">
    <div class="title">{{ pageTitle }}</div>

    <div class="breadcrumb_group">
      <BreadcrumbNav :sendBreadcrumbLists="breadcrumbLists" />
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

const emit = defineEmits(['showFormsActive'])
const showFormsActive = () => {
  emit('showFormsActive')
}
</script>
<style lang="scss" scoped>
.right_btn_group{
  margin-left: auto;
}
</style>