//网络请求地址，用来放路径的
//只有两类，一类是api打头的，一类是登录页面
const base = {
  baseUrl: "/api",
  loginUrl: "/api/login",
  regUrl: "/api/register",
  listUrl: "/api/item/selectItem",
  addUrl: "/api/item/addrecord",
  deleteUrl: "/api/item/deleterecord",
  searchUrl: "/api/item/keywords",
};
export default base;
