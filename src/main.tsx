import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./context/LanguageContext";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
         <LanguageProvider>
           <BrowserRouter>
             <App />
           </BrowserRouter>
         </LanguageProvider>
       </ThemeProvider>
  </StrictMode>,
)
