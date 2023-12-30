import { AcceptedInputType, ActiveTrigger, Item, Trigger } from '../types';

export function getInputSelectionStart(input: AcceptedInputType): number {
    return input.selectionStart;
}

export function getInputValue(input: AcceptedInputType) {
    return input.value;
}

export function setInputValue(input: AcceptedInputType, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
}

/**
 * Search items by matching the search string with the item value.
 */
export function searchItems(items: Item[], search: string): Item[] {
    return items
        .filter((item) =>
            (item.searchMatch ?? item.value)
                .toLowerCase()
                .includes(search.toLowerCase())
        )
        .map((item) => ({
            item,
            score: [
                (item.searchMatch ?? item.value)
                    .toLowerCase()
                    .indexOf(search.toLowerCase()),
                item.value.length,
            ],
        }))
        .sort((a, b) => {
            // Return item whose match is closer to the beginning of the string
            if (a.score[0] !== b.score[0]) {
                return a.score[0] - b.score[0];
            }
            // Return shorter item
            return a.score[1] - b.score[1];
        })
        .map(({ item }) => item);
}

/**
 * Get the current active trigger for a given input
 */
export function getActiveTrigger(
    input: AcceptedInputType,
    triggers: Trigger[],
    maxSearchLength: number
): null | ActiveTrigger {
    // Start from cursor position and search for trigger keys. When found, if search regex until cursor position matches, activate suggestions
    const inputValue = getInputValue(input);
    const cursorPosition = getInputSelectionStart(input);
    let index = cursorPosition;
    while (index >= 0 && index > cursorPosition - maxSearchLength) {
        // For each potential trigger key
        for (const trigger of triggers) {
            // If the current character is the trigger key
            if (inputValue[index] === trigger.char) {
                // If the following characters until cursor position match the search regex
                const search = inputValue.substring(index + 1, cursorPosition);
                const searchRegExp =
                    trigger.searchRegExp?.source ?? /\S*/.source;
                const regexp = new RegExp('^' + searchRegExp + '$');
                if (
                    // Matching regexp
                    search.match(regexp) &&
                    // Whitespace before trigger
                    (!trigger.whitespaceBefore ||
                        index === 0 ||
                        /\s/.test(inputValue[index - 1]))
                ) {
                    return {
                        trigger,
                        search,
                        index,
                    };
                }
            }
        }
        --index;
    }

    return null;
}
