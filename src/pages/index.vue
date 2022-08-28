<script setup lang="ts">
import { transform } from '../composables/transform.js'
const generic = ref(true)
const dash = ref(true)
const input = ref('')
const output = computed(()=>{
  return transform(input.value, {generic, dash})
})
</script>

<template>
  <div class="pb-10">
    <h2 text="xl" font="bold" p-3>Med Formatter</h2>
    <span>
      <input type="checkbox" v-model="generic"> Generic name
    </span>
    <span>
      <input type="checkbox" v-model="dash"> Dash
    </span>
  </div>
  <div class="mx-auto w-3/4 grid grid-cols-8 grid-gap-2">
    <div class="col-span-4">
      <textarea class="w-full border rounded-lg p-2 h-30em"
        v-model="input"></textarea>
    </div>
    <div class="col-span-4">
      <textarea class="w-full border rounded-lg p-2 h-30em"
        v-model="output" disabled></textarea>
    </div>

  </div>
</template>

<route lang="yaml">
meta:
  <!-- layout: home -->
</route>
