import { ref } from 'vue';
import {
    AcceptedInputType,
    ActiveTrigger,
    DropdownPosition,
    Item,
    Trigger,
} from './types';
import {
    getActiveTrigger,
    getInputSelectionStart,
    searchItems,
    setInputValue,
} from './util/input';
import { getDropdownPosition } from './util/dropdown';
import { DROPDOWN_HEIGHT, SELECT_KEYS } from './constants';

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
     * Current active trigger
     */
    const activeTrigger = ref<ActiveTrigger>();

    /**
     * Current search
     */
    const search = ref('');

    /**
     * Current list of suggestions
     */
    const items = ref<Item[]>([]);

    /**
     * Current selected suggestion
     */
    const selectedIndex = ref(0);

    /**
     * Current dropdown position
     */
    const dropdownPosition = ref<DropdownPosition>({
        toTop: false,
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
        input &&
        (dropdownPosition.value = getDropdownPosition(input, DROPDOWN_HEIGHT));

    /**
     * When the text area is updated
     */
    function onInput() {
        if (!input) {
            return;
        }
        const newActiveTrigger = getActiveTrigger(
            input,
            triggers,
            MAX_SEARCH_LENGTH
        );
        if (newActiveTrigger) {
            activeTrigger.value = newActiveTrigger;
            active.value = true;
            search.value = newActiveTrigger.search;
            items.value = searchItems(
                newActiveTrigger.trigger.items,
                search.value
            );
            selectedIndex.value = 0;
            dropdownPosition.value = getDropdownPosition(
                input,
                DROPDOWN_HEIGHT
            );
        } else {
            active.value = false;
            search.value = '';
            items.value = [];
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
                (selectedIndex.value - 1 + items.value.length) %
                items.value.length;
            return;
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            event.stopPropagation();
            selectedIndex.value =
                (selectedIndex.value + 1) % items.value.length;
            return;
        }
        // Handle force-close key
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            active.value = false;
            return;
        }
        // Handle selection key
        if (SELECT_KEYS.includes(event.key)) {
            event.preventDefault();
            event.stopPropagation();
            const selected = items.value[selectedIndex.value];
            if (!selected) {
                return;
            }
            select(selected);
            return;
        }
    }

    function select(item: Item) {
        if (!input) {
            return;
        }
        if (!activeTrigger.value) {
            return;
        }
        const newValue =
            input.value.substring(0, activeTrigger.value.index) +
            item.value +
            (activeTrigger.value.trigger.insertSpaceAfter !== false
                ? ' '
                : '') +
            input.value.substring(getInputSelectionStart(input));
        setInputValue(input, newValue);
        active.value = false;
    }

    return {
        setTextArea,
        select,
        active,
        search,
        items,
        dropdownPosition,
        selectedIndex,
        activeTrigger,
    };
}
