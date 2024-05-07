import { ReactElement, createContext, useContext, useMemo, useState } from 'react';

type Toast = {
  id: number,
  message: string,
}

type ToastContextType = {
  openToast: (message: string, duration?: number) => void,
  closeToast: (id: number) => void,
  toasts: Toast[],
}

export const ToastContext = createContext<ToastContextType>(null);

export const useToaster = () => useContext(ToastContext);

export default function ToastProvider ({ children } : { children: ReactElement }) {
  const [toasts, setToasts] = useState([]);

  const openToast = (message: string, duration = 700) => {
    const newToast = {
      id: Date.now(),
      message: message,
    }

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      closeToast(newToast.id)
    }, duration)
  }

  const closeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id != id))
  }

  const contextVal = useMemo(() => {
    return {
      openToast,
      closeToast,
      toasts,
    }
  }, []);

  return (
    <ToastContext.Provider value={contextVal} >
      {children}
      <div className="Toast-List">
        {toasts.length > 0 && (
          toasts.map((t) => {
            return (
              <div
                className="Toast"
                key={t.id}
              >
                {t.message}
              </div>
            );
          })
        )}
      </div>
    </ToastContext.Provider>
  );
}