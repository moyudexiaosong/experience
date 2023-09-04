import { config } from "process";
import request from "./request";
//做成闭包方便记录哪些请求已经请求过了，并且还没有收到响应
let myRequest = (function () {
  let hasRequest = [];
  return function (config) {
    //如果在请求中，直接return，不在请求中的话就开始正常请求，并把网址压入请求列表中，并在收到响应后从请求列表中删了
    if (hasRequest.includes(config.url)) {
      return Promise.reject("请求已提交，请不要重复提交");
    }
    hasRequest.push(config.url);
    return request({
      ...config,
    }).then((res) => {
      hasRequest = hasRequest.filter((item) => item !== config.url);
      return res.data;
    });
  };
})();
let bufferRequest = (function () {
  let mem = new Map();
  return function (config) {
    let url = config.url;
    //如果接口中有数据，直接返回
    if (mem.get(url)) {
      return Promise.resolve(mem[url]);
    } else {
      //如果接口中没有数据，正常发请求
      return request({
        ...config,
      }).then((res) => {
        return res.data;
      });
    }
  };
})();

export {
  request as request,
  myRequest as deferRequest,
  bufferRequest as bufferRequest,
};
