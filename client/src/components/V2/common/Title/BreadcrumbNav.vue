<template>
  <nav style="--bs-breadcrumb-divider: '>'" aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li
        class="breadcrumb-item"
        v-for="(item, id) in sendBreadcrumbLists"
        :key="id"
        :class="{ active: item.active }"
        :style="{ cursor: cursorDisplay }"
        @click="toPagePath(item)"
      >
        <i class="bi bi-house-door" v-show="item.icon !== ''" ></i
        >{{ item.title }}
      </li>
    </ol>
  </nav>
</template>

<script setup>
const props = defineProps({
  sendBreadcrumbLists: { type: Array },
})

const toPagePath = (item) => {
  if (!item.href) router.push({ path: item.href })
}

const cursorDisplay = (item) => {
    return item.href ? 'pointer' : 'default'
}
</script>