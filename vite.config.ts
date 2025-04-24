import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/tsuki-hi-kanpo/', // GitHub Pages用のベースパス
  build: {
    outDir: 'dist', // ビルド出力ディレクトリ（デフォルト）
    sourcemap: true, // デバッグ用にソースマップを生成
  },
  server: {
    open: true, // 開発サーバー起動時にブラウザを自動オープン
  },
})