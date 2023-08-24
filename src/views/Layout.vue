<template>
  <div class="home">
    <NavMenu />
  </div>
  <router-view> </router-view>
</template>
<script setup>
import NavMenu from "./NavMenu/index.vue";
</script>
<style>
body {
  /* background-image: linear-gradient(to right, #fbc2eb, #a6c1ee); */
  background-image: url("@/assets/pinkFox.jpg");
  background-size: cover;
  margin: 0;
  padding: 0;
  overflow-y: hidden;
}
.home {
  width: 100%;
  margin: 0;
}
</style>
