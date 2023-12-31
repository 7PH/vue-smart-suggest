<img src="./assets/intro.gif" alt="">

Discover `vue-smart-suggest`, a compact (<3KB) vue library offering dynamic, context-sensitive suggestions for your text areas.

## Features

-   Lightweight
-   Easy to integrate
-   Context-sensitive suggestions based on user input
-   Customizable triggers (e.g., "@", ":")

## Installation

```bash
npm install --save vue-smart-suggest
```

## Usage

Here's a quick example on how to use `vue-smart-suggest` in your project:

```vue
<script setup lang="ts">
import { SmartSuggest, Trigger } from 'vue-smart-suggest';

const userTrigger: Trigger = {
    char: '@',
    items: [
        { value: 'joe', searchText: 'joe' },
        { value: 'jane', searchText: 'jane' },
    ],
};
</script>

<template>
    <SmartSuggest :trigger="userTrigger">
        <textarea />
    </SmartSuggest>
</template>
```

For detailed usage and options, please refer to [Documentation Link].

## Contributing

We welcome contributions to `vue-smart-suggest`! If you're interested in helping improve this project, here's how you can contribute:

### Reporting Issues

-   Ensure the issue has not already been reported.
-   Use the GitHub Issues tab to report the issue. Provide detailed steps to reproduce, what you expected to happen, and what actually happened.

### Submitting Pull Requests

1. Fork the repository on GitHub.
2. Clone your fork to your local machine.
3. Create a new branch for your feature or fix.
4. Make your changes, ensuring you adhere to the existing code style.
5. Write or adapt tests as needed.
6. Commit your changes with a clear and descriptive message.
7. Push your branch to your GitHub fork.
8. Submit a pull request to the main repository.
9. Ensure your pull request description clearly describes the problem and solution. Include the relevant issue number if applicable.

### Coding Guidelines

-   Write code in TypeScript.
-   Follow existing coding style for consistency.
-   Ensure your code passes all existing tests and write new tests as needed.

### Community

Join our [Community Forum or Slack/Discord Channel] to discuss development, features, and ideas.

## License

`vue-smart-suggest` is open-sourced software licensed under the [MIT license](LICENSE.md).
