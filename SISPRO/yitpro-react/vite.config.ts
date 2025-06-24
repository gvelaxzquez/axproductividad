import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../wwwroot/react/dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        login: './src/features/index-login.tsx',
        bitacoratrabajo: './src/features/index-bitacoratrabajo.tsx',
        workspace: './src/features/index-workspace.tsx',
        workspacelist: './src/features/index-workspacelist.tsx',
        chatBotOpenAI: './src/features/index-chatbot.tsx',
        kanban: './src/features/index-kanban.tsx'
      },
      output: {
        entryFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      }
    }
  }
})
