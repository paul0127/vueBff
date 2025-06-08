<template>
  <div class="d-flex flex-row align-items-center" style="height: 100%">
    <div
      v-for="(item, index) in sendCheckboxLists"
      :key="item"
      class="form-check d-flex align-items-center"
    >
      <input
        v-model="model"
        class="form-check-input"
        type="checkbox"
        :id="'Checkbox' + index"
        :value="item"
      />
      <label class="form-check-label" :for="'Checkbox' + index">{{ item }}</label>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  sendCheckboxLists: {
    type: Array,
    default: [],
  },
})
const model = defineModel()
</script>