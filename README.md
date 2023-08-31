# 试题便笺

Created: August 14, 2022 10:01 PM

### 项目构建

1. 创建项目
    
    ```jsx
    npm init vite@latest
    ```
    
2. 模块需求
    - axios网络连接：做一个utils工具类
    - ElementUI
3. 分配页面：在components里加组件
4. 配置路由：在router里配置
5. 全局样式：在assets文件夹下新建css文件夹，由于这是公共的内容，所以应该引入在入口文件
    
    *main.ts*
    
    ```jsx
    import { createApp } from 'vue'
    import './style.css'
    import App from './App.vue'
    import router from './router'
    import store from './store'
    import './assets/css/common.css'
    
    const app=createApp(App)
    app.use(router)
    app.use(store)
    app.mount('#app')
    ```
    

### 引入Element UI

- Element UI引入：在入口文件配置并挂载，会导致有很多用不上的组件都被打包进来了，导致包的体积非常大，我们使用按需导入：
    
    先下载`npm i unplugin-vue-components unplugin-auto-import -D`
    
    然后配置*vite.config.js*
    
    ```jsx
    import { defineConfig } from 'vite'
    import vue from '@vitejs/plugin-vue'
    import AutoImport from 'unplugin-auto-import/vite'
    import Components from 'unplugin-vue-components/vite'
    import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
    
    export default defineConfig({
        plugins: [
            vue(),
            AutoImport({
              resolvers: [ElementPlusResolver()],
            }),
            Components({
              resolvers: [ElementPlusResolver()],
            }),
        ],
    })
    ```
    

### 项目结构整理

1. 初始化CSS：将一个全局初始化的css文件引入入口文件
2. 增加视图UI组件

### 配置路由+路由懒加载

路由懒加载有多种方式，最推荐使用的是`import()`

如果是需要显示在首页的内容，就不需要懒加载了，因为一定要加载

子路由嵌套的时候不需要加`/`

```jsx
import { createRouter, createWebHistory } from "vue-router";
import Layout from "../views/Layout.vue";
import login from "../views/Login.vue";
import Product from "../views/Product/index.vue";
const params = () => import("../views/Params/index.vue");
const content = () => import("../views/Content/index.vue");
// const login = () => import("../views/Login.vue");
const routes = [
  {
    path: "/",
    name: "Layout",
    component: Layout,
    children: [
      {
        path: "/",
        name: "Product",
        component: Product,
        meta:{
          isLogin:true
        }
      },
      {
        path: "params",
        name: "params",
        component: params,
        meta:{
          isLogin:true
        }
      },
      {
        path: "content",
        name: "content",
        component: content,
        meta:{
          isLogin:true
        }
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
```

如果main.ts出现报错，无法找到router对应的声明文件，可能是因为当前版本过高或者过低，重新下载一下即可

```jsx
npm install vue-router@next --save
```

这里踩了个雷，如果使用嵌套路由的话，一定要在父页面中加`<router-view>` ，给子页面提供显示的视图，而且*App.vue*中必须加`<router-view>` ，否则路由会失效

### 路由守卫+登录验证

前面已经在路由的`meta`属性中自定义了一个`isLogin` 字段，在路由文件夹中新建一个`permission`文件作为登录验证，由于是登录验证是全局的，因此也要在*main.ts*中引入一下

这里先判断去往的路径的是否需要登录验证，如果不需要直接去，如果需要的话跳转到登录界面

使用token模拟用户是否已经登录，如果登录的话，就可以跳转到去往的路径了

```jsx
import router from ".";
router.beforeEach((to, from, next) => {
  if (to.meta.isLogin) {
    const token = true;
    if (token) {
      next();
    } else {
      next({
        path: "/login",
      });
    }
  } else {
    next();
  }
});
```

### 服务器端环境构建

- 依赖：express、mysql、jsonwebtoken
    
    这里的mysql可以使用navicat，也可以用xampp建一个虚拟数据库
    
- 自动刷新：nodemon
- 前后台一次性运行配置：在*package.json*中修改指令，让前后台服务器同时运行
    
    ```jsx
    "dev":"concurrently \"npm run serve\" \"nodemon derve/index.js\""
    ```
    
    1. **`"dev"`**: 是自定义的命令名称，可以在终端中使用这个命令来运行后面定义的任务
    2. **`concurrently`**: 一个用于同时运行多个命令的工具
    3. **`"npm run serve"`**: 运行名为 **`serve`** 的脚本，通常情况用于启动前端开发服务器
    4. **`"nodemon derve/index.js"`**: 用于启动后端服务器

*index.js*

```jsx
import express from "express";
import router from "./router.js";
import debug from "debug";
import bodyParser from "body-parser";
import exp from "constants";

const app = express();
const port = 5050;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json())
app.use(bodyParser.json());
app.use("/api", router);
app.listen(port, () => {
  debug("服务器运行在" + port);
});

//真正安装依赖的时候需要在server文件夹里安装，因为前后端是要分离的，现在为了省事安装到一起了
```

*router.js*

```jsx
import express from "express";
import sqlFn from "./mysql/index.js";
import jwt from "jsonwebtoken";
import config from "./config.js";
const router = express.Router();

//这个是服务器，因此是发送响应的
router.post("/login", (req, res) => {

    const { username, password } = req.body;
    const sql = "select * from user where `username`=? and `password`=?";
    const arr = [username, password];
    sqlFn(sql, arr, (result) => {
      if (result.length > 0) {
        const token = jwt.sign(
          {
            id: result[0].id,
            username: result[0].username,
          },
          config.jwtSecret
        );
        res.send(token);
      } else {
        res.status(401).json({
          errors: "用户名密码错误",
        });

      }
    });
  console.log("okok");
});
//暴露router模块，export default是commonJS的规范
export default router;
```

引入mysql的配置

```jsx
import mysql from "mysql";

//创建连接
let client = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "web2023",
});
//连接数据库

//执行sql
function sqlFn(sql, arr, callback) {
  client.query(sql, arr, function (err, result) {
    if (err) {
      console.log(err);
      console.log('连接错误')
      return;
    }
    callback(result);
  });
}

export default sqlFn
```

### 登录界面逻辑

1. 解决跨域问题
    
    想要在Vue原型上挂载方法，vue2的`Vue.prototype.$api = api` 已经不适用了，vue3的方法是：
    
    ```jsx
    import api from "./api";
    
    const app = createApp(App);
    app.config.globalProperties.$api = api;
    ```
    
    *api/index.js*
    
    ```jsx
    //网络请求方法有三类，原生的是ajax，还有个Fetch API，这里用最常用的第三方库axios
    import axios from "../utils/request";
    import base from "./base";
    
    const api = {
      //login
      login(params) {
        return axios.post(base.baseUrl + base.loginUrl,params)
      },
    };
    
    export default api;
    ```
    
    导入的axios是我们已经封装好，设置好拦截头的request模块
    
    这里有一个大坑，如果把`baseUrl`写为`/api`，`loginUrl`写为`/login`，哪怕在post请求中拼接了也没用，会显示401地址错误，`loginUrl`一定要写为`/api/login`，不知道为什么
    
    在setup中调用：
    
    注意使用getCurrentInstance获取当前上下文对象这种操作的话，需要在setup内进行，因此，如果浏览器报错说获取不到当前上下文对象的话，那就用`onMounted()` 括起来，等到setup之后，再去获取上下文对象
    
    ```jsx
    // 必须引入
    import { getCurrentInstance } from 'vue'
    
    export default {
    	name: 'travelTravel',
    	setup() {
    		const { proxy } = getCurrentInstance()
    		console.log(proxy.$api.login())   
    	},
    }
    ```
    
    由于我们用的是vite构建的项目，所以不要新建一个vue.config.js文件，而是直接在vite.config.ts文件中加代理
    
    ```jsx
    server: { //主要是加上这段代码
        host: 'localhost',
        port: 5173,//前端的端口
        proxy: {
          '/api': {
            target: 'http://localhost:5050',	//实际请求的服务器端口
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          },
        }
      }
    ```
    
2. 服务器端登录注册接口
    
    如果不知道返回的参数是什么的话，可以在postman中打印一下看看
    
    这里有一个mysql相关的知识，如果服务器端对数据库执行了插入操作的话，如果插入成功，会返回一个大于0的affectedRows参数，也就是影响了几行，这个在直接对数据库进行操作的时候也会显示
    
    *router.js*
    
    ```jsx
    //暴露router模块，export default是commonJS的规范
    router.post("/register", (req, res) => {
      const { username, password, email } = req.body;
      const sql = "insert into user values(null,?,?,?)";
      const arr = [username, password, email];
      sqlFn(sql, arr, (result) => {
        if (result.affectedRows > 0) {
          res.send({
            msg: "注册成功",
            status: 200,
          });
        } else {
          res.status(401).json({
            errors: "该用户名已被注册",
          });
        }
      });
    });
    export default router;
    ```
    
3. 添加状态管理
    
    先全局引入pinia，再在store文件夹下创建modules文件夹，把每个模块要用的状态管理文件都放这里，然后一起在index.ts文件中引入
    
    <aside>
    🍨 *在谷歌浏览器下一个vuedev扩展工具可以在开发者页面看到pinia的状态*
    
    </aside>
    
    *主要过程见vue3基础pinia*
    
    把登录的过程和已登录的token存在状态管理中，注册就不用了，注册只要单纯地给后台发请求就可以了，不需要进行一个本地的存储
    
    本地持久化如果用了localStorage那就是永久地存储在本地，cookie是带时效性的，过一段时间就会给你清除掉
    

### 制作菜单栏

使用element-plus组件中的菜单即可，引入图标

```jsx
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

当我们激活当前页面的菜单项的时候，如果强制刷新会导致菜单回到原始页，但是路由还是不变的，从而会出现菜单项和当前页面对不上的问题，需要用localStorage在每次菜单切换的时候对当前路由进行存储，在页面刷新时将初始菜单项设置为localStorage中存储的页面，这需要用到onMounted生命周期函数，因为我们使用的菜单组件只有在第一次加载出来，也就是挂载的时候，才需要知道自己从哪里取值，在对页面进行操作的时候直接从ref中取值就可以了

```jsx
import { onMounted,computed } from "vue";
import store from "@/store";
const handleSelect = (key) => {
  localStorage.setItem("path", key);
};

let activeIndex = $ref("/");
let username = $ref(computed(()=>{
    return (store().loginStore.user.username)
}))

onMounted(() => {
  activeIndex = localStorage.getItem("path");
});

```

当前用户的值需要从状态管理中取，并且只需要在状态发生变化的时候取就行了，如果不写在计算属性里的话每次页面重新渲染都要去取一次状态，很拖累性能

退出登录的逻辑是需要把localStorage清空、跳转回登录页面、把状态管理中的user清空

### 分页显示

1. 向服务器请求数据，参数是当前页码，服务器根据当前页码对数据库进行查询，将查到的数据返回给浏览器端
    
    这一过程需要服务器配置路由，让客户端知道向哪个网址请求数据
    
    ```jsx
    router.get("/item/selectItemByPage", (req, res) => {
      const page = url.parse(req.url, true).query.page || 1;
      const sql =
        "select * from feminist_books order by id desc limit 10 offset " +
        (page - 1);
      sqlFn(sql, null, (result) => {
        if (result.length > 0) {
          //直接回消息不好，一般会给一个数据结构
          res.send({
            status: 200,
            data: result,
          });
        } else {
          res.send({
            status: 500,
            msg: "没有数据",
          });
        }
      });
    });
    ```
    
2. 将配置好的路由记录在前端的api中，让前端知道向哪个网址请求数据
    
    ```jsx
    const base={
      bookList:"/api/item/selectItemByPage"
    };
    ```
    
    记录下api后，配置请求，第一个参数为请求地址，第二个参数为请求参数
    
    ```jsx
    const api = {
      //get接口和post接口不一样，传参数要传一个对象
      bookList(params){
        return axios.get(base.baseUrl + base.bookList,{params})
      }
    };
    ```
    
3. 在分页组件的index下另开一个页面，因为index是主页面，不能把所有内容都堆主页面当中，*应该分为智能组件用来获取数据，非智能组件用来展示数据*
    
    因为要先获取数据，在渲染组件，所以要在onMounted中对数据进行请求
    
    所以执行顺序就是先执行setup中的代码，同时创建dom元素，再执行onMounted中的代码，同时对dom元素上的数据进行挂载
    
    ```jsx
    import { onMounted, getCurrentInstance } from "vue";
    const { proxy } = getCurrentInstance();
    let book = [];
    onMounted(() => {
      proxy.$api.bookList().then((res) => {
        console.log(res.data);
        if (res.data.status == 200) {
          book = res.data.data;
        }
      });
    });
    ```
    
4. 因为每页显示的模版都一样，只是请求的数据不一样，因此可以把模版部分写为组件，请求参数由父元素传入
    
    **但是这里有一个大坑！！**
    
    一般父传子用的都是defineProps，但是这只能传模版量，scipt是收不到这个参数的，因为script是在setup中执行的，而父传子是在onMounted中执行的
    
    如果想在scipt中用到父组件传过来的值，应该使用provide和inject
    

### 后续改进

1. 至今仍不知道怎么去监听ref变量，使变量每次更改后更新store中变量的值
2. 绑定键盘事件不生效
3. 其他都很完美
