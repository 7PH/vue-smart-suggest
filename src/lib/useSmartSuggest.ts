import { ref } from 'vue';
import { AcceptedInputType, DropdownPosition, Item, Trigger } from './types';
import {
    getActiveTrigger,
    getInputSelectionStart,
    searchItems,
    setInputValue,
} from './util/input';
import { getDropdownPosition } from './util/dropdown';
import { SELECT_KEYS } from './constants';

// For performance reason, only search up to a few characters before the cursor
const MAX_SEARCH_LENGTH = 100;

export function useSmartSuggest(triggers: Trigger[]) {
    /**
     * The textarea that is currently active
     */
    let input: AcceptedInputType | undefined = undefined;

    /**
     * Whether the suggestions should be shown
     */
    const active = ref(false);

    /**
     * Current search
     */
    const search = ref('');

    /**
     * Current list of suggestions
     */
    const suggestions = ref<Item[]>([]);

    /**
     * Current selected suggestion
     */
    const selectedIndex = ref(0);

    /**
     * Current dropdown position
     */
    const dropdownPosition = ref<DropdownPosition>({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });

    /**
     * Update the current text area element
     * @param newInput The new text area element
     */
    function setTextArea(newInput?: AcceptedInputType) {
        if (newInput === input) {
            return;
        }
        if (input) {
            input.removeEventListener('blur', onBlur);
            input.removeEventListener('scroll', onScroll);
            input.removeEventListener('input', onInput);
            input.removeEventListener('keydown', onKeyDown);
        }
        input = newInput;
        if (input) {
            input.addEventListener('blur', onBlur);
            input.addEventListener('scroll', onScroll);
            input.addEventListener('input', onInput);
            input.addEventListener('keydown', onKeyDown);
        }
    }

    const onBlur = () => (active.value = false);
    const onScroll = () =>
        input && (dropdownPosition.value = getDropdownPosition(input));

    /**
     * When the text area is updated
     */
    function onInput() {
        if (!input) {
            return;
        }
        const activeTrigger = getActiveTrigger(
            input,
            triggers,
            MAX_SEARCH_LENGTH
        );
        if (activeTrigger) {
            active.value = true;
            search.value = activeTrigger.search;
            suggestions.value = searchItems(
                activeTrigger.trigger.items,
                search.value
            );
            selectedIndex.value = 0;
            dropdownPosition.value = getDropdownPosition(input);
        } else {
            active.value = false;
            search.value = '';
            suggestions.value = [];
            selectedIndex.value = 0;
        }
    }

    /**
     * Listen for special keys (selection, navigation within items)
     */
    function onKeyDown(event: KeyboardEvent) {
        if (!input || !active.value) {
            return;
        }
        // Handle up/down keys
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            event.stopPropagation();
            selectedIndex.value =
                (selectedIndex.value - 1 + suggestions.value.length) %
                suggestions.value.length;
            return;
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            event.stopPropagation();
            selectedIndex.value =
                (selectedIndex.value + 1) % suggestions.value.length;
            return;
        }
        // Handle selection key
        if (SELECT_KEYS.includes(event.key)) {
            event.preventDefault();
            event.stopPropagation();
            const selected = suggestions.value[selectedIndex.value];
            if (!selected) {
                return;
            }
            const activeTrigger = getActiveTrigger(
                input,
                triggers,
                MAX_SEARCH_LENGTH
            );
            if (!activeTrigger) {
                return;
            }
            const newValue =
                input.value.substring(0, activeTrigger.index) +
                selected.value +
                (activeTrigger.trigger.insertSpaceAfter !== false ? ' ' : '') +
                input.value.substring(getInputSelectionStart(input));
            setInputValue(input, newValue);
            active.value = false;
            return;
        }
    }

    return {
        setTextArea,
        active,
        search,
        suggestions,
        dropdownPosition,
        selectedIndex,
    };
}
