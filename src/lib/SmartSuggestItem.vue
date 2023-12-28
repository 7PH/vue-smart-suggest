<script setup lang="ts">
import { Item } from './types';

defineProps<{
    suggestion: Item;
    selected: boolean;
}>();
</script>

<template>
    <div
        style="padding: 5px;"
        :style="{
            backgroundColor: selected ? 'blue' : 'transparent',
            color: selected ? 'white' : 'black',
        }"
    >
        {{ suggestion.value }}
    </div>
</template>
