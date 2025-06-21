<template>
  <form>
    <slot />
  </form>
</template>
<script setup>
import { provide, ref } from 'vue'
const props = defineProps({
  labelWidth: {
    type: String,
    default: 'auto',
  },
  labelPosition: {
    type: String,
    default: 'right',
  },
  labelBottom: {
    type: String,
    default: '25px',
  },
  rules: {
    type: Object,
    default: () => {
      return {}
    },
  },
  model: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

// 將參數及函數提供給子層
provide('labelWidth', props.labelWidth)
provide('labelPosition', props.labelPosition)
provide('labelBottom', props.labelBottom)
provide('rules', props.rules)
provide('model', props.model)

const formItems = ref(new Set())

// 將子層函數註冊 提供給父層使用
const registerFormItem = (item) => {
  formItems.value.add(item)
}

const unregisterFormItem = (item) => {
  formItems.value.delete(item)
}

provide('registerFormItem', registerFormItem)
provide('unregisterFormItem', unregisterFormItem)

// 驗證所有子層驗證
const validate = async (options = { autoFocus: false, scrollIntoView: false }) => {
  let isValid = true
  let firstInvalidItem = null

  for (const item of formItems.value) {
    const result = await item.validateItem?.('submit')
    if (!result) {
      if (!firstInvalidItem) {
        firstInvalidItem = item
      }
      isValid = false
    }
  }

  if (!isValid && firstInvalidItem) {
    if (options.autoFocus) {
      firstInvalidItem.focus?.()
    }

    if (options.scrollIntoView && firstInvalidItem.firstInputId) {
      const el = document.getElementById(firstInvalidItem.firstInputId)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return isValid
}

// 清空所有欄位
const resetForm = () => {
  for (const key in props.model) {
    if (Array.isArray(props.model[key])) {
      props.model[key] = []
    } else if (
      typeof props.model[key] === 'object' &&
      props.model[key] !== null
    ) {
      props.model[key] = {}
    } else {
      props.model[key] = ''
    }

    // 清除驗證訊息
    formItems.value.forEach((item) => {
      item.reset?.()
    })
  }
}

// 恢復預設值
const resetFields = () => {
  formItems.value.forEach((item) => {
    item.resetField?.()
  })
}

provide('resetForm', resetForm)

defineExpose({
  validate, //所有欄位驗證
  resetForm, //清空欄位
  resetFields, //重設預設值
})
</script>
