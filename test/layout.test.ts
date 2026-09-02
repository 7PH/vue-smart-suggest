import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { factory } from './utils';
import { getCaretMetrics } from '../src/lib/util/layout';

const CARET_POSITION = {
    top: 70,
    left: 20,
    height: 24,
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

describe('layout', () => {
    describe('getCaretMetrics', () => {
        it('should report whether the input scrolls its own content', async () => {
            // The factory fakes content taller than the box
            expect(getCaretMetrics(factory.textArea()).scrollable).toBe(true);

            const notScrollable = factory.textArea();
            Object.defineProperty(notScrollable, 'scrollHeight', { value: 50 });
            expect(getCaretMetrics(notScrollable).scrollable).toBe(false);
        });
    });
});
