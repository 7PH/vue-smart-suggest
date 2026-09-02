import { describe, it, expect } from 'vitest';
import {
    getActiveTrigger,
    getInputSelectionStart,
} from '../src/lib/util/input';
import { MAX_SEARCH_LENGTH } from '../src/lib/constants';
import { DEFAULT_TRIGGER, factory } from './utils';

describe('input', () => {
    describe('getInputSelectionStart', () => {
        it('should report no caret for input types that have none', async () => {
            expect(getInputSelectionStart(factory.input('email'))).toBeNull();
            expect(getInputSelectionStart(factory.input('number'))).toBeNull();
        });
    });

    describe('getActiveTrigger', () => {
        it('should find no trigger when the input has no caret', async () => {
            const input = factory.input('email');
            input.value = 'hello @us';

            expect(
                getActiveTrigger(input, DEFAULT_TRIGGER, MAX_SEARCH_LENGTH)
            ).toBeNull();
        });
    });
});
