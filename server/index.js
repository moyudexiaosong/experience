import express from "express";
import router from "./router.js";
import debug from "debug";
import bodyParser from "body-parser";

const app = express();
const port = 5050;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json())
app.use(bodyParser.json());
app.use((req, res, next) => {
  // 指定允许跨域的域名
  res.setHeader('Access-Control-Allow-Origin', '*')
  // res.header('Access-Control-Allow-Origin','http://localhost:8080/')
  // 指定允许跨域的指令
  res.setHeader('Access-Control-Allow-Origin', 'GET,PUT,POST,DELETE')
  // 允许增加一些自定义的请求头，比如content-type
  res.setHeader('Access-Control-Allow-Origin', 'content-type a,token,secret')
  next()
})

app.use("/api", router);
app.listen(port, () => {
  debug("服务器运行在" + port);
});

//真正安装依赖的时候需要在server文件夹里安装，因为前后端是要分离的，现在为了省事安装到一起了
