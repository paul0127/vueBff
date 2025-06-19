<template>
  <div class="rightArea">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
.rightArea {
  position: relative;
  padding: 30px;
  height: calc(100% - 120px);
}
</style>