<template>
  <div class="formItem d-flex flex-row" :style="{ marginBottom: labelBottom }">
    <label
      class="col-form-label"
      :style="{ width: labelWidth, textAlign: labelPossition }"
      for="medical_institution_code"
      >{{ label }}</label
    >
    <div class="input-area ms-2">
      <slot
        :onInput="handleInput"
        :onBlur="handleBlur"
      />
      <div class="error_message" v-show="isErr">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, inject, computed, onMounted, onBeforeUnmount, defineExpose } from 'vue'
const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
  prop: {
    type: String,
    default: null,
  },
})

const labelWidth = inject('labelWidth')
const labelPossition = inject('labelPossition')
const labelBottom = inject('labelBottom')
const rules = inject('rules')
const model = inject('model')

const errorMessage = ref()
const isErr = ref(false)

const itemRules = computed(() => {
  return props.prop && rules[props.prop] ? rules[props.prop] : []
})
const itemModel = computed(() => {
return props.prop ? model?.[props.prop] : null})

const validateItem = () => {
  isErr.value = false
  errorMessage.value = null

  for (const rule of itemRules.value) {
    if (rule.required && (!itemModel.value || !itemModel.value.length)) {
      isErr.value = true
      errorMessage.value = rule.message || ''
      return false
    }

    if (rule.validator) {
      let valid = true
      rule.validator(rule, itemModel.value, (err) => {
        if (err instanceof Error) {
          isErr.value = true
          errorMessage.value = err.message
          valid = false
        }
      })
      if (!valid) return false
    }
  }

  return true
}

const registerFormItem = inject('registerFormItem')
const unregisterFormItem = inject('unregisterFormItem')

const reset = () => {
  isErr.value = false
  errorMessage.value = null
}

onMounted(() => {
  registerFormItem({ validateItem, reset })
})
onBeforeUnmount(() => {
  unregisterFormItem({ validateItem, reset })
})

const handleInput = () => {
  const triggered = itemRules.value.some(r => r.trigger === 'input')
  if (triggered) validateItem()
}

const handleBlur = () => {
  const triggered = itemRules.value.some(r => r.trigger === 'blur')
  if (triggered) validateItem()
}

defineExpose({ validateItem, reset })
</script>
<style lang="scss" scoped>
.col {
  margin-bottom: 0;
}
.formItem {
}
.input-area {
  flex: 1;
  position: relative;
}
.error_message {
  position: absolute;
  left: 0;
}
</style>