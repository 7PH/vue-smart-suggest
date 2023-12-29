<script setup lang="ts">
import { ref } from 'vue';
import CustomTextArea from './CustomTextArea.vue';

const enabled = ref(true);
</script>

<template>
    <div class="container">
        <h1>vue-smart-suggest</h1>
        <button @click="enabled = ! enabled">
            {{ enabled ? 'Disable' : 'Enable' }}
        </button>
        <div
            v-if="enabled"
            style="flex-grow: 1;"
        >
            <CustomTextArea />
        </div>
        <div v-if="enabled">
            <CustomTextArea />
        </div>
    </div>
</template>

<style>
/* reset padding */
body { margin: 0; padding: 0; }
</style>

<style scoped>
.container {
    width: 100%;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 2em;
}
.link {
    margin: 0 10px;
}
</style>
