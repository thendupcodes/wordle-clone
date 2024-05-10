import { useEffect, useState } from "react";

import ToastProvider from "@/components/ToastContext";
import Toggle from "@/components/Toggle";
import Tooltip from "@/components/Tooltip";
import Wordle from "@/components/Wordle";

import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const appLocalStorage = useLocalStorage({ key: 'tt-wordle-app-state' })

  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    appLocalStorage.setItem(JSON.stringify({
      lsDarkMode: !darkMode,
      lsHighContrast: highContrast,
    }));
  }

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    appLocalStorage.setItem(JSON.stringify({
      lsDarkMode: darkMode,
      lsHighContrast: !highContrast,
    }));
  }

  useEffect(() => {
    const storageDetails = appLocalStorage.getItem();

    if (storageDetails != null) {
      const { lsDarkMode, lsHighContrast } = JSON.parse(storageDetails);
      setDarkMode(lsDarkMode);
      setHighContrast(lsHighContrast);
    }
  }, []);

  return (
    <div className={`App ${darkMode ? 'App--dark' : ''} ${highContrast ? 'App--high-contrast' : ''}`}>
      <ToastProvider>
        <>
          <div className="Wordle__header">
            <div className="Wordle__header-title">WordleClone</div>

            <div className="Wordle__header-buttons">
              <Tooltip direction="bottom-left" delay={0} content="Toggle dark mode">
                <Toggle
                  additionalClassNames="Toggle--dark-mode"
                  isToggled={darkMode}
                  handleToggle={toggleDarkMode}
                  offState={<i className="fa-solid fa-sun" />}
                  onState={<i className="fa-solid fa-moon" />}
                />
              </Tooltip>

              <Tooltip direction="bottom-left" delay={0} content="Toggle contrast">
                <Toggle
                  additionalClassNames="Toggle--high-contrast"
                  isToggled={highContrast}
                  handleToggle={toggleContrast}
                  offState={<i className="fa-solid fa-circle-half-stroke" />}
                  onState={<i className="fa-solid fa-circle-half-stroke fa-flip-horizontal" />}
                />
              </Tooltip>
            </div>
          </div>

          <Wordle darkMode={darkMode} />
        </>
      </ToastProvider>
    </div>
  )
}

export default App
