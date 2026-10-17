<template>
  <span class="point-number" :aria-label="`Point ${number}`">{{ number }}</span>
</template>

<script setup lang="ts">
defineProps<{ number: number }>()
</script>

<style scoped>
.point-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: 2px solid white;
  border-radius: 50%;
  background: #b5232d;
  color: white;
  box-shadow: 0 0 0 1px #522029;
  font-family: system-ui, sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
</style>
