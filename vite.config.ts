import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";
export default defineConfig({
  // 起个别名，在引用资源时，可以用‘@/资源路径’直接访问
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ["vue", "vue-router"],
      //这东西是自动导入vue和router，用了它以后，每个vue文件都不必 import { onMounted, reactive, ref, toRef } from 'vue';
      //import { useRoute, useRouter } from 'vue-router'了
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    //主要是加上这段代码
    host: "localhost",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5050", //实际请求地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  // 配置前端服务地址和端口
  // server: {
  //   host: 'http://localhost',
  //   port: 5173,
  //   // 是否开启 https
  //   https: false,
  // },
  // // 设置反向代理，跨域
  // proxy: {
  //   '/api': {
  //     // 后台地址
  //     target: 'http://localhost:5050/',
  //     changeOrigin: true,
  //     rewrite: path => path.replace(/^\/api/, '')
  //   }
  //   // ,
  //   // '/api2': {
  //   //   // 后台地址
  //   //   target: 'http://127.0.0.1:8956/',
  //   //   changeOrigin: true,
  //   //   rewrite: path => path.replace(/^\/api2/, '')
  //   // }
  // }
});
