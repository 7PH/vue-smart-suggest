<script setup lang="ts">
import { onMounted, onUnmounted, onUpdated, ref } from 'vue';
import { AcceptedInputType, ActiveTrigger, Trigger } from './types';
import { useSmartSuggest } from './useSmartSuggest';
import SmartSuggestItem from './SmartSuggestItem.vue';

const props = defineProps<{
    triggers: Trigger[];
}>();

const { setTextArea, active, items, dropdownPosition, selectedIndex, activeTrigger } = useSmartSuggest(props.triggers);

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
            :items="items"
            :selected-index="selectedIndex"
            :trigger="(activeTrigger as ActiveTrigger).trigger"
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
                v-bind="{ ...$attrs, class: undefined }"
            >
                <div class="smart-suggest-items">
                    <template
                        v-for="item, index in items"
                        :key="item.value"
                    >
                        <slot
                            name="item"
                            :item="item"
                            :selected="index === selectedIndex"
                            :trigger="(activeTrigger as ActiveTrigger).trigger"
                        >
                            <SmartSuggestItem
                                :item="item"
                                :selected="index === selectedIndex"
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
    justify-content: start;
}
.smart-suggest-dropdown.smart-suggest-dropdown-top {
    display: flex;
    flex-direction: column;
    justify-content: end;
}

.smart-suggest-items {
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: auto;
    z-index: 100;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: end;
    border: 1px solid #ccc;
}

.smart-suggest-no-result {
    padding: 5px;
}
</style>