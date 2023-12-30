<script setup lang="ts">
import { onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
import { AcceptedInputType, ActiveTrigger, Item, Trigger } from './types';
import { useSmartSuggest } from './useSmartSuggest';
import SmartSuggestItem from './SmartSuggestItem.vue';

const props = defineProps<{
    triggers: Trigger[];
}>();

const { setInputElement, setTriggers, select, active, items, dropdownPosition, activeIndex, activeTrigger } = useSmartSuggest(props.triggers);

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
    (e: 'select', item: Item): void;
    (e: 'open'): void;
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
        :class="$attrs.class"
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