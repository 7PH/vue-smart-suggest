<script setup lang="ts">
import { ref } from 'vue';
import SmartSuggest from '../lib/SmartSuggest.vue';
import { Trigger } from '../lib/types';
import SmartSuggestItem from '../lib/SmartSuggestItem.vue';

const value = ref('placeholder value');

const triggers: Trigger[] = [
    {
        char: ':',
        searchRegExp: /([a-zA-Z0-9]*)$/,
        whitespaceBefore: true,
        items: [
            {
                value: ':hap2:',
                searchMatch: ':hap2:',
                image: '',
            },
            {
                value: ':ah:',
                searchMatch: ':ah:',
                image: '',
            },
            {
                value: ':hap:',
                searchMatch: ':hap:',
                image: '',
            },
        ]
    },
    {
        char: '@',
        insertSpaceAfter: false,
        items: Array.from({length: 100}).map((_, i) => ({
            value: `@user${i}`,
            searchMatch: `@user${i}`,
        })),
    },
];
</script>

<template>
    <SmartSuggest :triggers="triggers">
        <textarea
            v-model="value"
            rows="4"
            cols="50"
            style="padding: 1em; font-size: 1.2em;"
        />
    </SmartSuggest>
</template>
