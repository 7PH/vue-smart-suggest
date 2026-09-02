<img src="./assets/intro.gif" alt="">

Vue Smart Suggest is a lightweight vue library offering dynamic, context-sensitive suggestions for your textareas and inputs. It can be fully customized with custom components and weights less than `3.5kb` minified and brotlied.

Check out the [documentation website](https://7ph.github.io/vue-smart-suggest/#/) to try it out 😊

<p align="right">
    Like this project? Give a star 🌟
</p>

## Getting started

1. Install using a package manager

    ```bash
    npm i --save vue-smart-suggest
    # or
    yarn add vue-smart-suggest
    ```

2. Import `SmartSuggest` and define suggestion trigger(s)

    ```ts
    import { SmartSuggest, Trigger } from 'vue-smart-suggest';

    const userMentionTrigger: Trigger = {
        char: '@',
        items: [{ value: 'Joe' }, { value: 'Jane' }],
    };
    ```

    \*minimal example, check Trigger type definition to see all options

3. Enhance a textarea or an input with `<SmartSuggest />`

    ```html
    <SmartSuggest :triggers="[userMentionTrigger]">
        <textarea />
    </SmartSuggest>

    <SmartSuggest :triggers="[userMentionTrigger]">
        <input type="text" />
    </SmartSuggest>
    ```

4. That's it, suggestions will show up as you type `@`!

    Input types that expose no caret, such as `email` or `number`, are accepted but never suggest anything.

5. Check-out the [customization guide](https://7ph.github.io/vue-smart-suggest/#/customize) or the [API](https://7ph.github.io/vue-smart-suggest/api-docs/) to get the most of this library

## Dependencies

-   This library requires `vue 3.x`.
-   This library has a single dependency, `textarea-caret` which helps finding the position of the cursor inside a textarea or an input.

## Useful links

Documentation

-   Try out a simple [demo](https://7ph.github.io/vue-smart-suggest/) on the documentation website.
-   For styling tips, check the [customization guide](https://7ph.github.io/vue-smart-suggest/#/customize).
-   Check out the [api documentation](https://7ph.github.io/vue-smart-suggest/api-docs/) for reference.
-   Admire the [>98% coverage report](https://7ph.github.io/vue-smart-suggest/coverage/)

## Contributing

Having trouble? Found a bug? Want to contribute? Any kind of contribution is welcome. If you have any questions, please open an issue or create a pull request.
