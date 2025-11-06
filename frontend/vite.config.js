    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import tailwindcss from '@tailwindcss/vite'


    // https://vite.dev/config/
    export default defineConfig({
      plugins: [react(), tailwindcss(), ],
      define:{
        __BACKEND_URL__: JSON.stringify(process.env.VITE_BACKEND_URL || "https://neuranotes-backend-ert6.onrender.com"),
        __LANGCHAIN_FASTAPI_URL__: JSON.stringify(process.env.VITE_LANGCHAIN_FASTAPI_URL || "https://langchain-neuranotes.onrender.com"),
      }
    })
