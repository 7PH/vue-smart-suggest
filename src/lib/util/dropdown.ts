import { DropdownPosition } from '../types';
import { CaretMetrics } from './layout';
import { DROPDOWN_MARGIN, DROPDOWN_WIDTH } from '../constants';

/**
 * Keeps a value within bounds. `min` wins when the bounds cross, ie when there is not enough room at all.
 */
function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
}

/**
 * Decides where the dropdown goes from the measurements taken by `getCaretMetrics`.
 *
 * @note Metrics come in viewport coordinates, the result is relative to the container the dropdown lives in.
 * @returns null when the caret has been scrolled out of view, ie there is nothing left to anchor the dropdown to.
 */
export function getDropdownPosition(
    metrics: CaretMetrics,
    dropdownHeight: number
): DropdownPosition | null {
    const { caret, box, origin, viewport, scrollable } = metrics;

    // The whole caret line has to be visible, otherwise the dropdown would point at a sliver of clipped text
    if (
        scrollable &&
        (caret.top < box.top || caret.top + caret.height > box.bottom)
    ) {
        return null;
    }

    // Keep the dropdown on the input, then inside the viewport, then move it into container coordinates
    const left =
        clamp(
            clamp(caret.left, box.left, box.right) + DROPDOWN_MARGIN,
            DROPDOWN_MARGIN,
            viewport.width - DROPDOWN_WIDTH - DROPDOWN_MARGIN
        ) - origin.left;
    const base = { left, width: DROPDOWN_WIDTH };

    // Is there place for the dropdown below the caret?
    if (caret.top + dropdownHeight + 2 * DROPDOWN_MARGIN <= viewport.height) {
        return {
            ...base,
            toTop: false,
            top: caret.top + DROPDOWN_MARGIN - origin.top,
            height: dropdownHeight,
        };
    }

    // If there is place for the dropdown above the caret, show it there
    if (caret.top - dropdownHeight - DROPDOWN_MARGIN > 0) {
        return {
            ...base,
            toTop: true,
            top: caret.top - dropdownHeight - DROPDOWN_MARGIN - origin.top,
            height: dropdownHeight,
        };
    }

    // It fits nowhere: fill the viewport
    return {
        ...base,
        toTop: true,
        top: DROPDOWN_MARGIN - origin.top,
        height: viewport.height - 2 * DROPDOWN_MARGIN,
    };
}
