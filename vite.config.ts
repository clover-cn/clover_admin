import { defineConfig, loadEnv, type ConfigEnv } from 'vite';
import { resolve } from 'path';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());
  return {
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
      extensions: ['.ts', '.vue', '.js', '.jsx', '.tsx'], // 导入时想要省略的扩展名列表。
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 引入 var.scss 这样就可以在全局中使用 var.scss中预定义的变量了
          // 给导入的路径最后加上 ;
          additionalData: '@import "./src/styles/variables.scss";',
        },
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    server: {
      proxy: {
        // 路径前缀 之后发送请求带着这个路径前缀 才会帮你转发
        '/app-dev': {
          target: 'http://gmall-h5-api.atguigu.cn', //target是要转发的那个真正的有数据的那个服务器地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/app-dev/, ''),
          // 重不重写这个路径前缀 却决于接口地址需不需要这个前缀 需要不重写  不需要才重写
        },
      },
    },
  };
});