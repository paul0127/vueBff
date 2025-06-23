<template>
  <div
    class="d-flex"
    :class="{ 'flex-column': direction == 'column' }"
    :style="{ marginBottom: labelBottom }"
  >
    <label
      class="col-form-label"
      :style="{ width: labelWidth, textAlign: labelPosition }"
      :for="firstInputId"
    >
      <template v-if="isRequired"><span class="required">*</span></template>
      {{ label }}
    </label>
    <div class="input-area ms-2">
      <div class="input">
        <slot :validateItem="validateItem" />
      </div>
      <div class="error_message" v-show="isErr">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, inject, computed, onMounted, onBeforeUnmount, provide } from 'vue'

const props = defineProps({
  label: String,
  prop: String,
  direction: {
    type: String,
    default: 'row',
  },
  required: {
    type: Boolean,
    default: false,
  },
})

// inject 來自 BaseForm 提供的上下文
const labelWidth = inject('labelWidth')
const labelPosition = inject('labelPosition')
const labelBottom = inject('labelBottom')
const rules = inject('rules', {})
const model = inject('model', {})

const inputIds = ref([])

const addInputId = (id) => {
  if (!inputIds.value.includes(id)) {
    inputIds.value.push(id)
  }
}
provide('addInputId', addInputId)

const firstInputId = computed(() => inputIds.value[0] || '')

// 驗證相關
const defaultValue = ref()
const errorMessage = ref()
const isErr = ref(false)

const itemRules = computed(() => (props.prop ? rules[props.prop] || [] : []))
const itemModel = computed(() => (props.prop ? model?.[props.prop] : null))

const formIsRequired = computed(() =>
  itemRules.value.some((rule) => rule.required)
)
const isRequired = computed(() => props.required || formIsRequired.value)

// focus 第一個 input
const focusFirstInput = () => {
  const id = firstInputId.value
  if (id) {
    const el = document.getElementById(id)
    el?.focus()
  }
}

const validateItem = async (trigger = 'change') => {
  isErr.value = false
  errorMessage.value = null

  for (const rule of itemRules.value) {
    // 若非 submit 則比對 trigger
    if (
      trigger !== 'submit' &&
      rule.trigger &&
      !(Array.isArray(rule.trigger)
        ? rule.trigger.includes(trigger)
        : rule.trigger === trigger)
    )
      continue

    // required 檢查
    if (
      rule.required &&
      (!itemModel.value ||
        (Array.isArray(itemModel.value) && itemModel.value.length === 0))
    ) {
      isErr.value = true
      errorMessage.value = rule.message || ''
      return false
    }

    // 自訂驗證器
    if (rule.validator) {
      try {
        await new Promise((resolve, reject) => {
          const res = rule.validator(rule, itemModel.value, (err) =>
            err instanceof Error ? reject(err) : resolve(true)
          )
          if (res instanceof Promise) res.then(resolve).catch(reject)
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
    reset()
  }
}

// 提供給 BaseInput 或其他子元件使用
provide('elFormItem', {
  validate: validateItem,
  reset,
  resetField,
})

// 給 BaseForm 使用的註冊系統
const registerFormItem = inject('registerFormItem')
const unregisterFormItem = inject('unregisterFormItem')

const context = {
  validateItem,
  reset,
  resetField,
  focus: focusFirstInput,
  get firstInputId() {
    return firstInputId.value
  },
}

onMounted(() => {
  if (itemModel.value !== undefined) {
    defaultValue.value = itemModel.value
  }

  registerFormItem?.(context)
})

onBeforeUnmount(() => {
  unregisterFormItem?.(context)
})
</script>

<style lang="scss" scoped>
.col {
  margin-bottom: 0;
}
.input-area {
  flex: 1;
  position: relative;
  .input{
    display: flex;
    flex-wrap: wrap;
  }
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
