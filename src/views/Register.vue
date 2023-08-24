<template>
  <div class="container">
    <div class="signup-form" key="signup">
      <div class="title">
        <h1>Sign up</h1>
      </div>
      <el-form
        ref="registerform"
        :model="signuser"
        status-icon
        :rules="registerRules"
        label-width="120px"
      >
        <el-form-item prop="username">
          <el-input
            class="input-border-style"
            v-model="signuser.username"
            type="text"
            placeholder="username"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="input-border-style"
            v-model="signuser.password"
            type="password"
            placeholder="password"
          />
        </el-form-item>
        <el-form-item prop="confirm">
          <el-input
            class="input-border-style"
            v-model="signuser.confirm"
            type="password"
            placeholder="confirm password"
          />
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            class="input-border-style"
            v-model="signuser.email"
            type="email"
            placeholder="email"
          />
        </el-form-item>
        <el-form-item class="btn-info">
          <el-button type="primary" @click="submitForm(registerform)"
            >Sign up</el-button
          >
        </el-form-item>
      </el-form>
      <div class="msg">
        Already have an account.
        <a @click="toLogin">Log in</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from "vue";
import router from "@/router";
let signuser = reactive({
  username: "",
  password: "",
  confirm: "",
  email: "",
});

const registerform = ref({} as HTMLElement);
const { proxy } = getCurrentInstance() as any;
const toLogin = () => {
  router.push("/login");
};
let validateName2 = (rule: any, value: any, callback: any) => {
  if (value == "") {
    callback(new Error("请输入用户名"));
  } else {
    const regx = /^[A-Za-z]+$/;
    if (regx.test(value.trim())) {
      callback();
    } else {
      callback(new Error("只能输入字母"));
    }
  }
};
let validatePass2 = (rule: any, value: any, callback: any) => {
  if (value == "") {
    callback(new Error("请输入密码"));
  } else if (value.length < 5 || value.length > 10) {
    callback(new Error("密码长度必须在6-10之间"));
  } else {
    const regx = /^[A-Za-z0-9]+$/;
    if (regx.test(value.trim())) {
      callback();
    } else {
      callback(new Error("只能输入字母和数字"));
    }
  }
};
let validateEmail = (rule: any, value: any, callback: any) => {
  const regx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (value == "") {
    callback(new Error("请输入邮箱"));
  } else {
    if (regx.test(value.trim())) {
      callback();
    } else {
      callback(new Error("邮箱格式不正确"));
    }
  }
};
let validateConfirm = (rule: any, value: any, callback: any) => {
  if (value == "") {
    callback(new Error("请输入密码"));
  } else if (value != signuser.password) {
    callback(new Error("输入错误"));
  } else {
    callback();
  }
};

let registerRules = reactive({
  username: [{ validator: validateName2, trigger: "blur" }],
  password: [{ validator: validatePass2, trigger: "blur" }],
  confirm: [{ validator: validateConfirm, trigger: "blur" }],
  email: [{ validator: validateEmail, trigger: "blur" }],
});

const submitForm = (formEl) => {
  formEl.validate((valid) => {
    if (valid) {
      proxy.$api
        .signup({
          username: signuser.username,
          password: signuser.password,
          email: signuser.email,
        })
        .then((res) => {
          console.log(res);
          router.push("/login");
          if (res.data.status == 401) {
            alert("该用户名已被注册");
          }
        }).catch(()=>{
          alert("该用户名已被注册");
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
  transform: translate(-50%, -50%);
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
