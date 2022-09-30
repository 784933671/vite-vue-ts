import { defineConfig, loadEnv } from "vite";
import { resolve } from "path"; // 解析路径
import vue from "@vitejs/plugin-vue";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"; //!svg图标插件
import AutoImport from "unplugin-auto-import/vite"; // 导入自动导入插件
import Components from "unplugin-vue-components/vite"; // 引入组件
import vueSetupExtend from "vite-plugin-vue-setup-extend";
export default defineConfig(({ command, mode }) => {
  const pathSrc = resolve(__dirname, "types");
  const root = process.cwd();
  const env = loadEnv(mode, root);
  return {
    base: env.VITE_BASE_URL,
    plugins: [
      vue({
        reactivityTransform: true,
      }),
      vueSetupExtend(),
      AutoImport({
        imports: ["vue", "vue/macros", "vue-router", "vuex"], //! 自动导入vue，vuex，vue-router的api
        dts: resolve(pathSrc, "auto-imports.d.ts"),
      }),
      Components({
        dirs: ["src/components"], //! 要导入组件的目录的相对路径
        extensions: ["vue", "md"],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        deep: true, //! 搜索子目录
        resolvers: [],
        dts: resolve(pathSrc, "components.d.ts"),
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(root, "src/assets/svg")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]",
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/scss/index.scss";`,
        },
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
      extensions: [".js", ".ts", ".json", ".vue"], //! 使用路径别名时想要省略的后缀名
    },
    build: {
      chunkSizeWarningLimit: 1200, //!默认： 500    chunk 大小警告的限制（以 kbs 为单位）
      outDir: env.VITE_BASE_URL.replace(/\//g, ""), //!指定输出路径
      assetsDir: "static", //! 指定生成静态资源的存放路径
      minify: "terser", //! 混淆器，terser构建后文件体积更小
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
      },
      terserOptions: {
        compress: {
          //生产环境时移除console.log()
          drop_console: command !== "serve" && mode === "build",
          drop_debugger: command !== "serve" && mode === "build",
        },
      },
    },
    server: {
      open: true,
      port: 3001,
      proxy: {
        "^/fruitsshop/.*": {
          target: "https://www.ttxli.xyz/fruitsshop",
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/fruitsshop/, "/"),
        },
      },
    },
  };
});
