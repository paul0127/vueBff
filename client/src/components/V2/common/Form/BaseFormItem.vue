<template>
  <div
    class="d-flex"
    :class="{ 'flex-column': direction == 'column' }"
    :style="{ marginBottom: labelBottom }"
  >
    <label
      class="col-form-label"
      :style="{ width: labelWidth, textAlign: labelPosition }"
      :for="id"
    >
      <template v-if="isRequired"><span class="required">*</span></template>
      {{ label }}
    </label>
    <div class="input-area ms-2">
      <div>
        <slot :validateItem="validateItem" />
      </div>
      <div class="error_message" v-show="isErr">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, inject, computed, watch, onMounted, onBeforeUnmount } from 'vue'
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
  direction: {
    type: String,
    deafaullt: 'row',
  },
  required: {
    type: Boolean,
    default: false
  },
})

// 將父層參數引入
const labelWidth = inject('labelWidth')
const labelPosition = inject('labelPosition')
const labelBottom = inject('labelBottom')
const rules = inject('rules')
const model = inject('model')

const defaultValue = ref('')
const errorMessage = ref()
const isErr = ref(false)

const itemRules = computed(() => {
  return props.prop && rules[props.prop] ? rules[props.prop] : []
})
const itemModel = computed(() => {
  return props.prop ? model?.[props.prop] : null
})

const formIsRequired = computed(() => {
  for (const rule of itemRules.value) {
    if (rule.required) {
      return true
    }
  }

  return false
})

const isRequired = computed(()=>{
  return props.required || formIsRequired.value
})


const validateItem = async () => {
  isErr.value = false
  errorMessage.value = null

  for (const rule of itemRules.value) {
    if (
      rule.required &&
      ((Array.isArray(itemModel.value) && !itemModel.value.length) || !itemModel.value)
    ) {
      isErr.value = true
      errorMessage.value = rule.message || ''
      return false
    }

    if (rule.validator) {
      try {
        const result = await new Promise((resolve, reject) => {
          const res = rule.validator(rule, itemModel.value, (err) => {
            if (err instanceof Error) {
              reject(err)
            } else {
              resolve(true)
            }
          })

          if (res instanceof Promise) {
            res.then(resolve).cateh(reject)
          }
        })
      } catch (err) {
        isErr.value = true
        errorMessage.value = err.message || '驗證錯誤'
        return false
      }
    }
  }

  return true
}

const reset = () => {
  isErr.value = false
  errorMessage.value = null
}

const resetField = () => {
  if (props.prop && model && defaultValue.value !== undefined) {
    model[props.prop] = defaultValue.value
    isErr.value = false
    errorMessage.value = null
  }
}

const registerFormItem = inject('registerFormItem')
const unregisterFormItem = inject('unregisterFormItem')

onMounted(() => {
  if (itemModel.value !== undefined) {
    defaultValue.value = itemModel.value
  }

  registerFormItem({ validateItem, reset, resetField })
})

onBeforeUnmount(() => {
  unregisterFormItem({ validateItem, reset, resetField })
})
</script>
<style lang="scss" scoped>
.col {
  margin-bottom: 0;
}
.input-area {
  flex: 1;
  position: relative;
}
.error_message {
  position: absolute;
  left: 0;
}
.required {
  color: red;
}
.col-form-label {
  line-height: 28px;
}
</style>