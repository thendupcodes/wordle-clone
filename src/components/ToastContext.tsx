import {
	ReactElement,
	createContext,
	useContext,
	useMemo,
	useState,
} from 'react';

type Toast = {
	id: number;
	message: string;
	style: React.CSSProperties;
};

type ToastContextType = {
	openToast: (message: string, duration?: number) => void;
	closeToast: (id: number) => void;
	toasts: Toast[];
};

export const ToastContext = createContext<ToastContextType>(null);

export const useToaster = () => useContext(ToastContext);

export default function ToastProvider({
	children,
}: {
	children: ReactElement;
}) {
	const [toasts, setToasts] = useState([]);

	const openToast = (message: string, duration = 2000) => {
		const newToast = {
			id: Date.now(),
			message: message,
			style: {
				animationDuration: `${duration}ms`
			}
		};

		setToasts((prev) => [newToast, ...prev]);

		setTimeout(() => {
			closeToast(newToast.id);
		}, duration);
	};

	const closeToast = (id: number) => {
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id != id));
		}, 300);
	};

	const contextVal = useMemo(() => {
		return {
			openToast,
			closeToast,
			toasts,
		};
	}, []);

	return (
		<ToastContext.Provider value={contextVal}>
			{children}
			<div className="Toast-List">
				{toasts.length > 0 &&
					toasts.map((t) => {
						return (
							<div className="Toast" key={t.id} style={t.style}>
								{t.message}
							</div>
						);
					})}
			</div>
		</ToastContext.Provider>
	);
}
