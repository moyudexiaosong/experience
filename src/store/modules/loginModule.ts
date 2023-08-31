import { defineStore } from "pinia";
import decode from "jwt-decode";
import router from "@/router";
import api from '@/api'


//异步请求都放到pinia里
const loginStore = defineStore("login", {
  state: () => {
    return {
      user: {
        username: "",
        isLogined: false,
        token: "",
      },
    };
  },
  actions: {
    setUser(value:any) {
      this.user = value;
    },

    checkLogin() {
      let islogin = JSON.parse(localStorage.getItem("ego"));
      if (islogin) {
        this.setUser(islogin);
      }
    },
    loginAction(user) {
      api.login({
          username: user.username,
          password: user.password,
        })
        .then((res) => {
          if (res.status === 200) {
            const temp = {
              username: decode(res.data).username,
              isLogined: Boolean(decode(res.data).username),
              token: res.data,
            };
            //解析一下传回来的用户名和登录状态，放入状态管理中，并且把权限改一下
            this.setUser(temp);
            localStorage.setItem("ego", JSON.stringify(temp));
            router.push("/");
          }
        });
    },
    removeUser(){
      this.user={
        username:'',
        isLogined: false,
        token: "",
      }
    }
  },
});

export default loginStore;
