<template>
  <table class="baseTable">
    <thead>
      <th></th>
      <th>連線方式</th>
      <th>傳輸速率</th>
      <th>閘道器IP</th>
      <th>子網路遮罩</th>
      <th>IP起始位置</th>
      <th>IP結束位置</th>
      <th>無線網卡號碼</th>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index">
          <slot />
        <td>
          <input type="radio" />
        </td>
        <td>01:ADSL</td>
        <td>01:1M/64K</td>
        <td>10.235.10.10</td>
        <td>255.255.255.10</td>
        <td>10.10.10.10</td>
        <td>10.10.10.100</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
import { provide } from 'vue'
const props = defineProps({
  data: {
    type: Array,
    default: () => {
      return []
    },
  },
})

provide('data', data)
</script>