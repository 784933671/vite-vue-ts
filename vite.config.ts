import { defineConfig } from "vite";
import { resolve } from "path"; // 解析路径
import vue from "@vitejs/plugin-vue";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"; //!svg图标插件
import AutoImport from "unplugin-auto-import/vite"; // 导入自动导入插件
import Components from "unplugin-vue-components/vite"; // 引入组件
export default defineConfig(({ command, mode }) => {
  const pathSrc = resolve(__dirname, "types");
  const root = process.cwd();
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ["vue", "vue-router", "vuex"], //! 自动导入vue，vuex，vue-router的api
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
          additionalData: `
          @use "@/assets/scss/global.scss" as *;`,
        },
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
      extensions: [".js", ".ts", ".json", ".vue"], //! 使用路径别名时想要省略的后缀名
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
