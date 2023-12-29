<script setup lang="ts">
import { ref, watch } from 'vue';
import { Item } from './types';

const props = defineProps<{
    item: Item;
    selected: boolean;
}>();

const container = ref();
watch(() => props.selected, () => {
    if (props.selected) {
        container.value.scrollIntoView({
            block: 'nearest',
        });
    }
});

defineEmits<{
    (e: 'select', item: Item): void;
}>();
</script>

<template>
    <div
        ref="container"
        class="smart-suggest-item"
        :class="{
            'smart-suggest-item-selected': selected,
        }"
        @mousedown.prevent.stop="$emit('select', item)"
    >
        {{ item.value }}
    </div>
</template>

<style scoped>
.smart-suggest-item {
    padding: 0.5rem;
    cursor: pointer;
}

.smart-suggest-item-selected {
    background-color: #eee;
}
.smart-suggest-item:hover {
    background-color: #ddd;
}
</style>