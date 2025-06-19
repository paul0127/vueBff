<template>
  <Teleport to="body">
    <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.3)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header" v-if="title">
            <h5 class="modal-title">{{ title }}</h5>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn" @click="onCancel">
              {{ cancelButtonText }}
            </button>
            <button type="button" class="btn" :class="confirmClass" @click="onConfirm">
              {{ confirmButtonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  title: { type: String },
  message: { type: String },
  confirmButtonText: { type: String },
  cancelButtonText: { type: String },
  type: { type: String, default: 'info' },
  onConfirm: { type: Function },
  onCancel: { type: Function },
})

const confirmClass = computed(() => {
  switch (props.type) {
    case 'warning':
      return 'btn-warning'
    case 'error':
      return 'btn-danger'
    case 'success':
      return 'btn-success'
    default:
      return 'btn-primary'
  }
})
</script>