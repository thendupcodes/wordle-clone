import ToastProvider from "@/components/ToastContext";
import Wordle from "@/components/Wordle";
import { useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const toggle = () => {
    setDarkMode(!darkMode);
  }

  return (
    <ToastProvider>
      <div className={`App ${darkMode ? 'App--dark' : 'App--light'}`}>
        <div className="Wordle__header" onClick={toggle}>
          <div className="Wordle__header-title">Wordle</div>
        </div>

        <Wordle />
      </div>
    </ToastProvider>
  )
}

export default App
