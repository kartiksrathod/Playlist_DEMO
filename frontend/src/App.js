import React, { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "sonner";
import Playlists from "@/pages/Playlists";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Theme Toggle - Fixed position in top-right corner */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <header className="min-h-screen flex flex-col items-center justify-center">
        <a
          href="https://emergent.sh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:opacity-80 transition-opacity"
        >
          <img 
            src="https://avatars.githubusercontent.com/in/1201222?s=120&u=2686cf91179bbafbc7a71bfbc43004cf9ae1acea&v=4" 
            alt="Emergent Logo"
            className="w-32 h-32 rounded-lg"
          />
        </a>
        <p className="mt-5 text-2xl font-semibold">Building something incredible ~!</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try the theme toggle in the top-right corner ↗
        </p>
      </header>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="App">
        <Toaster position="top-center" richColors />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlists" element={<Playlists />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
