<template>
  <div class="container" id="container">
    <div class="login-form" key="login">
      <div class="title">
        <h1>Login</h1>
      </div>
      <el-form
        ref="loginform"
        :model="user"
        status-icon
        :rules="rules"
        label-width="120px"
      >
        <el-form-item prop="username">
          <el-input
            class="input-border-style"
            v-model="user.username"
            type="text"
            placeholder="username"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="input-border-style"
            v-model="user.password"
            type="password"
            placeholder="password"
          />
        </el-form-item>

        <el-form-item class="btn-info">
          <el-button type="primary" @click="submitForm(loginform)"
            >Login</el-button
          >
        </el-form-item>
      </el-form>
      <div class="msg">
        Don't have account?
        <a @click="toSignup">Sign up</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { storeToRefs } from "pinia";
import useStore from "@/store";
let user = reactive({
  username: "",
  password: "",
});
const store = useStore();

const { loginStore } = storeToRefs(store);
const loginform = ref({} as HTMLElement);
const toSignup = () => {
  router.push("/register");
};
let validateName = (rule: any, value: any, callback: any) => {
  if (value == "") {
    callback(new Error("请输入用户名"));
  }
  callback();
};
let validatePass = (rule: any, value: any, callback: any) => {
  if (value == "") {
    callback(new Error("请输入密码"));
  }
  callback();
};

let rules = reactive({
  username: [{ validator: validateName, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
});

const submitForm = (formEl) => {
  //用isLogin区分是登录还是注册
  formEl.validate((valid) => {
    if (valid) {
      loginStore.loginAction({
        username: user.username,
        password: user.password,
      });
    } else {
      alert("error submit!");
      return false;
    }
  });
};
</script>

<style scoped>
:deep(.el-input) {
  margin-left: -100px;
  width: 250px;
}
:deep(.el-input__wrapper) {
  box-shadow: 0px 1px rgba(167, 167, 167, 0.703);
  border-radius: 0px;
}
:deep(.el-button) {
  text-align: center;
  padding: 10px;
  width: 250px;
  height: 40px;
  margin-top: 40px;
  background-image: linear-gradient(to right, #a6c1ee, #fbc2eb);
  color: #fff;
  border: none;
  margin-left: -100px;
}
.btn-info {
  position: relative;
  /* top: -30px; */
  transition: opacity 0.2s ease-in;
  opacity: 0.8;
}

.btn-info:hover {
  opacity: 1;
}

.container {
  background-color: #fff;
  width: 288px;
  height: 70%;
  padding: 0 50px;
  border-radius: 10px;
  perspective: 1000px;

  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.title {
  width: 100%;
}

h1 {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  line-height: 150px;
  color: #000;
}
.msg {
  /* margin-top:-30px ; */
  text-align: center;
  /* line-height: 88px; */
  color: #000;
}
a {
  text-decoration-line: none;
  color: #abc1ee;
  cursor: pointer;
}
.mirrorRotateLevel {
  background-color: #f4f4f4d3;
}
</style>
