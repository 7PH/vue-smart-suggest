import { describe, it, expect } from 'vitest';
import { getDropdownPosition } from '../src/lib/util/dropdown';
import { CaretMetrics } from '../src/lib/util/layout';
import { DROPDOWN_MARGIN, DROPDOWN_WIDTH } from '../src/lib/constants';

const CARET_TOP = 70;
const CARET_HEIGHT = 20;

const caret = (top: number, left = 0) => ({ top, left, height: CARET_HEIGHT });

/**
 * The decision layer only ever sees numbers, so every case is a plain object.
 */
function metrics(overrides?: Partial<CaretMetrics>): CaretMetrics {
    return {
        caret: caret(CARET_TOP),
        box: { top: 0, bottom: 100, left: 0, right: 300 },
        origin: { top: 0, left: 0 },
        viewport: { width: 1000, height: 100 },
        scrollable: false,
        ...overrides,
    };
}

describe('dropdown', () => {
    describe('getDropdownPosition', () => {
        it('should position to top when theres space above', async () => {
            expect(getDropdownPosition(metrics(), 40)).toEqual({
                toTop: true,
                top: CARET_TOP - DROPDOWN_MARGIN - 40,
                left: DROPDOWN_MARGIN,
                width: DROPDOWN_WIDTH,
                height: 40,
            });
        });

        it('should reduce height when there is not enough space at all', async () => {
            expect(getDropdownPosition(metrics(), 1000)).toEqual({
                toTop: true,
                top: DROPDOWN_MARGIN,
                left: DROPDOWN_MARGIN,
                width: DROPDOWN_WIDTH,
                height: 100 - 2 * DROPDOWN_MARGIN,
            });
        });
    });
});
