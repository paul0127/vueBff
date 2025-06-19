<template>
  <nav style="--bs-breadcrumb-divider: '>'" aria-label="breadcrumb">
    <ol class="breadcrumb">
      <router-link
        class="breadcrumb-item"
        :class="{ disabled: !item.href }"
        v-for="(item, id) in breadcrumbLists"
        :key="id"
        :to="item.href"
      >
        <i :class="item.icon" v-if="item.icon"></i>{{ item.title }}
      </router-link>
    </ol>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
const props = defineProps({
  breadcrumbLists: { type: Array },
})

const route = useRoute()
const router = useRouter()
</script>
<style lang="scss" scoped>
a{
  color: #000;
  text-decoration: none;
}
.disabled{
  pointer-events: none;
}
</style>