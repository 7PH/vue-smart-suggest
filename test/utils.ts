import { vitest } from 'vitest';
import { Trigger } from '../src/lib/types';

export const DEFAULT_TRIGGER: Trigger[] = [
    {
        char: '@',
        items: [
            {
                value: 'user1',
                searchMatch: 'user1',
                image: 'http://some-image.localhost/user1.png',
            },
            {
                value: 'user2',
                searchMatch: 'user2',
                image: 'http://some-image.localhost/user2.png',
            },
            {
                value: 'guest10',
                searchMatch: 'guest10',
            },
            {
                value: '*guest0',
                searchMatch: '*guest0',
            },
        ],
    },
];

export const factory = {
    textArea: () => {
        const textArea = document.createElement('textarea');
        textArea.addEventListener = vitest.fn();
        textArea.removeEventListener = vitest.fn();
        return textArea;
    },
};
