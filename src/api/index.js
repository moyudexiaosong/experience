//网络请求方法有三类，原生的是ajax，还有个Fetch API，这里用最常用的第三方库axios
import axios from "../utils/request";
import base from "./base";

const api = {
  //login
  login(params) {
    return axios.post(base.baseUrl + base.loginUrl, params);
  },
  signup(params) {
    return axios.post(base.baseUrl + base.regUrl, params);
  },
  //get接口和post接口不一样，传参数要传一个对象
  bookList(params) {
    return axios.get(base.baseUrl + base.listUrl, { params });
  },
  submitRecord(params) {
    return axios.post(base.baseUrl + base.addUrl, params);
  },
  deleteRecord(params) {
    return axios.post(base.baseUrl + base.deleteUrl, params);
  },
  searchWord(params) {
    return axios.get(base.baseUrl + base.searchUrl, { params });
  },
};

export default api;
