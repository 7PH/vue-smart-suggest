import getCaretPosition from 'textarea-caret';
import {
    beforeEach,
    describe,
    it,
    vi,
    afterEach,
    expect,
    beforeAll,
    afterAll,
} from 'vitest';
import { factory } from './utils';
import { getDropdownPosition } from '../src/lib/util/dropdown';
import { DROPDOWN_MARGIN, DROPDOWN_WIDTH } from '../src/lib/constants';

const CARET_POSITION = {
    top: 70,
    left: 0,
    height: 0,
};

vi.mock('textarea-caret', async () => {
    return {
        default: () => CARET_POSITION,
    };
});

const originalWindowInnerHeight = window.innerHeight;
const originalWindowInnerWidth = window.innerWidth;
beforeAll(() => {
    window.innerHeight = 100;
    window.innerWidth = 1000;
});

afterAll(() => {
    window.innerHeight = originalWindowInnerHeight;
    window.innerWidth = originalWindowInnerWidth;
});

/**
 * jsdom has no layout, so the position of the input in the viewport has to be faked.
 */
function positionTextArea(
    textArea: HTMLTextAreaElement,
    { viewportLeft, offsetLeft }: { viewportLeft: number; offsetLeft: number }
) {
    textArea.getBoundingClientRect = () =>
        ({ top: 0, left: viewportLeft }) as DOMRect;
    Object.defineProperty(textArea, 'offsetLeft', { value: offsetLeft });
}

describe('dropdown', () => {
    describe('getDropdownPosition', () => {
        it('should position to bottom when there is space everywhere', async () => {
            const textArea = factory.textArea();

            expect(getDropdownPosition(textArea, 10)).toEqual({
                toTop: false,
                top: CARET_POSITION.top + DROPDOWN_MARGIN,
                left: DROPDOWN_MARGIN,
                width: DROPDOWN_WIDTH,
                height: 10,
            });
        });

        it('should position to top when theres space above', async () => {
            const textArea = factory.textArea();

            console.log(window.innerHeight);

            expect(getDropdownPosition(textArea, 40)).toEqual({
                toTop: true,
                top: CARET_POSITION.top - DROPDOWN_MARGIN - 40,
                left: DROPDOWN_MARGIN,
                width: DROPDOWN_WIDTH,
                height: 40,
            });
        });

        it('should keep the dropdown inside the viewport when the input is near the right edge', async () => {
            const textArea = factory.textArea();
            positionTextArea(textArea, { viewportLeft: 900, offsetLeft: 0 });

            const { left } = getDropdownPosition(textArea, 10);

            // Container coordinates, ie 1000 - 200 - 10 - 900
            expect(left).toEqual(-110);
        });

        it('should not shift the dropdown when the input fits despite a large offsetLeft', async () => {
            const textArea = factory.textArea();
            positionTextArea(textArea, { viewportLeft: 300, offsetLeft: 300 });

            const { left } = getDropdownPosition(textArea, 10);

            expect(left).toEqual(300 + DROPDOWN_MARGIN);
        });

        it('should not push the dropdown off the left edge of the viewport', async () => {
            const textArea = factory.textArea();
            positionTextArea(textArea, { viewportLeft: 0, offsetLeft: 0 });
            window.innerWidth = 100;

            const { left } = getDropdownPosition(textArea, 10);
            window.innerWidth = 1000;

            expect(left).toEqual(DROPDOWN_MARGIN);
        });

        it('should reduce height when there is not enough space at all', async () => {
            const textArea = factory.textArea();

            expect(getDropdownPosition(textArea, 1000)).toEqual({
                toTop: true,
                top: DROPDOWN_MARGIN,
                left: DROPDOWN_MARGIN,
                width: DROPDOWN_WIDTH,
                height: window.innerHeight - 2 * DROPDOWN_MARGIN,
            });
        });
    });
});
