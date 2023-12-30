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
    it('should be exported', async () => {
        expect(SmartSuggest).toBeTruthy();
    });

    it('should be correctly structured', async () => {
        const wrapper = mountSmartSuggest();

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find('div.smart-suggest > textarea').exists()).toBe(
            true
        );
    });

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
    it('should only trigger dropdown when necessary', async () => {
        const wrapper = mountSmartSuggest();

        wrapper.find('textarea').setValue('hello world. ');
        await ui.expectDropdownVisibility(wrapper, false);

        wrapper.find('textarea').setValue('hello world. @');
        await ui.expectDropdownItems(wrapper, [
            'user1',
            'user2',
            'guest10',
            '*guest0',
        ]);

        wrapper.find('textarea').setValue('hello world. @us');
        await ui.expectDropdownItems(wrapper, ['user1', 'user2']);

        wrapper.find('textarea').setValue('hello world. @us ');
        await ui.expectDropdownVisibility(wrapper, false);

        wrapper.find('textarea').setValue('hello world. @us');
        await ui.expectDropdownItems(wrapper, ['user1', 'user2']);
    });

    it('should respect search regexp', async () => {
        const wrapper = mountSmartSuggest({
            triggers: [
                {
                    ...DEFAULT_TRIGGER[0],
                    searchRegExp: /[a-zA-Z]*/,
                } as Trigger,
            ],
        });

        wrapper.find('textarea').setValue('hello world. @us');
        await ui.expectDropdownVisibility(wrapper, true);

        wrapper.find('textarea').setValue('hello world. @us2');
        await ui.expectDropdownVisibility(wrapper, false);

        wrapper.find('textarea').setValue('hello world. @us');
        await ui.expectDropdownVisibility(wrapper, true);
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

    it('should reset search after last found trigger char', async () => {
        const wrapper = mountSmartSuggest();

        wrapper.find('textarea').setValue('hello world. @gu@us');
        await ui.expectDropdownItems(wrapper, ['user1', 'user2']);
    });

    it('should search for trigger char at cursor', async () => {
        const wrapper = mountSmartSuggest();

        wrapper.find('textarea').setValue('hello @us how are you?');
        await ui.expectDropdownVisibility(wrapper, false);

        // set cursor after '@us'
        wrapper.find('textarea').element.setSelectionRange(9, 9);
        wrapper.find('textarea').trigger('input');
        await ui.expectDropdownItems(wrapper, ['user1', 'user2']);
    });

    it('should search in a case-insensitive way', async () => {
        const wrapper = mountSmartSuggest();

        wrapper.find('textarea').setValue('hello world. @Us');
        await ui.expectDropdownItems(wrapper, ['user1', 'user2']);
    });

    it('should search using searchMatch but display value', async () => {
        const wrapper = mountSmartSuggest({
            triggers: [
                {
                    ...DEFAULT_TRIGGER[0],
                    items: [
                        ...DEFAULT_TRIGGER[0].items,
                        {
                            value: 'user3',
                            searchMatch: 'testvalue',
                            image: 'http://some-image.localhost/user3.png',
                        },
                    ],
                } as Trigger,
            ],
        });

        wrapper.find('textarea').setValue('hello world. @testv');
        await ui.expectDropdownItems(wrapper, ['user3']);
    });

    it('should render dropdown suggestions correctly', async () => {
        const wrapper = mountSmartSuggest();

        wrapper.find('textarea').setValue('hello world. @u');
        await ui.expectDropdownItems(wrapper, [
            'user1',
            'user2',
            'guest10',
            '*guest0',
        ]);

        // Image should be rendered
        expect(
            wrapper.find('.smart-suggest-item-image-container > img').exists()
        ).toBe(true);
        expect(
            wrapper.findAll('.smart-suggest-item-image-container > img')
        ).toHaveLength(2);
        expect(
            wrapper
                .findAll('.smart-suggest-item-image-container > img')[0]
                .attributes('src')
        ).toBe('http://some-image.localhost/user1.png');
        expect(
            wrapper
                .findAll('.smart-suggest-item-image-container > img')[1]
                .attributes('src')
        ).toBe('http://some-image.localhost/user2.png');
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

    it('should clear dropdown on blur', async () => {
        const wrapper = mountSmartSuggest();

        wrapper.find('textarea').setValue('hello world. @');
        await ui.expectDropdownItems(wrapper, [
            'user1',
            'user2',
            'guest10',
            '*guest0',
        ]);

        wrapper.find('textarea').trigger('blur');
        await ui.expectDropdownVisibility(wrapper, false);
    });

    it('should close dropdown on Escape', async () => {
        const wrapper = mountSmartSuggest();

        wrapper.find('textarea').setValue('hello world. @use');
        await ui.expectDropdownItems(wrapper, ['user1', 'user2']);
        wrapper.find('textarea').trigger('keydown', { key: 'Escape' });

        await ui.expectDropdownVisibility(wrapper, false);
    });

    it('should ignore dropdown if no input is passed', async () => {
        const wrapper = mountSmartSuggest({}, { default: '' });
        await ui.expectDropdownVisibility(wrapper, false);
    });

    it('should render no result', async () => {
        const wrapper = mountSmartSuggest();

        wrapper.find('textarea').setValue('hello world. @test');
        await ui.expectDropdownVisibility(wrapper, true);
        expect(wrapper.find('.smart-suggest-no-result').exists()).toBe(true);
    });
});

describe('should select item', () => {
    it('should select item on click', async () => {
        const wrapper = mountSmartSuggest();

        wrapper.find('textarea').setValue('hello world. @use');
        await ui.expectDropdownItems(wrapper, ['user1', 'user2']);
        await ui.clickDropdownItem(wrapper, 0, true);

        expect(wrapper.find('textarea').element.value).toBe(
            'hello world. user1 '
        );
    });

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
