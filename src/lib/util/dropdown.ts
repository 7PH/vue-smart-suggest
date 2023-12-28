import getCaretPosition from 'textarea-caret';
import { AcceptedInputType, DropdownPosition } from '../types';
import { getInputSelectionStart } from './input';
import { DROPDOWN_HEIGHT, DROPDOWN_MARGIN, DROPDOWN_WIDTH } from '../constants';

export function getDropdownPosition(
    input: AcceptedInputType
): DropdownPosition {
    const { top, left } = getCaretPosition(
        input,
        getInputSelectionStart(input)
    );

    // Is there place for the dropdown below the caret?
    const inputRect = input.getBoundingClientRect();
    if (
        inputRect.top + top + DROPDOWN_HEIGHT + 2 * DROPDOWN_MARGIN <
        window.innerHeight
    ) {
        return {
            top: top + input.offsetTop + DROPDOWN_MARGIN,
            left: left + input.offsetLeft + DROPDOWN_MARGIN,
            width: DROPDOWN_WIDTH,
            height: DROPDOWN_HEIGHT,
        };
    }

    // If there is place for the dropdown above the caret, show it there
    if (inputRect.top + top - DROPDOWN_HEIGHT - DROPDOWN_MARGIN > 0) {
        return {
            top: top + input.offsetTop - DROPDOWN_HEIGHT - DROPDOWN_MARGIN,
            left: left + input.offsetLeft + DROPDOWN_MARGIN,
            width: DROPDOWN_WIDTH,
            height: DROPDOWN_HEIGHT,
        };
    }

    return {
        top: input.offsetTop - inputRect.top + DROPDOWN_MARGIN,
        left: left + input.offsetLeft + DROPDOWN_MARGIN,
        width: DROPDOWN_WIDTH,
        height: window.innerHeight - 2 * DROPDOWN_MARGIN,
    };
}
