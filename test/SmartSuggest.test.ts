import { describe, it, expect, beforeAll, vitest, afterAll } from 'vitest';
import { VueWrapper, mount } from '@vue/test-utils';
import SmartSuggest from '../src/lib/SmartSuggest.vue';
import { Trigger } from '../src/lib/types';
import { nextTick } from 'vue';
import { DEFAULT_TRIGGER } from './utils';

const mountSmartSuggest = (
    props?: Record<string, unknown>,
    slots?: Record<string, string>
) => {
    return mount(SmartSuggest, {
        props: {
            triggers: DEFAULT_TRIGGER,
            ...props,
        },
        slots: {
            default: '<textarea />',
            dropdown: '',
            item: '',
            'no-result': '',
            ...slots,
        },
    });
};

const ui = {
    expectDropdownVisibility: async (
        wrapper: VueWrapper,
        visible: boolean,
        nowait?: boolean
    ) => {
        !nowait && (await nextTick());
        expect(wrapper.find('.smart-suggest-dropdown').exists()).toBe(visible);
    },
    expectDropdownItems: async (
        wrapper: VueWrapper,
        items: string[],
        nowait?: boolean
    ) => {
        !nowait && (await nextTick());
        const dropdownItems = wrapper.findAll('.smart-suggest-item');
        expect(dropdownItems).toHaveLength(items.length);
        items.forEach((item, index) => {
            expect(dropdownItems[index].text()).toBe(item);
        });
    },
    clickDropdownItem: async (
        wrapper: VueWrapper,
        index: number,
        nowait?: boolean
    ) => {
        !nowait && (await nextTick());
        wrapper.findAll('.smart-suggest-item')[index].trigger('mousedown');
    },
};

const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vitest.fn();
});

afterAll(() => {
    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
});

describe('should render correctly', () => {
    it('should add class prop to input container', async () => {
        const wrapper = mountSmartSuggest({
            class: 'test-class',
        });

        expect(wrapper.find('.smart-suggest').classes()).toContain(
            'test-class'
        );
    });
});

describe('should trigger dropdown and search', () => {
    it('should render no result', async () => {
        const wrapper = mountSmartSuggest({
            triggers: [
                {
                    ...DEFAULT_TRIGGER[0],
                    showNoResult: true,
                } as Trigger,
            ],
        });

        wrapper.find('textarea').setValue('hello world. @test');
        await ui.expectDropdownVisibility(wrapper, true);
        expect(wrapper.find('.smart-suggest-no-result').exists()).toBe(true);
    });

    it('should respect whitespace before trigger constraint', async () => {
        const wrapper = mountSmartSuggest({
            triggers: [
                {
                    ...DEFAULT_TRIGGER[0],
                    whitespaceBefore: true,
                } as Trigger,
            ],
        });

        wrapper.find('textarea').setValue('hello world.@');
        await ui.expectDropdownVisibility(wrapper, false);
    });

    it('should sort dropdown suggestions correctly', async () => {
        const wrapper = mountSmartSuggest();

        wrapper.find('textarea').setValue('hello world. @');
        await ui.expectDropdownItems(wrapper, [
            'user1',
            'user2',
            'guest10',
            '*guest0',
        ]);

        wrapper.find('textarea').setValue('hello world. @g');
        await ui.expectDropdownItems(wrapper, ['guest10', '*guest0']);

        wrapper.find('textarea').setValue('hello world. @guest');
        await ui.expectDropdownItems(wrapper, ['guest10', '*guest0']);

        wrapper.find('textarea').setValue('hello world. @*');
        await ui.expectDropdownItems(wrapper, ['*guest0']);
    });
});

describe('should select item', () => {
    it.each([['Enter'], ['Tab'], ['ArrowRight']])(
        'should select item on accepted keys',
        async (key) => {
            const wrapper = mountSmartSuggest();

            wrapper.find('textarea').setValue('hello world. @use');
            await ui.expectDropdownItems(wrapper, ['user1', 'user2']);
            wrapper.find('textarea').trigger('keydown', { key });

            expect(wrapper.find('textarea').element.value).toBe(
                'hello world. user1 '
            );
        }
    );

    it('should navigate through items using arrow keys', async () => {
        const wrapper = mountSmartSuggest();

        wrapper.find('textarea').setValue('hello world. @use');
        await ui.expectDropdownItems(wrapper, ['user1', 'user2']);

        expect(wrapper.find('.smart-suggest-item-active').text()).toBe('user1');

        await wrapper.find('textarea').trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.find('.smart-suggest-item-active').text()).toBe('user2');

        await wrapper.find('textarea').trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.find('.smart-suggest-item-active').text()).toBe('user1');

        await wrapper.find('textarea').trigger('keydown', { key: 'ArrowUp' });
        expect(wrapper.find('.smart-suggest-item-active').text()).toBe('user2');

        await wrapper.find('textarea').trigger('keydown', { key: 'ArrowUp' });
        expect(wrapper.find('.smart-suggest-item-active').text()).toBe('user1');

        await wrapper.find('textarea').trigger('keydown', { key: 'ArrowDown' });
        await wrapper.find('textarea').trigger('keydown', { key: 'Enter' });

        expect(wrapper.find('textarea').element.value).toBe(
            'hello world. user2 '
        );
    });


    it('should not add space after item if insertSpaceAfter is false', async () => {
        const wrapper = mountSmartSuggest({
            triggers: [
                {
                    ...DEFAULT_TRIGGER[0],
                    insertSpaceAfter: false,
                } as Trigger,
            ],
        });

        wrapper.find('textarea').setValue('hello world. @*guest');
        await ui.clickDropdownItem(wrapper, 0);

        expect(wrapper.find('textarea').element.value).toBe(
            'hello world. *guest0'
        );
    });
});

describe('should follow the caret', () => {
    /**
     * jsdom has no layout, so fake a box smaller than its content, ie a textarea with its own scrollbar.
     */
    function makeScrollable(textArea: HTMLTextAreaElement) {
        Object.defineProperty(textArea, 'clientHeight', { value: 100 });
        Object.defineProperty(textArea, 'scrollHeight', { value: 300 });
    }

    it('should reopen the dropdown when the caret is scrolled back into view', async () => {
        const wrapper = mountSmartSuggest();
        const textArea = wrapper.find('textarea');

        textArea.setValue('hello world. @us');
        makeScrollable(textArea.element);
        textArea.element.scrollTop = 200;
        await textArea.trigger('scroll');
        await ui.expectDropdownVisibility(wrapper, false);

        textArea.element.scrollTop = 0;
        await textArea.trigger('scroll');

        await ui.expectDropdownVisibility(wrapper, true);
    });

    it('should stay closed after escape whatever the scroll', async () => {
        const wrapper = mountSmartSuggest();
        const textArea = wrapper.find('textarea');

        textArea.setValue('hello world. @us');
        await ui.expectDropdownVisibility(wrapper, true);

        await textArea.trigger('keydown', { key: 'Escape' });
        await ui.expectDropdownVisibility(wrapper, false);

        await textArea.trigger('scroll');

        await ui.expectDropdownVisibility(wrapper, false);
    });

    it('should close the dropdown when the caret is scrolled out of view', async () => {
        const wrapper = mountSmartSuggest();
        const textArea = wrapper.find('textarea');

        textArea.setValue('hello world. @us');
        await ui.expectDropdownVisibility(wrapper, true);

        // Scroll the caret past the top edge of the box
        makeScrollable(textArea.element);
        textArea.element.scrollTop = 200;
        await textArea.trigger('scroll');

        await ui.expectDropdownVisibility(wrapper, false);
    });
});

describe('should support inputs', () => {
    const mountWithInput = (type = 'text') =>
        mountSmartSuggest(undefined, { default: `<input type="${type}" />` });

    it('should stay inert on an input type with no caret', async () => {
        const wrapper = mountWithInput('email');

        wrapper.find('input').setValue('hello @user');

        await ui.expectDropdownVisibility(wrapper, false);
    });

    it('should select an item and leave the caret after the insertion', async () => {
        const wrapper = mountWithInput();
        const input = wrapper.find('input');

        input.setValue('hello @user');
        await ui.clickDropdownItem(wrapper, 0);
        await nextTick();

        expect(input.element.value).toBe('hello user1 ');
        expect(input.element.selectionStart).toBe('hello user1 '.length);
        await ui.expectDropdownVisibility(wrapper, false);
    });
});
