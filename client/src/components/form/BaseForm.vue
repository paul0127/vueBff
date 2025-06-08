<template>
  <form @submit.prevent>
    <slot :model="model" :errors="errors" />
  </form>
</template>
<script setup lang="ts">
    import { reactive } from 'vue'
    const props = defineProps<{
        modelValue: Record<string, any>
        rules: Record<string,Array<{ required?: boolean; message: string }>>
    }>()
    
    const model = reactive({ ...props.modelValue })
    const errors = reactive<Record<string, string>>({})
    function validateField(field: string): boolean { 
        errors[field] = '' ;
        const value = model[field] 
        const rules = props.rules[field] || [] 
        for (const rule of rules) { 
            if (rule.required && (value === '' || value == null)) { 
                errors[field] = rule.message 
                return false 
            } 
        } 
        return true 
    } 
    function validate(): boolean { 
        let valid = true 
        for (const key in props.rules) { 
            if (!validateField(key)) valid = false 
        }

        return valid 
    } 
    defineExpose({ validate, model, errors })
</script>
