<script setup lang="ts">
import { onMounted, onUnmounted, onUpdated, ref } from 'vue';
import { AcceptedInputType, Trigger } from './types';
import { useSmartSuggest } from './useSmartSuggest';
import SmartSuggestItem from './SmartSuggestItem.vue';

const props = defineProps<{
    triggers: Trigger[];
}>();

const { setTextArea, active, suggestions, dropdownPosition, selectedIndex } = useSmartSuggest(props.triggers);

const container = ref<HTMLDivElement>();
function updateTextArea() {
    if (! container.value) {
        setTextArea(undefined);
        return;
    }
    
    const firstChild = container.value.firstElementChild;
    if (! firstChild) {
        setTextArea(undefined);
        return;
    }

    setTextArea(firstChild as AcceptedInputType);
}
onMounted(updateTextArea);
onUpdated(updateTextArea);
onUnmounted(updateTextArea);
</script>

<template>
    <div
        ref="container"
        class="smart-suggest"
        :class="$attrs.class"
        style="position: relative;"
    >
        <slot />

        <slot
            v-if="active"
            name="dropdown"
            :position="dropdownPosition"
            :suggestions="suggestions"
            :selected-index="selectedIndex"
        >
            <div 
                style="position: absolute"
                :style="{
                    top: dropdownPosition.top + 'px',
                    left: dropdownPosition.left + 'px',
                    width: dropdownPosition.width + 'px',
                    height: dropdownPosition.height + 'px',
                }"
                v-bind="{ ...$attrs, class: undefined }"
            >
                <template
                    v-for="suggestion, index in suggestions"
                    :key="suggestion.value"
                >
                    <slot
                        name="item"
                        :suggestion="suggestion"
                        :selected="index === selectedIndex"
                    >
                        <SmartSuggestItem
                            :suggestion="suggestion"
                            :selected="index === selectedIndex"
                        />
                    </slot>
                </template>

                <template v-if="suggestions.length === 0">
                    <slot name="no-result">
                        <div style="padding: 5px;">
                            No result
                        </div>
                    </slot>
                </template>
            </div>
        </slot>
    </div>
</template>
