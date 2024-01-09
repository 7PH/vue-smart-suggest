/**
 * Accepted input types
 *
 * @note Currently only supporting text area
 */
export type AcceptedInputType = HTMLTextAreaElement;

/**
 * Definition for a trigger ie what will trigger the suggestions, the corresponding items and how to add then
 */
export type Trigger = {
    /**
     * Character that will trigger the suggestions
     */
    char: string;

    /**
     * List of items to suggest
     */
    items: Item[];

    /**
     * Regular expression to match the search. The dropdown will be shown if what's after the trigger matches this regular expression
     */
    searchRegExp?: RegExp;

    /**
     * Whether there should be a whitespace before the trigger for the dropdown to be shown
     *
     * @default true
     */
    whitespaceBefore?: boolean;

    /**
     * Whether there should be a whitespace after a suggestion is selected
     *
     * @default true
     */
    insertSpaceAfter?: boolean;

    /**
     * Whether to show "No result" in the dropdown when there are no suggestions instead of just hiding it
     *
     * @default false
     */
    showNoResult?: boolean;

    /**
     * Maximum number of results to show in the dropdown
     *
     * @default Infinity
     */
    maxRenderedItems?: number;
};

/**
 * Definition for a suggestion item
 */
export type Item = {
    /**
     * The value to insert when the suggestion is selected. By default, the trigger is not included so add it if needed
     */
    value: string;

    /**
     * The part of the item that matches the search (by default, case-insensitive and substring match)
     *
     * @default {value}
     */
    searchMatch?: string;

    /**
     * An optional label to show in the suggestion instead of the value
     *
     * @default {value}
     */
    label?: string;

    /**
     * An optional image to show in the suggestion
     */
    image?: string;

    /**
     * Items can be enhanced with custom properties, particularly useful if you are implementing a custom dropdown item slot
     */
    [key: string]: unknown;
};

/**
 * The current dropdown position.
 *
 * @note Mostly internal unless you want to implement a custom dropdown
 */
export type DropdownPosition = {
    /**
     * Whether the dropdown is shown with top direction (ie above the cursor)
     */
    toTop: boolean;

    /**
     * Position relative to the container top
     */
    top: number;

    /**
     * Position relative to the container left
     */
    left: number;

    /**
     * Width of the dropdown
     */
    width: number;

    /**
     * Total height of the dropdown container
     *
     * @note This height is fixed regardless of the number of items in the suggestions
     */
    height: number;
};

/**
 * The current active trigger
 */
export type ActiveTrigger = {
    /**
     * Current active trigger object
     */
    trigger: Trigger;

    /**
     * Current search term (what's between the trigger and the cursor)
     */
    search: string;

    /**
     * Index of the active trigger character in the input
     */
    index: number;
};
