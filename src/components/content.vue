<template>
  <div v-focus>
    <h1 class="title">前端面试题库</h1>
    <div class="navbar" v-show="navbar">
      <div class="content">
        <div
          class="content-item"
          v-for="(item, index) in book"
          @click="jump(index)"
        >
          {{ index + 1 }}. {{ item.question }}
        </div>
      </div>
    </div>
    <div class="container" v-if="normal" @keydown.left="prev">
      <button class="btn-toggle" @click="navbar = !navbar">
        <el-icon><Memo /></el-icon>目录
      </button>
      <div class="btn-row">
        <button class="btn-show" @click="normal = false">
          <el-icon><Plus /></el-icon>
        </button>
        <button class="btn-show" @click="">
          <el-icon><Star /></el-icon>
        </button>
        <button class="btn-show" @click="deleteRecord">
          <el-icon><DeleteFilled /></el-icon>
        </button>
      </div>
      <div class="flip-container">
        <div class="flipper">
          <div class="front">
            <div class="inner-card-front">
              <p>{{ book[currentActiveCard]?.question }}</p>
            </div>
          </div>
          <div class="back">
            <div class="inner-card-back">
              <p>{{ book[currentActiveCard]?.answer }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation">
        <el-icon @click="prev"><ArrowLeftBold /></el-icon>
        <p>{{ currentActiveCard + 1 }}/{{ book.length }}</p>
        <el-icon @click="next"><ArrowRightBold /></el-icon>
      </div>
    </div>
    <div class="container" v-else>
      <h1>添加新题</h1>
      <div class="form-group">
        <label for="question">问题</label>
        <el-input
          v-model="newquestion"
          :rows="2"
          type="textarea"
          placeholder="输入问题"
          key="question"
        />
      </div>
      <div class="form-group">
        <label for="answer">答案</label>
        <el-input
          v-model="newanswer"
          :rows="3"
          type="textarea"
          placeholder="输入答案"
          key="answer"
        />
      </div>
      <div class="btn-group">
        <button class="btn" @click="submit">提交</button>
        <button class="btn" @click="normal = true">返回</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  defineProps,
  onMounted,
  getCurrentInstance,
  defineComponent,
  inject
} from "vue";

const diff_rate = inject("diff_rate");
const { proxy } = getCurrentInstance();
let book = $ref([]);
let currentActiveCard = $ref(0);
let isShow = $ref(true);
let normal = $ref(true);
let navbar = $ref(false);
let newquestion = $ref("");
let newanswer = $ref("");

const getList = onMounted(() => {
  proxy.$api
    .bookList({
      rate: diff_rate,
    })
    .then((res) => {
      if (res.data.status == 200) {
        book = res.data.data;
      }
    });
});
const jump = (index) => {
  currentActiveCard = index;
};
const prev = () => {
  if (currentActiveCard > 0) {
    currentActiveCard--;
  } else {
    currentActiveCard = book.length - 1;
  }
};
const next = () => {
  if (currentActiveCard < book.length - 1) {
    currentActiveCard++;
  }
};
const submit = () => {
  proxy.$api
    .submitRecord({
      rate: diff_rate,
      question: newquestion,
      answer: newanswer,
    })
    .then((res) => {
      if (res.data.status == 200) {
        getList();
        next();
        normal = true;
        (newanswer = ""), (newquestion = "");
      }
    });
};

const deleteRecord = () => {
  proxy.$api
    .deleteRecord({
      id: book[currentActiveCard]?.id,
    })
    .then((res) => {
      if (res.data.status == 200) {
        getList();
        prev();
      }
    });
};
</script>
<style scoped>
* {
  box-sizing: border-box;
  color: rgb(255, 255, 255);
}
.title {
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translateX(-50%);
}

.container {
  height: 100vh;
  width: 89vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.inner-card-front::after {
  content: "问题";
  font-family: "STFangsong", Lato, sans-serif;
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 20px;
  color: #ffffff;
}

.inner-card-back::after {
  content: "答案";
  font-family: "STFangsong", Lato, sans-serif;
  font-style: italic;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  color: #ffffff;
}

.el-icon svg {
  color: #ffffff;
  cursor: pointer;
  size: 20px;
}

.navigation p {
  margin: auto 25px;
  color: #ffffff;
  font-weight: bold;
  font-size: 20px;
}
h1 {
  position: relative;
  color: #ffffffd1;
  font-style: italic;
  font-size: 2em;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
.form-group label {
  display: block;
  margin: 20px 0 10px;
}
:deep(.el-textarea__inner) {
  font-size: 16px;
}
.form-group {
  font-size: 16px;
  padding: 12px;
  min-width: 500px;
  max-width: 100%;
}

.navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0px;
}
.navbar {
  position: absolute;
  top: 80px;
  left: 80px;
  background-color: transparent;
}
.content {
  margin-top: 66px;
  max-height: 378px;
  max-width: 288px;
  overflow-x: scroll;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: self-start;
  margin-left: 20px;
}
.content-item {
  max-height: 25px;
  line-height: 25px;
  white-space: nowrap;
  color: #ffffffe8;
}
.content-item:hover {
  color: #71a2f7;
  cursor: pointer;
}

label {
  float: left;
  color: #ffffff;
}

.btn {
  cursor: pointer;
  width: 88px;
  font-size: 14px;
  font-weight: bold;
  margin: 10px 138px;
  padding: 10px 15px;
  background-color: transparent;
  border: 1px solid white;
}
.btn-show {
  background-color: transparent;
  border: 1px solid white;
  border-radius: 50%;
  height: 38px;
  width: 38px;
  margin: 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 1px rgba(167, 167, 167, 0.703);
}
.btn-group{
  margin-top: 20px;
}
.btn-row {
  position: absolute;
  top: 35%;
  left: 68%;
  display: flex;

  flex-direction: column;
}
.btn-toggle {
  border: #ffffff 1px solid;
  position: absolute;
  top: 80px;
  left: 80px;
  font-size: 16px;
  display: flex;
  align-items: center;
  background-color: transparent;
  /* background-image: linear-gradient(to right, #fbc2eb, #a6c1ee); */
}
button {
  outline: none;
}
button:hover {
  transform: scale(0.98);
}
button:active {
  transform: scale(0.98);
}
.card {
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  font-weight: 600;
}
/* entire container, keeps perspective */
.flip-container {
  perspective: 1000;
}
/* flip the pane when hovered */
.flip-container:hover .flipper,
.flip-container.hover .flipper {
  transform: rotateY(180deg);
  transform-origin: center center;
}
.container h1{
  font-size: 28px;
  margin-bottom: -10px;
}
.front,
.back {
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  height: 300px;
  width: 500px;
  background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  font-weight: 600;
}

/* flip speed goes here */
.flipper {
  transition: 0.6s;
  transform-style: preserve-3d;

  position: relative;
}

.front {
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
}

/* front pane, placed above back */
.front {
  z-index: 2;
}

/* back, initially hidden pane */
.back {
  transform: rotateY(180deg);
  transform-origin: center center;
}
</style>
