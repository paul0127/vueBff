<template>
    <div class="dropdown select_dropdown" :id="sendSelectId">
        <button class="btn btn_input_select_dropdown dropdown-toggle" :class="{ 'insideStyle': sendInsideStyle }"
            type="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{ sendSelectItem }}
        </button>
        <ul class="dropdown-menu">
            <li v-for="(item,index ,id) in sendGroup" :key="id" :value="item.id" @click.prevent="sendSelectGroup(item)">
                <span v-show="sendHasIndex"> {{ index }} -</span> {{ item.subject }}
            </li>
        </ul>
    </div>
</template>

<script setup>
const props = defineProps({
    sendSelectId: { type: String },
    sendSelectItem: { type: String },
    sendGroup: { type: Object },
    sendInsideStyle: { type: Boolean },
    sendHasIndex: { type: Boolean },
})
const emits = defineEmits(['sendSelectGroup']);
const sendSelectGroup = (item) =>{
    emits('sendSelectGroup',item)
}
</script>

