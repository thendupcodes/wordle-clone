import ToastProvider from "@/components/ToastNotification/ToastContext";
import Wordle from "@/components/Wordle";

function App() {
  return (
    <ToastProvider>
      <Wordle />
    </ToastProvider>
  )
}

export default App
