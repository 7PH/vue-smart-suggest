/**
 * Margin between the caret and the dropdown.
 */
export const DROPDOWN_MARGIN = 10;

/**
 * Dropdown container heihgt. The actual dropdown fits the items height inside this container.
 */
export const DROPDOWN_HEIGHT = 300;

/**
 * Dropdown fixed width
 */
export const DROPDOWN_WIDTH = 200;

/**
 * Keys that should trigger the selection of a suggestion.
 */
export const SELECT_KEYS = ['Enter', 'Tab', 'ArrowRight'];

/**
 * The algorithm that matches the active triggers need to look for trigger characters before the cursor.
 * We only go back this number of characters to avoid performance issues.
 * A side effect of this is that the max search length is limited by this number.
 */
export const MAX_SEARCH_LENGTH = 100;
