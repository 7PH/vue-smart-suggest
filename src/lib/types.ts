export type AcceptedInputType = HTMLTextAreaElement;

/**
 * Definition for a trigger. A trigger consist of:
 * - `char` A character that will trigger the suggestions
 * - `items` A list of items to suggest
 * - `searchRegExp` A regular expression to match the search. The dropdown will be shown if what's after the trigger matches this regular expression
 * - `whitespaceBefore` Whether there should be a whitespace before the trigger for the dropdown to be shown
 * - `insertSpaceAfter` Whether there should be a whitespace after a suggestion is selected
 */
export type Trigger = {
    char: string;
    items: Item[];
    searchRegExp?: RegExp;
    whitespaceBefore?: boolean;
    insertSpaceAfter?: boolean;
};

/**
 * Definition for a suggestion item. A suggestion item consist of:
 * - `searchMatch` The part of the item that matches the search (by default, case-insensitive and substring match)
 * - `value` The value to insert when the suggestion is selected. By default, the trigger is not included so add it if needed
 * - `label` An optional label to show in the suggestion instead of the value
 * - `image` An optional image to show in the suggestion
 */
export type Item = {
    searchMatch: string;
    value: string;
    label?: string;
    image?: string;
    [key: string]: unknown;
};

/**
 * The current dropdown position.
 *
 * @note Mostly internal but to be used if you are using a custom dropdown
 */
export type DropdownPosition = {
    toTop: boolean;
    top: number;
    left: number;
    width: number;
    height: number;
};

/**
 * The current active trigger. This consist of:
 * - `trigger` The current trigger
 * - `search` The current search (what's between the trigger and the cursor)
 * - `index` The index of the active trigger in the input
 */
export type ActiveTrigger = {
    trigger: Trigger;
    search: string;
    index: number;
};
