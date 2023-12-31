<script setup lang="ts">
import { router } from '../router.js';
</script>

<template>
    <div>
        <!-- GitHub -->
        <p class="fixed right-0 top-0 mx-6 my-4 text-4xl">
            <a
                href="https://github.com/7ph/vue-smart-suggest"
                target="_blank"
            >
                <fa icon="fa-brands fa-github" />
            </a>
        </p>

        <!-- Title -->
        <div class="mt-8 font-bold text-5xl flex gap-4 justify-center">
            <div class="mt-1">
                ✨ Vue Smart Suggest
            </div>
        </div>
        <p class="text-center mt-4 text-lg">
            Context-sensitive suggestions for your text areas (and more)
        </p>
        <div class="mt-2 flex justify-center gap-4">
            <RouterLink
                to="/"
                class=""
                :class="{
                    'underline': router.currentRoute.value.name !== 'home',
                }"
            >
                home
            </RouterLink>
            <RouterLink
                to="/customize"
                :class="{
                    'underline': router.currentRoute.value.name !== 'customize',
                }"
            >
                customize
            </RouterLink>
            <a
                target="_blank"
                href="./api-docs/"
                class="underline"
            >
                types
                <fa
                    icon="fa-external-link"
                    class="ml-1 text-xs"
                />
            </a>
            <a
                target="_blank"
                href="./coverage/"
                class="underline"
            >
                coverage
                <fa
                    icon="fa-external-link"
                    class="ml-1 text-xs"
                />
            </a>
            <a
                target="_blank"
                href="https://github.com/7PH/vue-smart-suggest"
                class="underline"
            >
                github
                <fa
                    icon="fa-external-link"
                    class="ml-1 text-xs"
                />
            </a>
        </div>
    </div>
</template>
