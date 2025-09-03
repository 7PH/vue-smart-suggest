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

    // Calculate base positioning
    const inputRect = input.getBoundingClientRect();
    const baseLeft = left + input.offsetLeft + DROPDOWN_MARGIN;
    
    // Check for horizontal overflow and adjust if necessary
    const adjustedLeft = baseLeft + inputRect.left + DROPDOWN_WIDTH > window.innerWidth
        ? inputRect.width - DROPDOWN_WIDTH - DROPDOWN_MARGIN
        : baseLeft;

    // Is there place for the dropdown below the caret?
    if (
        inputRect.top + top + dropdownHeight + 2 * DROPDOWN_MARGIN <=
        window.innerHeight
    ) {
        return {
            toTop: false,
            top: top + input.offsetTop + DROPDOWN_MARGIN,
            left: adjustedLeft,
            width: DROPDOWN_WIDTH,
            height: dropdownHeight,
        };
    }

    // If there is place for the dropdown above the caret, show it there
    if (inputRect.top + top - dropdownHeight - DROPDOWN_MARGIN > 0) {
        return {
            toTop: true,
            top: top + input.offsetTop - dropdownHeight - DROPDOWN_MARGIN,
            left: adjustedLeft,
            width: DROPDOWN_WIDTH,
            height: dropdownHeight,
        };
    }

    return {
        toTop: true,
        top: input.offsetTop - inputRect.top + DROPDOWN_MARGIN,
        left: adjustedLeft,
        width: DROPDOWN_WIDTH,
        height: window.innerHeight - 2 * DROPDOWN_MARGIN,
    };
}
