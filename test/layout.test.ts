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

/**
 * jsdom has no layout, so where the input sits on the page has to be faked.
 */
function positionTextArea(
    textArea: HTMLTextAreaElement,
    { top, left, offsetTop, offsetLeft }: Record<string, number>
) {
    textArea.getBoundingClientRect = () => ({ top, left }) as DOMRect;
    Object.defineProperty(textArea, 'offsetTop', { value: offsetTop });
    Object.defineProperty(textArea, 'offsetLeft', { value: offsetLeft });
}

describe('layout', () => {
    describe('getCaretMetrics', () => {
        it('should report the caret in viewport coordinates', async () => {
            const textArea = factory.textArea();
            positionTextArea(textArea, {
                top: 100,
                left: 200,
                offsetTop: 0,
                offsetLeft: 0,
            });

            expect(getCaretMetrics(textArea).caret).toMatchObject({
                top: 100 + CARET_POSITION.top,
                left: 200 + CARET_POSITION.left,
            });
        });

        it('should report the height of the caret line', async () => {
            expect(getCaretMetrics(factory.textArea()).caret.height).toEqual(
                CARET_POSITION.height
            );
        });

        it('should remove the elements own scroll from the caret', async () => {
            const textArea = factory.textArea();
            positionTextArea(textArea, {
                top: 100,
                left: 200,
                offsetTop: 0,
                offsetLeft: 0,
            });
            textArea.scrollTop = 40;
            textArea.scrollLeft = 5;

            expect(getCaretMetrics(textArea).caret).toMatchObject({
                top: 100 + CARET_POSITION.top - 40,
                left: 200 + CARET_POSITION.left - 5,
            });
        });

        it('should report the visible box of the input', async () => {
            const textArea = factory.textArea();
            positionTextArea(textArea, {
                top: 100,
                left: 200,
                offsetTop: 0,
                offsetLeft: 0,
            });

            // The factory fakes a 300x100 client box
            expect(getCaretMetrics(textArea).box).toEqual({
                top: 100,
                bottom: 200,
                left: 200,
                right: 500,
            });
        });

        it('should report the visible box inside the border, not the border box', async () => {
            const textArea = factory.textArea();
            positionTextArea(textArea, {
                top: 100,
                left: 200,
                offsetTop: 0,
                offsetLeft: 0,
            });
            Object.defineProperty(textArea, 'clientTop', { value: 2 });
            Object.defineProperty(textArea, 'clientLeft', { value: 3 });

            // Content is clipped at the padding box, ie the border box shrunk by its borders
            expect(getCaretMetrics(textArea).box).toEqual({
                top: 102,
                bottom: 202,
                left: 203,
                right: 503,
            });
        });

        it('should report the container origin, not the input position', async () => {
            const textArea = factory.textArea();
            positionTextArea(textArea, {
                top: 100,
                left: 200,
                offsetTop: 20,
                offsetLeft: 60,
            });

            expect(getCaretMetrics(textArea).origin).toEqual({
                top: 80,
                left: 140,
            });
        });

        it('should report the viewport size', async () => {
            expect(getCaretMetrics(factory.textArea()).viewport).toEqual({
                width: 1000,
                height: 100,
            });
        });

        it('should report whether the input scrolls its own content', async () => {
            // The factory fakes content taller than the box
            expect(getCaretMetrics(factory.textArea()).scrollable).toBe(true);

            const notScrollable = factory.textArea();
            Object.defineProperty(notScrollable, 'scrollHeight', { value: 50 });
            expect(getCaretMetrics(notScrollable).scrollable).toBe(false);
        });
    });
});
