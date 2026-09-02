import { describe, it, expect } from 'vitest';
import {
    getActiveTrigger,
    getInputSelectionStart,
} from '../src/lib/util/input';
import { MAX_SEARCH_LENGTH } from '../src/lib/constants';
import { DEFAULT_TRIGGER, factory } from './utils';

describe('input', () => {
    describe('getInputSelectionStart', () => {
        it('should report the caret of a text input', async () => {
            const input = factory.input();
            input.value = 'hello';
            input.setSelectionRange(5, 5);

            expect(getInputSelectionStart(input)).toEqual(5);
        });

        it('should report no caret for input types that have none', async () => {
            expect(getInputSelectionStart(factory.input('email'))).toBeNull();
            expect(getInputSelectionStart(factory.input('number'))).toBeNull();
        });
    });

    describe('getActiveTrigger', () => {
        it('should find a trigger in a text input', async () => {
            const input = factory.input();
            input.value = 'hello @us';
            input.setSelectionRange(9, 9);

            expect(
                getActiveTrigger(input, DEFAULT_TRIGGER, MAX_SEARCH_LENGTH)
            ).toMatchObject({ search: 'us', index: 6 });
        });

        it('should find no trigger when the input has no caret', async () => {
            const input = factory.input('email');
            input.value = 'hello @us';

            expect(
                getActiveTrigger(input, DEFAULT_TRIGGER, MAX_SEARCH_LENGTH)
            ).toBeNull();
        });
    });
});
