<template>
    <BaseForm ref="formRef" :model="form" :rules="rules">
        <BaseRow>
            <BaseCol :span="12">
                <BaseFormItem label="姓名" prop="name" v-slot="{ onInput, onBlur }">
                    <BaseInput v-model="form.name" placeholder="請輸入姓名" @input="onInput" @blur="onBlur" />
                </BaseFormItem>
            </BaseCol>
            <BaseCol :span="12">
                <BaseFormItem label="密碼" prop="password" v-slot="{ onInput, onBlur }">
                    <BaseInput v-model="form.password" placeholder="請輸入姓名" @input="onInput" @blur="onBlur" />
                </BaseFormItem>
            </BaseCol>
        </BaseRow>
    </BaseForm>
    <SearchBtn class="large" @click="search()" />
</template>
<script setup>
import { ref,useTemplateRef } from 'vue'
import { BaseForm, BaseFormItem, BaseInput,BaseRow,BaseCol,SearchBtn } from '@/components/V2';

const form = ref({
    name:'',
    password:''
})

const rules = ref({
    name: [
        { required: true, message: '請輸入姓名', trigger: 'input' },
    ],
    password: [
        { required: true, message: '請輸入密碼', trigger: 'blur' },
    ]
})

const formRef = useTemplateRef('formRef')

const search = async () => {
    const valid = await formRef.value.validate()
    console.log(valid)
}
</script>