import { faker } from '@faker-js/faker';
import { Trigger } from '../lib/types';

// Use dummy seed to get predictable results
faker.seed(1010);

export const userTrigger: Trigger = {
    char: '@',
    items: Array.from({ length: 10 }).map(() => {
        const name = faker.person.firstName();
        return {
            searchMatch: name,
            value: `@${name.replace(/\s/g, '')}`,
            label: name,
        };
    }),
};

export const emojiTrigger: Trigger = {
    char: ':',
    items: Array.from({ length: 10 }).map(() => {
        const name = faker.word.interjection();
        return {
            searchMatch: name,
            value: `:${name}:`,
            label: name,
        };
    }),
};
