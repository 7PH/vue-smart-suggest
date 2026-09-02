import getCaretPosition from 'textarea-caret';
import { AcceptedInputType } from '../types';
import { getInputSelectionStart } from './input';

export type Point = {
    top: number;
    left: number;
};

/**
 * Everything the dropdown needs to know about the page, measured in viewport coordinates.
 *
 * @note Facts only. Deciding what to do with them is `getDropdownPosition`.
 */
export type CaretMetrics = {
    /**
     * Position of the caret, plus the height of the line it sits on
     */
    caret: Point & { height: number };

    /**
     * Visible content box of the input, ie the area the caret can be seen in
     */
    box: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };

    /**
     * Origin the dropdown is positioned against, ie the input's offsetParent
     */
    origin: Point;

    /**
     * Size of the visible page
     */
    viewport: {
        width: number;
        height: number;
    };

    /**
     * Whether the input scrolls its own content, ie whether it can hide its own caret
     */
    scrollable: boolean;
};

export function getCaretMetrics(input: AcceptedInputType): CaretMetrics {
    const caret = getCaretPosition(input, getInputSelectionStart(input));
    const box = input.getBoundingClientRect();

    return {
        // `textarea-caret` measures against the unscrolled content, so remove the element's own scroll
        caret: {
            top: box.top + caret.top - input.scrollTop,
            left: box.left + caret.left - input.scrollLeft,
            height: caret.height,
        },
        // Content is clipped at the padding box, which `clientTop`/`clientLeft` (the border widths) offset to
        box: {
            top: box.top + input.clientTop,
            bottom: box.top + input.clientTop + input.clientHeight,
            left: box.left + input.clientLeft,
            right: box.left + input.clientLeft + input.clientWidth,
        },
        origin: {
            top: box.top - input.offsetTop,
            left: box.left - input.offsetLeft,
        },
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
        },
        // An element that is not laid out reports a zero-sized box, which is not the same as one that scrolls
        scrollable: input.scrollHeight > input.clientHeight,
    };
}
