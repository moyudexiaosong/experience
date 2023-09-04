import axios from "axios";
import base from "../api/base";
import globalConfig from "../global.config";
import md5 from "js-md5";
import router from "../router";
import { error } from "console";
// import store from "../store"

const toLogin = () => {
  router.push("/login");
};
let request = axios.create({
  baseURL: base.baseUrl,
  timeout: 30 * 1000,
  responseType: "json",
  headers: {
    a: "123",
  },
});
//请求拦截器，参数config为我们的请求，包含参数、header等
request.interceptors.request.use(
  (config) => {
    //token 密钥设置
    let whiteList = globalConfig.whiteListApi;
    let url = config.url;
    let token = localStorage.getItem("token");
    if (whiteList.includes(url) || token) {
      config.headers.token = token;
      //如果已经登陆了，或者该页面不需要登录，就在请求头里加入当前的token
    }
    //只设置一个token是可以的，但是可能会出现中间人伪造token向服务端发请求，查看一些无权限的内容，因此我们还需要密钥
    //密钥-secretId(自己设置的字符串)+特殊算法，发给后端后，后端一对比就知道是不是当前时间发的了
    //下个md5的工具包，进行一个不可逆的加密
    let _secret = md5.encode(globalConfig.secretId + new Date().toString());
    config.headers.secret = _secret;
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  }
);

//响应拦截器，对各种错误进行处理
request.interceptors.response.use(
  (res) => {
    //响应统一处理，判断后端返回的状态码，给出错误类型
    const status = res.data.status || 200;
    if (status !== 200) {
      errorHandle(status);
      return Promise.reject(new Error(error));
    }
    return res
  },
  (error) => {
    //真实项目里一般使用组件库的提示框等等
    return Promise.reject(new Error(error));
  }
);
const errorHandle = (status, info) => {
  switch (status) {
    //没有权限就跳转回登录
    case 400:
      console.log(
        "服务器收到客户端通过PUT或者POST请求提交的表示，表示的格式正确，但服务器不懂它什么意思"
      );
      toLogin();
      break;
    case 401:
      console.log(
        "客户端试图对一个受保护的资源进行操作，却又没有提供正确的认证证书"
      );
      toLogin();
      break;
    case 403:
      console.log("客户端请求的结构正确，但是服务器不想处理它");
      toLogin();
      break;
    case 404:
      console.log("资源被围定义(网络请求地址错误)");
      break;
    case 500:
      console.log("执行请求处理代码时遇到了异常，它们就发送此响应代码");
      break;
    case 503:
      console.log(
        "最可能的原因是资源不足：服务器突然收到太多请求，以至于无法全部处理"
      );
      break;
    default:
      console.log(info);
      break;
  }
};
