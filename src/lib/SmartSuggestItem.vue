<script setup lang="ts">
import { ref, watch } from 'vue';
import { Item } from './types';

const props = defineProps<{
    /**
     * (prop) Item to display
     */
    item: Item;

    /**
     * (prop) Whether the item is active, either hovered or active through keyboard navigation
     */
    active: boolean;
}>();

const container = ref<HTMLDivElement>();
watch(() => props.active, () => {
    if (props.active && container.value) {
        container.value.scrollIntoView({
            block: 'nearest',
        });
    }
});

defineEmits<{
    /**
     * (event) Emitted when the item is selected
     * 
     * @param item The item that was selected
     */
    (e: 'select', item: Item): void;
}>();
</script>

<template>
    <div
        ref="container"
        class="smart-suggest-item"
        :class="{
            'smart-suggest-item-active': active,
        }"
        @mousedown.prevent.stop="$emit('select', item)"
    >
        <span
            v-if="item.image"
            class="smart-suggest-item-image-container"
        >
            <img
                :src="item.image"
                alt=""
            >
        </span>
        <span>
            {{ item.label ?? item.value }}
        </span>
    </div>
</template>

<style scoped>
.smart-suggest-item {
    padding: 0.5rem;
    cursor: pointer;
    height: 1lh;

    display: flex;
    align-items: center;
    gap: 0.4em;
}

.smart-suggest-item-image-container {
    width: 1lh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.smart-suggest-item-image-container img {
    max-width: 100%;
    max-height: 100%;    
}

.smart-suggest-item-active {
    background-color: #eee;
}
.smart-suggest-item:hover {
    background-color: #ddd;
}
</style>