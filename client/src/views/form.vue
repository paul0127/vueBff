<template> 
    <BaseForm ref="formRef" :model-value="form" :rules="rules"> 
        <template #default="{ model, errors }"> 
            <BaseInput label="姓名" field="name" :model="model" :errors="errors" /> 
            <BaseSelect label="性別" field="gender" :model="model" :errors="errors" :options="[ { label: '男', value: 'male' }, { label: '女', value: 'female' } ]" /> 
            <datepick v-model="birthday" /> 
        </template> 
    </BaseForm>
    <button @click="onSubmit">送出</button>
    <Collapse>
        <template #toggle>點我展開/收合</template>
        <p>這是一段可以展開或收合的內容。</p>
    </Collapse>
    <!-- <datepick /> -->
</template>

<script setup lang="ts">
    import { ref } from 'vue' 
    import Collapse from '@/components/V2/common/Collapse/BaseCollapse.vue'
    import BaseForm from '@/components/form/BaseForm.vue' 
    import BaseInput from '@/components/form/BaseInput.vue' 
    import BaseSelect from '@/components/form/BaseSelect.vue' 
    import BaseDatePicker from '@/components/form/BaseDatePicker.vue' 
    import datepick from '@/components/datepick.vue'
    const form = ref({ name: '', gender: '', birthday: '' }) 
    const rules = { name: [{ required: true, message: '請輸入姓名' }], gender: [{ required: true, message: '請選擇性別' }], birthday: [{ required: true, message: '請選擇生日' }] } 
    const formRef = ref<InstanceType<typeof BaseForm>>() 
    async function onSubmit() { 
        const valid = formRef.value?.validate() 
        if (valid) { // ✅ 驗證成功 → 呼叫 API 
            alert('提交成功！' + JSON.stringify(form.value, null, 2)) 
            await axios.post('/api/submit', form.value) 
        } 
    } 

    const birthday = ref('2024-06-06')
</script>
