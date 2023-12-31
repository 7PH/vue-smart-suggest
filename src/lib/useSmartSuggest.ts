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
import { DROPDOWN_HEIGHT, MAX_SEARCH_LENGTH, SELECT_KEYS } from './constants';

export function useSmartSuggest(
    startTriggers?: Trigger[],
    startInput?: AcceptedInputType
) {
    /**
     * The textarea that is currently active
     */
    let input: AcceptedInputType | undefined = startInput;

    /**
     * Current triggers definition
     */
    const triggers = ref<Trigger[]>(startTriggers ?? []);

    /**
     * Whether the suggestions should be shown
     */
    const active = ref(false);

    /**
     * Current active trigger
     */
    const activeTrigger = ref<ActiveTrigger>();

    /**
     * Current list of suggestions
     */
    const items = ref<Item[]>([]);

    /**
     * Current active suggestion
     */
    const activeIndex = ref(0);

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
    function setInputElement(newInput?: AcceptedInputType) {
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
        if (newInput) {
            newInput.addEventListener('blur', onBlur);
            newInput.addEventListener('scroll', onScroll);
            newInput.addEventListener('input', onInput);
            newInput.addEventListener('keydown', onKeyDown);
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

        activeIndex.value = 0;

        const newActiveTrigger = getActiveTrigger(
            input,
            triggers.value,
            MAX_SEARCH_LENGTH
        );

        // Get list of items matching the search
        items.value = newActiveTrigger
            ? searchItems(
                  newActiveTrigger.trigger.items,
                  newActiveTrigger.search
              )
            : [];

        // No active trigger or no result, hide dropdown
        if (
            !newActiveTrigger ||
            (!newActiveTrigger.trigger.showNoResult && items.value.length === 0)
        ) {
            active.value = false;
            return;
        }

        // Update dropdown data
        dropdownPosition.value = getDropdownPosition(input, DROPDOWN_HEIGHT);
        activeTrigger.value = newActiveTrigger;
        active.value = true;
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
            activeIndex.value =
                (activeIndex.value - 1 + items.value.length) %
                items.value.length;
            return;
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            event.stopPropagation();
            activeIndex.value = (activeIndex.value + 1) % items.value.length;
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
            const activeItem = items.value[activeIndex.value];
            if (activeItem) {
                select(activeItem);
            }
            return;
        }
    }

    /**
     * Add a given item to the input and close the dropdown
     *
     * @param item Item to add
     */
    function select(item: Item) {
        if (input && activeTrigger.value) {
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
    }

    /**
     * In case the list of triggers is updated
     */
    function setTriggers(newTriggers: Trigger[]) {
        triggers.value = newTriggers;
    }

    return {
        setInputElement,
        setTriggers,
        select,
        active,
        items,
        dropdownPosition,
        activeIndex,
        activeTrigger,
    };
}
