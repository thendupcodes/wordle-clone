import ToastProvider from "@/components/ToastContext";
import Wordle from "@/components/Wordle";
import { useState } from "react";
import Toggle from "./components/Toggle";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  }

  const toggleContrast = () => {
    setHighContrast(!highContrast);
  }

  return (
    <div className={`App ${darkMode ? 'App--dark' : ''} ${highContrast ? 'App--high-contrast' : ''}`}>
      <ToastProvider>
        <>
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

              <Toggle
                additionalClassNames="Toggle--high-contrast"
                isToggled={highContrast}
                handleToggle={toggleContrast}
                offState={<i className="fa-solid fa-circle-half-stroke" />}
                onState={<i className="fa-solid fa-circle-half-stroke fa-flip-horizontal" />}
              />
            </div>
          </div>

          <Wordle />
        </>
      </ToastProvider>
    </div>
  )
}

export default App
