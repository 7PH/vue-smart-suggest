<script setup lang="ts">
import simpleDemo from '../demo/simple';
import { userTrigger, emojiTrigger } from '../triggers';
import SmartSuggest from '../../lib/SmartSuggest.vue';
import AppHeader from '../components/AppHeader.vue';
</script>

<template>
    <div class="max-w-[600px] w-full mx-auto mb-8 mt-16 md:mt-8 px-4 pb-16">
        <AppHeader />
    
        <!-- Introduction -->
        <h1 class="font-bold mt-8">
            ❓ Introduction
        </h1>
        <p class="mt-4">
            Vue Smart Suggest is a lightweight vue library offering dynamic, context-sensitive suggestions for your text areas.
            It weights less than <b>3kb</b> minified and gzipped.<br>
        </p>

        <!-- Demo -->
        <h1 class="font-bold mt-8">
            ▶ Demo
        </h1>
        <div class="mt-4">
            <SmartSuggest
                class="mt-2"
                :triggers="[userTrigger, emojiTrigger]"
            >
                <textarea
                    class="w-full p-2 border border-gray-300 rounded-md resize-none"
                    rows="4"
                    placeholder="Type @ or : to see the suggestions in action"
                />
            </SmartSuggest>
            <div class="flex justify-end hidden">
                <span class="w-fit">
                    For more demos, see the <router-link
                        to="/usage"
                        class="underline"
                    >
                        usage page
                    </router-link>
                </span>
            </div>
        </div>

        <h1 class="font-bold mt-8">
            📦 Install
        </h1>
        <highlightjs
            class="rounded-xl overflow-hidden mt-4"
            language="shell"
            :code="`
$ npm i --save vue-smart-suggest
or
$ yarn add vue-smart-suggest
`.trim()"
        />

        <h1 class="font-bold mt-8">
            🔨 Usage
        </h1>
        <highlightjs
            class="rounded-xl overflow-hidden mt-2"
            language="js"
            :code="simpleDemo.script"
        />
        <highlightjs
            class="rounded-xl overflow-hidden mt-2"
            language="html"
            :code="simpleDemo.template"
        />

        <h1 class="font-bold mt-8">
            🤝 Support and bugs
        </h1>
        <p class="mt-4">
            Having trouble? Found a bug? Want to contribute?
            Any kind of contribution is welcome. If you have any questions, please open an issue or create a pull request on <a
                href="https://github.com/7ph/powerglitch"
                target="_blank"
                class="underline"
            >GitHub</a>.
        </p>
    </div>
</template>
