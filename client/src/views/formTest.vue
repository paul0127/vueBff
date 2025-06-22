<template>
  <BaseForm ref="formRef" :model="form" :rules="rules">
    <BaseFormItem label="姓名" prop="name">
      <BaseInput id="123" v-model="form.name" />
    </BaseFormItem>
    <BaseFormItem label="姓名" prop="interest">
      <BaseCheckGroup v-model="form.interest">
        <BaseCheck value="A">ball</BaseCheck>
        <BaseCheck value="B">ball2</BaseCheck>
      </BaseCheckGroup>
    </BaseFormItem>
    <BaseFormItem label="性別" prop="sex">
      <BaseRadioGroup v-model="form.sex">
        <BaseRadio value="1">男</BaseRadio>
        <BaseRadio value="0">女</BaseRadio>
      </BaseRadioGroup>
    </BaseFormItem>
    <BaseFormItem label="日期" prop="date">
      <BaseDatePicker v-model="form.date" rangeStart="2024-01-01" rangeEnd="2025-06-23" />
    </BaseFormItem>
    <BaseFormItem label="日期範圍" prop="dateRange">
      <BaseDatePickerRange v-model="form.dateRange" rangeStart="2023-01-01" rangeEnd="2025-06-23" />
    </BaseFormItem>
    <BaseFormItem label="喜歡" prop="like">
      <BaseSelect v-model="form.like">
        <BaseOption :value="null">全部</BaseOption>
        <BaseOption :value="1">選項1</BaseOption>
        <BaseOption :value="2">選項2</BaseOption>
        <BaseOption :value="3">選項3</BaseOption>
      </BaseSelect>
    </BaseFormItem>
    <BaseFormItem label="姓名" prop="name">
      <BaseInput id="123" v-model="form.name" />
    </BaseFormItem>
    <button @click.prevent="send">送出</button>
  </BaseForm>
</template>
<script setup>
import { ref } from 'vue'
import {
  BaseForm,
  BaseFormItem,
  BaseInput,
  BaseCheckGroup,
  BaseCheck,
  BaseRadioGroup,
  BaseRadio,
  BaseDatePicker,
  BaseDatePickerRange,
  BaseSelect,
  BaseOption,
} from '@/components/V2/index.js'
const form = ref({
  name: '',
  interest: [],
  sex: null,
  date: null,
  dateRange: ['2024-01-01','2024-01-31'],
  like: null,
})
const rules = {
  name: [
    { required: true, message: '請輸入姓名', trigger: ['blur', 'change'] },
  ],
  interest: [
    { required: true, message: '請選擇一個', trigger: ['blur', 'change'] },
  ],
  sex: [
    {
      validator: (rule, value, callback) => {
        if (value == null) {
          callback(new Error('請選擇性別'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  date: [
    { required: true, message: '請選擇日期', trigger: ['blur', 'change'] },
  ],
  dateRange: [
    { required: true, message: '請選擇日期範圍', trigger: ['blur', 'change'] },
  ],
  like: [
    {
      required: true,
      message: '請選擇喜歡的選項',
      trigger: ['blur', 'change'],
    },
  ],
}

const formRef = ref(null)
const send = async () => {
  const isValid = await formRef.value.validate({
    autoFocus: true,
    scrollIntoView: true,
  })
  if (isValid) {
    console.log('表單數據:', form.value)
  } else {
    console.error('表單驗證失敗')
  }
}
</script>
