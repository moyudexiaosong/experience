<template>
  <div class="search">
    <el-input
      v-model="keyword"
      placeholder="请输入关键字"
      class="input-with-select"
    >
      <template #prepend>
        <el-icon><Search /></el-icon>
      </template>
      <template #append>
        <el-button @click="check" @keydown.enter.native="check">Search</el-button>
      </template>
    </el-input>
  </div>
  <div class="result">
    <div v-for="item in searchResult" class="post" :key="searchResult">
      <div class="post-title">{{ item.question }}</div>
      <div class="number" :style="{color:(item.rate=='简单'?'ffbdff':item.rate=='中等'?'#fcbb39':'#9abfff')}">{{ item.rate }}</div>
      <div class="post-info">{{ item.answer }}</div>
    </div>
  </div>
</template>
<script setup>
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
let keyword = $ref("");
let searchResult = $ref([]);
const check = () => {
  proxy.$api
    .searchWord({
      word: keyword,
    })
    .then((res) => {
      if (res.data.status == 200) {
        searchResult = res.data.data;
      }
    });
  console.log(searchResult);
};
</script>
<style scoped>
.search {
  position: relative;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
}

:deep(.el-input-group) {
  height: 40px;
}
.result {
  width: 70%;
  max-height: 68%;
  position: relative;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  overflow: scroll;
}
.post {
  margin-bottom: 30px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: 85%;
  color: #fff;
  position: relative;
}

.post .post-title {
  font-size: 20px;
  line-height: 40px;
  font-weight: bolder;
}

.post .post-body {
  margin: 15px 0 0;
  line-height: 1.3;
}

.number {
  position: absolute;
  top: -20px;
  left: -20px;
  font-size: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  color: #ffbdff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px 10px;
}

</style>
