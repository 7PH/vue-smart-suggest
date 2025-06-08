<script lang="ts">
/**
 * Component responsible for handling the input and displaying the dropdown.
 * Accepts a list of triggers which are used to determine when to open the dropdown.
 * It should have a single child element which is the input element (@see AcceptedInputType for supported types).
 * 
 * Based on your need, you can customize the dropdown items (SmartSuggestItem) or the full dropdown (slot="dropdown").
 * 
 * When using showNoResult=true, you can also customize the no result message (slot="no-result").
 */
export default {};
</script>

<script setup lang="ts">
import { onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
import { AcceptedInputType, ActiveTrigger, Item, Trigger } from './types';
import { useSmartSuggest } from './useSmartSuggest';
import SmartSuggestItem from './SmartSuggestItem.vue';

const props = defineProps<{
    /**
     * (prop) Triggers to use for this SmartSuggest instance
     */
    triggers: Trigger[];

    keepOnBlur?: boolean;
}>();

const {
    setInputElement,
    setTriggers,
    select,
    active,
    items,
    dropdownPosition,
    activeIndex,
    activeTrigger
} = useSmartSuggest(props.triggers, undefined, props.keepOnBlur);

watch(() => props.triggers, () => {
    setTriggers(props.triggers);
}, { immediate: true });

const container = ref<HTMLDivElement>();
function updateTextArea() {
    if (! container.value || ! container.value.firstElementChild) {
        setInputElement(undefined);
        return;
    }

    setInputElement(container.value.firstElementChild as AcceptedInputType);
}
onMounted(updateTextArea);
onUpdated(updateTextArea);
onUnmounted(updateTextArea);

const emits = defineEmits<{
    /**
     * (event) Emitted when an item is selected
     */
    (e: 'select', item: Item): void;

    /**
     * (event) Emitted when the dropdown is opened or closed
     */
    (e: 'open'): void;

    /**
     * (event) Emitted when the dropdown is opened or closed
     */
    (e: 'close'): void;
}>();

watch(active, (active) => {
    if (active) {
        emits('open');
    } else {
        emits('close');
    }
});
</script>

<template>
    <div
        ref="container"
        class="smart-suggest"
        v-bind="$attrs"
        style="position: relative;"
    >
        <slot />

        <slot
            v-if="active"
            name="dropdown"
            :position="dropdownPosition"
            :items="items"
            :active-index="activeIndex"
            :trigger="(activeTrigger as ActiveTrigger).trigger"
            :select="select"
        >
            <div
                class="smart-suggest-dropdown"
                :class="{
                    'smart-suggest-dropdown-top': dropdownPosition.toTop,
                }"
                style="position: absolute"
                :style="{
                    top: dropdownPosition.top + 'px',
                    left: dropdownPosition.left + 'px',
                    width: dropdownPosition.width + 'px',
                    height: dropdownPosition.height + 'px',
                }"
            >
                <div class="smart-suggest-items">
                    <template
                        v-for="item, index in items"
                        :key="item.value"
                    >
                        <slot
                            name="item"
                            :item="item"
                            :active="index === activeIndex"
                            :trigger="(activeTrigger as ActiveTrigger).trigger"
                            :select="select"
                        >
                            <SmartSuggestItem
                                :item="item"
                                :active="index === activeIndex"
                                @select="select(item)"
                            />
                        </slot>
                    </template>

                    <template v-if="items.length === 0">
                        <slot name="no-result">
                            <div class="smart-suggest-no-result">
                                No result
                            </div>
                        </slot>
                    </template>
                </div>
            </div>
        </slot>
    </div>
</template>

<style scoped>
.smart-suggest-dropdown {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    color: black;
}
.smart-suggest-dropdown.smart-suggest-dropdown-top {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.smart-suggest-items {
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: auto;
    z-index: 100;
    text-align: left;
}

.smart-suggest-no-result {
    padding: 5px;
}
</style>