import ToastProvider from "@/components/ToastContext";
import Wordle from "@/components/Wordle";
import { useState } from "react";
import Toggle from "./components/Toggle";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  }

  return (
    <ToastProvider>
      <div className={`App ${darkMode ? 'App--dark' : 'App--light'}`}>
        <div className="Wordle__header">
          <div className="Wordle__header-title">Wordle</div>

          <div className="Wordle__header-buttons">
            <Toggle
              additionalClassNames="Toggle--dark-mode"
              isToggled={darkMode}
              handleToggle={toggleDarkMode}
              offState={<i className="fa-solid fa-sun" />}
              onState={<i className="fa-solid fa-moon" />}
            />
          </div>
        </div>

        <Wordle />
      </div>
    </ToastProvider>
  )
}

export default App
