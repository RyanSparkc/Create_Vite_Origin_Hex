import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import path from 'node:path';
import cheerio from 'cheerio';  // 引用 cheerio 庫來解析和修改 HTML
import { glob } from 'glob';

import inject from '@rollup/plugin-inject';

import liveReload from 'vite-plugin-live-reload';

function organizeAssetsPlugin() {
  return {
    name: 'organize-assets',
    enforce: 'post',
    apply: 'build',
    generateBundle() {
      setTimeout(() => {
        const distDir = path.resolve(__dirname, 'dist');
        const assetsDir = path.resolve(distDir, 'assets');

        const imageExtensions = ['png', 'jpg', 'jpeg', 'svg', 'gif'];

        ['css', 'js', 'images'].forEach((type) => {
          const targetDir = path.resolve(assetsDir, type); // 將資源移至 assets 子資料夾
          fs.ensureDirSync(targetDir);

          fs.readdirSync(assetsDir).forEach((file) => {
            const ext = file.split('.').pop();
            if (
              type === 'images'
                ? imageExtensions.includes(ext)
                : file.endsWith(`.${type}`)
            ) {
              fs.moveSync(
                path.resolve(assetsDir, file),
                path.resolve(targetDir, file),
                { overwrite: true }
              );
            }
          });
        });

        // 讀取和修改 HTML 檔案
        const htmlFiles = fs
          .readdirSync(distDir)
          .filter((f) => f.endsWith('.html'));
        htmlFiles.forEach((file) => {
          const filePath = path.resolve(distDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const $ = cheerio.load(content);

          // 更新 CSS 和 JS 的路徑
          $('link[rel="stylesheet"]').each(function () {
            const href = $(this).attr('href');
            if (href.startsWith('/assets/')) {
              $(this).attr('href', href.replace('/assets/', '/assets/css/'));
            }
          });
          $('script[type="module"]').each(function () {
            const src = $(this).attr('src');
            if (src.startsWith('/assets/')) {
              $(this).attr('src', src.replace('/assets/', '/assets/js/'));
            }
          });

          // 新增的代碼：更新圖片路徑
          $('img').each(function () {
            const src = $(this).attr('src');
            if (src && src.startsWith('/assets/')) {
              $(this).attr('src', src.replace('/assets/', '/assets/images/'));
            }
          });

          // 儲存修改後的 HTML
          fs.writeFileSync(filePath, $.html());
        });
      }, 1000);
    },
  };
}

function moveOutputPlugin() {
  return {
    name: 'move-output',
    enforce: 'post',
    apply: 'build',
    async generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName.startsWith('pages/')) {
          const newFileName = fileName.slice('pages/'.length);
          bundle[fileName].fileName = newFileName;
        }
      }
    },
  };
}

export default defineConfig({
  // base 的寫法：
  // base: '/Repository 的名稱/'
  // base: 'web_slicing_2023_Alpha',
  plugins: [
    liveReload(['./layout/**/*.ejs', './pages/**/*.ejs', './pages/**/*.html']),
    ViteEjsPlugin(),
    moveOutputPlugin(),
    organizeAssetsPlugin(),
    // inject({
    //   $: 'jquery', // 这里会自动载入 node_modules 中的 jquery
    //   jQuery: 'jquery',
    //   'windows.jQuery': 'jquery',
    // }),
  ],
  css: {
    // 增加 source map
    devSourcemap: true,
  },
  server: {
    // 啟動 server 時預設開啟的頁面
    open: 'pages/index.html',
  },
  build: {
    assetsDir: 'assets', // 初始所有資源都會放這裡
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync('pages/**/*.html')
          .map((file) => [
            path.relative(
              'pages',
              file.slice(0, file.length - path.extname(file).length)
            ),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
    },
    outDir: 'dist',
  },
});
