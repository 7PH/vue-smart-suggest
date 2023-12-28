<script setup lang="ts">
import { ref } from 'vue';
import SmartSuggest from '../lib/SmartSuggest.vue';
import { Trigger } from '../lib/types';

const value = ref('placeholder value');
const enabled = ref(true);

const triggers: Trigger[] = [
    {
        char: ':',
        searchRegExp: /([a-zA-Z0-9]*)$/,
        whitespaceBefore: true,
        items: [
            {
                value: ':hap2:',
                searchMatch: ':hap2:',
            },
            {
                value: ':ah:',
                searchMatch: ':ah:',
            },
            {
                value: ':hap:',
                searchMatch: ':hap:',
            },
        ]
    },
    {
        char: '@',
        insertSpaceAfter: false,
        items: [
            {
                value: '@username',
                searchMatch: '@username',
            },
            {
                value: '@username2',
                searchMatch: '@username2',
            },
        ]
    }
];
</script>

<template>
    <div class="container">
        <h1>vue-smart-suggest</h1>

        <button @click="enabled = ! enabled">
            {{ enabled ? 'Disable' : 'Enable' }}
        </button>
        
        <SmartSuggest
            v-if="enabled"
            :triggers="triggers"
        >
            <textarea
                v-model="value"
                rows="4"
                cols="50"
                style="padding: 1em; font-size: 1.2em;"
            />

            <template #dropdown>
                <div>I AM DROPDOWN</div>
            </template>

            <template #item="{ suggestion, selected }">
                <div>
                    {{ selected ? '>> ' : '' }}{{ suggestion.value }} JELLO
                </div>
            </template>
        </SmartSuggest>
        
        
        <SmartSuggest
            v-if="enabled"
            :triggers="triggers"
        >
            <textarea
                v-model="value"
                rows="4"
                cols="50"
                style="padding: 1em; font-size: 1.2em;"
            />
        </SmartSuggest>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    margin-top: 20px;
    text-align: center;
}
.link {
    margin: 0 10px;
}
</style>
