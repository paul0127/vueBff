<template>
    <div class="date_input">
        <div class="date_item">
            <input type="text" class="datepicker" :id="sendDatepickerStartId" :value="sendGetCurrentDate"
                @change="sendGetStartDate" @click="sendDatepickerStartDate" @blur="sendValidateEndDate" />
        </div>
        <span class="symbol">~</span>
        <div class="date_item">
            <input type="text" class="datepicker" :id="sendDatepickerEndId" :value="sendGetCurrentDate"
                @change="sendGetEndDate" @click="sendDatepickerEndDate" @blur="sendValidateEndDate" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    sendDatepickerStartId: { type: String },
    sendGetCurrentDate: { type: String },
    sendDatepickerEndId: { type: String },
})
const emits = defineEmits(['sendGetStartDate', 'sendDatepickerStartDate','sendValidateEndDate']);
const sendGetStartDate = () =>
{
    emits('sendGetStartDate')
}
const sendDatepickerStartDate = () =>
{
    emits('sendDatepickerStartDate')
}

const sendValidateEndDate = () =>
{
    emits('sendValidateEndDate')
}

</script>