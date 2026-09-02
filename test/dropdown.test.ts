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
        it('should position to bottom when there is space everywhere', async () => {
            expect(getDropdownPosition(metrics(), 10)).toEqual({
                toTop: false,
                top: CARET_TOP + DROPDOWN_MARGIN,
                left: DROPDOWN_MARGIN,
                width: DROPDOWN_WIDTH,
                height: 10,
            });
        });

        it('should position to top when theres space above', async () => {
            expect(getDropdownPosition(metrics(), 40)).toEqual({
                toTop: true,
                top: CARET_TOP - DROPDOWN_MARGIN - 40,
                left: DROPDOWN_MARGIN,
                width: DROPDOWN_WIDTH,
                height: 40,
            });
        });

        it('should keep the dropdown inside the viewport when the input is near the right edge', async () => {
            const position = getDropdownPosition(
                metrics({
                    caret: caret(CARET_TOP, 900),
                    box: { top: 0, bottom: 100, left: 900, right: 1200 },
                    origin: { top: 0, left: 900 },
                }),
                10
            );

            // Container coordinates, ie 1000 - 200 - 10 - 900
            expect(position?.left).toEqual(-110);
        });

        it('should not shift the dropdown when the input sits away from the container origin', async () => {
            const position = getDropdownPosition(
                metrics({
                    caret: caret(CARET_TOP, 300),
                    box: { top: 0, bottom: 100, left: 300, right: 600 },
                    // The container starts 300px before the input
                    origin: { top: 0, left: 0 },
                }),
                10
            );

            expect(position?.left).toEqual(300 + DROPDOWN_MARGIN);
        });

        it('should not push the dropdown off the left edge of the viewport', async () => {
            const position = getDropdownPosition(
                metrics({ viewport: { width: 100, height: 100 } }),
                10
            );

            expect(position?.left).toEqual(DROPDOWN_MARGIN);
        });

        it('should keep the dropdown on the input when the caret is scrolled sideways', async () => {
            const position = getDropdownPosition(
                metrics({ caret: { top: CARET_TOP, left: 900 } }),
                10
            );

            // Clamped to the right edge of the input rather than following the caret out of it
            expect(position?.left).toEqual(300 + DROPDOWN_MARGIN);
        });

        it('should return no position when the caret is scrolled out of view', async () => {
            const position = getDropdownPosition(
                metrics({ caret: caret(-130), scrollable: true }),
                10
            );

            expect(position).toBeNull();
        });

        it('should return no position when the caret line is only partly visible', async () => {
            const position = getDropdownPosition(
                // Starts inside the box, but the line it sits on runs past the bottom edge
                metrics({ caret: caret(95), scrollable: true }),
                10
            );

            expect(position).toBeNull();
        });

        it('should ignore a caret out of view when the input does not scroll', async () => {
            const position = getDropdownPosition(
                metrics({ caret: caret(-130) }),
                10
            );

            expect(position).not.toBeNull();
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
