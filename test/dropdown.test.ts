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
beforeAll(() => {
    window.innerHeight = 100;
});

afterAll(() => {
    window.innerHeight = originalWindowInnerHeight;
});

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
