<template>
    <div> 
        <label>{{ label }}</label> 
        <select v-model="model[field]"> 
            <option disabled value="">請選擇</option> 
            <option v-for="opt in options" :key="opt.value" :value="opt.value"> {{ opt.label }} </option> 
        </select> 
        <p v-if="errors[field]" class="error">{{ errors[field] }}</p> 
    </div>
</template>

<script setup lang="ts">
defineProps<{ 
    label: string 
    field: string 
    model: Record<string, any> 
    errors: Record<string, string> 
    options: Array<{ label: string; value: any }> 
}>()
</script>
