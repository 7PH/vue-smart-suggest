<script setup lang="ts">
import { ref } from 'vue';
import { userTrigger, emojiTrigger } from '../triggers';
import SmartSuggest from '../../lib/SmartSuggest.vue';
import AppHeader from '../components/AppHeader.vue';

const triggers = [userTrigger, emojiTrigger];

const inputClass = 'p-2 border border-gray-300 rounded-md resize-none';
const placeholder = 'Type @ or :';

// Examples pinned to the page edges span the full width, everything else lives in this centered column
const narrowClass = 'max-w-[700px] w-full mx-auto px-4';

// Tapered shaft + head, drawn as a single filled shape pointing right
const arrowPath = 'M2 11 L146 7.4 L146 1 L182 12 L146 23 L146 16.6 L2 13 Z';

// Long enough to overflow a 3-row box, so the textarea has its own scrollbar.
// It has to be a v-model: a plain `:value` is re-applied (wiping what you typed) every time SmartSuggest re-renders its slot
const scrolledText = ref(
    Array.from({ length: 10 }, (_, i) => `line ${i + 1}`).join('\n')
);

// Wider than the input it sits in, so the input scrolls sideways once the caret reaches the end
const scrolledInputText = ref('a single line of text that does not fit');
</script>

<template>
    <div class="w-full mb-8 mt-16 md:mt-8 pb-16">
        <div :class="narrowClass">
            <AppHeader />

            <h1 class="font-bold mt-8">
                🧪 Examples
            </h1>
            <p class="mt-4">
                A collection of layouts the dropdown has to cope with. Type
                <b>@</b> or <b>:</b> in any of the inputs below to open the
                suggestions.
            </p>

            <!-- Plain textarea -->
            <h2
                id="basic"
                class="font-bold mt-8"
            >
                Plain textarea
            </h2>
            <p class="mt-2">
                The baseline: a full-width textarea with plenty of room around it.
            </p>
            <SmartSuggest
                class="mt-4"
                :triggers="triggers"
            >
                <textarea
                    :class="inputClass"
                    class="w-full"
                    rows="4"
                    :placeholder="placeholder"
                    spellcheck="false"
                />
            </SmartSuggest>

            <!-- Scrolled inside itself -->
            <h2
                id="self-scroll"
                class="font-bold mt-8"
            >
                Textarea scrolled down inside itself
            </h2>
            <p class="mt-2">
                The content is taller than the box, so the textarea has its own
                scrollbar. Scroll to the last line and type <b>@</b>: the
                dropdown has to follow the visible caret, not the one in the
                unscrolled text.
            </p>
            <SmartSuggest
                class="mt-4"
                :triggers="triggers"
            >
                <textarea
                    v-model="scrolledText"
                    :class="inputClass"
                    class="w-full"
                    rows="3"
                    spellcheck="false"
                />
            </SmartSuggest>

            <!-- Single-line input -->
            <h2
                id="input"
                class="font-bold mt-8"
            >
                Single-line input
            </h2>
            <p class="mt-2">
                Everything above also works on an <b>&lt;input&gt;</b>, not just
                a textarea.
            </p>
            <SmartSuggest
                class="mt-4"
                :triggers="triggers"
            >
                <input
                    :class="inputClass"
                    class="w-full"
                    type="text"
                    :placeholder="placeholder"
                    spellcheck="false"
                >
            </SmartSuggest>

            <!-- Input scrolled sideways -->
            <h2
                id="input-scroll"
                class="font-bold mt-8"
            >
                Input scrolled sideways
            </h2>
            <p class="mt-2">
                The value is wider than the box, so the input scrolls sideways.
                Put the caret at the end and type <b>@</b>: the dropdown follows
                the caret you can see, not the one in the unscrolled text.
            </p>
            <SmartSuggest
                class="mt-4"
                :triggers="triggers"
            >
                <input
                    v-model="scrolledInputText"
                    :class="inputClass"
                    class="w-[220px]"
                    type="text"
                    spellcheck="false"
                >
            </SmartSuggest>

            <!-- Input with no caret -->
            <h2
                id="input-no-caret"
                class="font-bold mt-8"
            >
                Input with no caret
            </h2>
            <p class="mt-2">
                <b>email</b>, <b>number</b> and friends report no selection at
                all, so there is nowhere to anchor a dropdown. Typing <b>@</b>
                here does nothing, which is the intended behaviour.
            </p>
            <SmartSuggest
                class="mt-4"
                :triggers="triggers"
            >
                <input
                    :class="inputClass"
                    class="w-full"
                    type="email"
                    placeholder="Nothing will show up here"
                >
            </SmartSuggest>

            <!-- Narrow textarea -->
            <h2
                id="narrow"
                class="font-bold mt-8"
            >
                Narrow textarea
            </h2>
            <p class="mt-2">
                The input is narrower than the 200px dropdown, so the dropdown is
                wider than the element it belongs to.
            </p>
            <SmartSuggest
                class="mt-4"
                :triggers="triggers"
            >
                <textarea
                    :class="inputClass"
                    class="w-[120px]"
                    rows="3"
                    :placeholder="placeholder"
                    spellcheck="false"
                />
            </SmartSuggest>

            <!-- Offset inside the wrapper -->
            <h2
                id="offset"
                class="font-bold mt-8"
            >
                Textarea offset inside its wrapper
            </h2>
            <p class="mt-2">
                The wrapper starts at the left of the page but the textarea is
                pushed 260px to the right by a sibling label, so
                <pre class="inline">offsetLeft</pre> is not zero. The dropdown
                should still line up with the caret.
            </p>
            <SmartSuggest
                class="mt-4 flex gap-4 items-start"
                :triggers="triggers"
            >
                <textarea
                    :class="inputClass"
                    class="w-[300px] order-2"
                    rows="3"
                    :placeholder="placeholder"
                    spellcheck="false"
                />
                <div class="order-1 w-[240px] text-gray-500">
                    A 240px label sitting before the input inside the same wrapper.
                </div>
            </SmartSuggest>

            <!-- Right edge of the viewport -->
            <h2
                id="right-edge"
                class="font-bold mt-8"
            >
                Textarea against the right edge of the page
            </h2>
            <p class="mt-2">
                This is the one that breaks: the input sits at the far right of
                the viewport, so a dropdown anchored on the caret runs off the
                page and adds a horizontal scrollbar. It should be pushed back
                inside the viewport instead.
            </p>
        </div>

        <div class="mt-4 flex justify-end items-center gap-3 pr-2">
            <svg
                class="shrink-0 text-indigo-500"
                width="184"
                height="24"
                viewBox="0 0 184 24"
                aria-hidden="true"
            >
                <path
                    :d="arrowPath"
                    fill="currentColor"
                />
            </svg>
            <SmartSuggest :triggers="triggers">
                <textarea
                    :class="inputClass"
                    class="w-[140px]"
                    rows="3"
                    :placeholder="placeholder"
                    spellcheck="false"
                />
            </SmartSuggest>
        </div>

        <!-- Left edge of the viewport -->
        <div :class="narrowClass">
            <h2
                id="left-edge"
                class="font-bold mt-8"
            >
                Textarea against the left edge of the page
            </h2>
            <p class="mt-2">
                The mirror case. Whatever correction is applied on the right must
                never drag the dropdown off the left edge.
            </p>
        </div>

        <div class="mt-4 flex justify-start items-center gap-3 pl-2">
            <SmartSuggest :triggers="triggers">
                <textarea
                    :class="inputClass"
                    class="w-[140px]"
                    rows="3"
                    :placeholder="placeholder"
                    spellcheck="false"
                />
            </SmartSuggest>
            <svg
                class="shrink-0 text-indigo-500 -scale-x-100"
                width="184"
                height="24"
                viewBox="0 0 184 24"
                aria-hidden="true"
            >
                <path
                    :d="arrowPath"
                    fill="currentColor"
                />
            </svg>
        </div>

        <div :class="narrowClass">
            <!-- Inside a scrollable container -->
            <h2
                id="scroll"
                class="font-bold mt-8"
            >
                Textarea inside a scrollable container
            </h2>
            <p class="mt-2">
                The input lives in a box with its own scrollbar.
            </p>
            <div class="mt-4 h-[160px] overflow-auto border border-gray-300 rounded-md p-4">
                <div class="h-[80px]" />
                <SmartSuggest :triggers="triggers">
                    <textarea
                        :class="inputClass"
                        class="w-full"
                        rows="3"
                        :placeholder="placeholder"
                        spellcheck="false"
                    />
                </SmartSuggest>
                <div class="h-[200px]" />
            </div>

            <!-- Two instances side by side -->
            <h2
                id="side-by-side"
                class="font-bold mt-8"
            >
                Two instances side by side
            </h2>
            <p class="mt-2">
                Each instance positions its own dropdown independently.
            </p>
            <div class="mt-4 flex gap-4">
                <SmartSuggest
                    v-for="index in 2"
                    :key="index"
                    :triggers="triggers"
                    class="flex-1"
                >
                    <textarea
                        :class="inputClass"
                        class="w-full"
                        rows="3"
                        :placeholder="placeholder"
                        spellcheck="false"
                    />
                </SmartSuggest>
            </div>
        </div>
    </div>
</template>
