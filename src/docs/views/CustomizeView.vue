<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import cssClassesDemo from '../demo/css-classes.css?raw';
import slotItemDemo from '../demo/slot-item.html?raw';
import slotNoResultDemo from '../demo/slot-no-result.html?raw';
import slotDropdownDemo from '../demo/slot-dropdown.html?raw';
import customDropdownDemo from '../demo/custom-dropdown.html?raw';
</script>

<template>
    <div class="max-w-[700px] w-full mx-auto mb-8 mt-16 md:mt-8 px-4 pb-16">
        <AppHeader />
        
        <p class="mt-8">
            Customize the look and feel of the component by custom CSS classes.
            Follow this guide to learn how to make small style changes to the component or replace the entire UI.
        </p>

        <!-- Props -->
        <h1 class="font-bold mt-8">
            🖇 Props
        </h1>
        <p class="mt-4">
            Props passed to <pre class="inline">SmartSuggest</pre> are added to the container element, so
        </p>
        <highlightjs
            class="rounded-xl overflow-hidden mt-2"
            language="html"
            :code="`<SmartSuggest class='some-class' data-testid='sm'>
    <textarea />
</SmartSuggest>`"
        />
        <p class="mt-2">
            will render
        </p>
        <highlightjs
            class="rounded-xl overflow-hidden mt-2"
            language="html"
            :code="`<div class='some-class' data-testid='sm'>
    <textarea />
</div>`"
        />
    
        <!-- Style -->
        <h1 class="font-bold mt-8">
            🎨 Style
        </h1>
        <p class="mt-4">
            Use CSS classes to customize how suggestions are displayed
        </p>
        <highlightjs
            class="rounded-xl overflow-hidden mt-2"
            language="css"
            :code="cssClassesDemo"
        />
    
        <!-- Slots -->
        <h1 class="font-bold mt-8">
            🛠 Slots
        </h1>
        <p class="mt-4">
            Pass a custom <pre class="inline">item</pre> slot to customize dropdown items
        </p>
        <highlightjs
            class="rounded-xl overflow-hidden mt-2"
            language="html"
            :code="slotItemDemo"
        />
        <p class="mt-4">
            Use <pre class="inline">no-result</pre> slot to customize the no result message
        </p>
        <highlightjs
            class="rounded-xl overflow-hidden mt-2"
            language="html"
            :code="slotNoResultDemo"
        />
        <p class="mt-4">
            Use <pre class="inline">dropdown</pre> slot to implement the entire dropdown
        </p>
        <highlightjs
            class="rounded-xl overflow-hidden mt-2"
            language="html"
            :code="slotDropdownDemo"
        />
        <p class="mt-4">
            For example, that's how you could implement a custom dropdown
        </p>
        <highlightjs
            class="rounded-xl overflow-hidden mt-2"
            language="html"
            :code="customDropdownDemo"
        />
    </div>
</template>
