<template> 
    <div> 
        <label>{{ label }}</label> 
        <input v-model="model[field]" type="text" /> 
        <p v-if="errors[field]" class="error">{{ errors[field] }}</p> 
    </div> 
</template> 
<script setup lang="ts"> 
    defineProps<{ 
        label: string 
        field: string 
        model: Record<string, any> 
        errors: Record<string, string>
    }>() 
</script> 
<style scoped> 
    .error { color: red; font-size: 12px; } 
</style>