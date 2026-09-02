import { vitest } from 'vitest';
import { Trigger } from '../src/lib/types';

export const DEFAULT_TRIGGER: Trigger[] = [
    {
        char: '@',
        items: [
            {
                value: 'user1',
                image: 'http://some-image.localhost/user1.png',
            },
            {
                value: 'user2',
                image: 'http://some-image.localhost/user2.png',
            },
            {
                value: 'guest10',
            },
            {
                value: '*guest0',
            },
        ],
    },
];

export const factory = {
    textArea: () => {
        const textArea = document.createElement('textarea');
        textArea.addEventListener = vitest.fn();
        textArea.removeEventListener = vitest.fn();
        // jsdom has no layout: fake a box smaller than its content, ie a textarea with its own scrollbar
        Object.defineProperty(textArea, 'clientWidth', {
            value: 300,
            configurable: true,
        });
        Object.defineProperty(textArea, 'clientHeight', {
            value: 100,
            configurable: true,
        });
        Object.defineProperty(textArea, 'scrollHeight', {
            value: 300,
            configurable: true,
        });
        return textArea;
    },
    input: (type = 'text') => {
        const input = document.createElement('input');
        input.type = type;
        input.addEventListener = vitest.fn();
        input.removeEventListener = vitest.fn();
        // jsdom has no layout: a single line, so the box is never taller than its content
        Object.defineProperty(input, 'clientWidth', {
            value: 300,
            configurable: true,
        });
        Object.defineProperty(input, 'clientHeight', {
            value: 30,
            configurable: true,
        });
        Object.defineProperty(input, 'scrollHeight', {
            value: 30,
            configurable: true,
        });
        return input;
    },
};
