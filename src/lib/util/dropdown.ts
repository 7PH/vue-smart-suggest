import getCaretPosition from 'textarea-caret';
import { AcceptedInputType, DropdownPosition } from '../types';
import { getInputSelectionStart } from './input';
import { DROPDOWN_MARGIN, DROPDOWN_WIDTH } from '../constants';

export function getDropdownPosition(
    input: AcceptedInputType,
    dropdownHeight: number
): DropdownPosition {
    const { top, left } = getCaretPosition(
        input,
        getInputSelectionStart(input)
    );

    // Is there place for the dropdown below the caret?
    const inputRect = input.getBoundingClientRect();
    if (
        inputRect.top + top + dropdownHeight + 2 * DROPDOWN_MARGIN <=
        window.innerHeight
    ) {
        return {
            toTop: false,
            top: top + input.offsetTop + DROPDOWN_MARGIN,
            left: left + input.offsetLeft + DROPDOWN_MARGIN,
            width: DROPDOWN_WIDTH,
            height: dropdownHeight,
        };
    }

    // If there is place for the dropdown above the caret, show it there
    if (inputRect.top + top - dropdownHeight - DROPDOWN_MARGIN > 0) {
        return {
            toTop: true,
            top: top + input.offsetTop - dropdownHeight - DROPDOWN_MARGIN,
            left: left + input.offsetLeft + DROPDOWN_MARGIN,
            width: DROPDOWN_WIDTH,
            height: dropdownHeight,
        };
    }

    return {
        toTop: true,
        top: input.offsetTop - inputRect.top + DROPDOWN_MARGIN,
        left: left + input.offsetLeft + DROPDOWN_MARGIN,
        width: DROPDOWN_WIDTH,
        height: window.innerHeight - 2 * DROPDOWN_MARGIN,
    };
}
