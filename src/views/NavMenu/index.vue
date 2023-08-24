<template>
  <div class="nav">
    <el-menu
      :default-active="activeIndex"
      class="nav-menu"
      mode="horizontal"
      @select="handleSelect"
      background-color="transparent"
      text-color="white"
      active-text-color="rgb(109, 165, 255)"
      router
    >
      <el-menu-item index="/">Easy</el-menu-item>
      <el-menu-item index="/params">Medium</el-menu-item>
      <el-menu-item index="/content">Difficult</el-menu-item>
      <el-menu-item index="/search">Search</el-menu-item>
      <div class="flex-grow" />
      <el-menu-item index="/login" @click="logout" style="color: black">
        <span class="username">
          <el-icon><Avatar /></el-icon>
          {{ username }}</span
        >
        退出登录</el-menu-item
      >
    </el-menu>
  </div>

</template>
<script setup>
import { onMounted, computed } from "vue";
import store from "@/store";
const handleSelect = (key) => {
  localStorage.setItem("path", key);
};

let activeIndex = $ref("/");
let username = $ref(
  computed(() => {
    return store().loginStore.user.username;
  })
);
onMounted(() => {
  activeIndex = localStorage.getItem("path");
});
const logout = () => {
  store().loginStore.removeUser();
  localStorage.removeItem("ego");
};
</script>
<style scoped>
.flex-grow {
  flex-grow: 1;
}

.username {
  margin: 5px 5px 5px 0;
  font-style: bold;
  display: inline-block;
  cursor: default;
  margin: 0 5px;
  width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 14px;
  color: rgb(109, 165, 255);
}
:deep(.nav-menu) {
  border-bottom: solid 1px rgba(255, 255, 255, 0.224);
}

</style>
