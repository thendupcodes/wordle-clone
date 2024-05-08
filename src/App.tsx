import ToastProvider from "@/components/ToastContext";
import Wordle from "@/components/Wordle";

function App() {
  return (
    <ToastProvider>
      <>
        <div className="Wordle__header">
          <div className="Wordle__header-title">Wordle</div>
        </div>

        <Wordle />
      </>
    </ToastProvider>
  )
}

export default App
