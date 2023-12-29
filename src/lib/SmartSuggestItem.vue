<script setup lang="ts">
import { Item } from './types';

defineProps<{
    item: Item;
    selected: boolean;
}>();
</script>

<template>
    <div
        class="smart-suggest-item"
        :class="{
            'smart-suggest-item-selected': selected,
        }"
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
    background-color: blue;
    color: white;
}
</style>