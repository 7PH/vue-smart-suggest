import { faker } from '@faker-js/faker';
import { Trigger } from '../lib/types';
import sticker0 from './stickers/_(.gif';
import sticker1 from './stickers/_doute_.gif';
import sticker2 from './stickers/_hap_.gif';
import sticker3 from './stickers/_noel_.gif';

// Use dummy seed to get predictable results
faker.seed(1010);

export const userTrigger: Trigger = {
    char: '@',
    insertSpaceAfter: false,
    searchRegExp: /[a-zA-Z ]*/,
    items: Array.from({ length: 10 }).map(() => {
        const name = faker.person.fullName();
        return {
            value: `@${name}`,
            label: name,
        };
    }),
};

export const emojiTrigger: Trigger = {
    char: ':',
    whitespaceBefore: true,
    showNoResult: true,
    searchRegExp: /[a-zA-Z0-9-_)(]*/,
    items: [
        [':(', sticker0],
        [':doute:', sticker1],
        [':hap:', sticker2],
        [':noel:', sticker3],
    ].map(([value, image]) => ({
        value,
        image,
    })),
};
