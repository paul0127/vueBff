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
    type: Array,
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

const formItems = ref([])

// 將子層函數註冊 提供給父層使用
const registerFormItem = (item) => {
  formItems.value.push(item)
}
const unregisterFormItem = (item) => {
  formItems.value = formItems.value.filter((i) => i !== item)
}

// 驗證所有子層驗證
const validate = async () => {
  let isValid = true
  for (const item of formItems.value) {
    const result = await item.validateItem()
    if (!result) {
      isValid = false
    }
  }

  return isValid
}

// 清空所有欄位
const resetForm = () => {
  for (const key in props.model) {
    if (Array.isArray(props.model[key])) {
      props.model[key] = []
    } else if (typeof props.model[key] === 'object' && props.model[key] !== null) {
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

// 將參數及函數提供給子層
provide('labelWidth', props.labelWidth)
provide('labelPosition', props.labelPosition)
provide('labelBottom', props.labelBottom)
provide('rules', props.rules)
provide('model', props.model)

provide('registerFormItem', registerFormItem)
provide('unregisterFormItem', unregisterFormItem)
provide('resetForm', resetForm)

defineExpose({
  validate, //所有欄位驗證
  resetForm, //清空欄位
  resetFields, //重設預設值
})
</script>