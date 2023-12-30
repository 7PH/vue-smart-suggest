import { describe, it, expect, vitest } from 'vitest';
import { useSmartSuggest } from '../src/lib';
import { DEFAULT_TRIGGER, factory } from './utils';

describe('useSmartSuggest', () => {
    it('should support changing input', async () => {
        const textArea1 = factory.textArea();
        const textArea2 = factory.textArea();

        const { setInputElement } = useSmartSuggest(DEFAULT_TRIGGER);
        setInputElement(textArea1);

        expect(textArea1.addEventListener).toHaveBeenCalledWith(
            'keydown',
            expect.any(Function)
        );

        setInputElement(textArea1);
        expect(textArea1.removeEventListener).not.toHaveBeenCalled();

        setInputElement(textArea2);
        expect(textArea1.removeEventListener).toHaveBeenCalledWith(
            'keydown',
            expect.any(Function)
        );
        expect(textArea2.addEventListener).toHaveBeenCalledWith(
            'keydown',
            expect.any(Function)
        );
    });
});
