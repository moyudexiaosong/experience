<template>
  <Difficult :key="difficult" />
</template>
<script setup>
import { provide } from "vue";
import Difficult from "@/components/content.vue";
provide("diff_rate", "困难");
</script>
<style></style>
