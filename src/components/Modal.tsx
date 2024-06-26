import { ReactElement, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
	isOpen: boolean;
	children: ReactElement;
	onClose: () => void;
	modalStyle: React.CSSProperties;
};

export default function Modal({
	isOpen,
	children,
	onClose,
	modalStyle,
}: ModalProps) {
	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			onClose();
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown, false);

		return () => {
			window.removeEventListener('keydown', handleKeyDown, false);
		};
	}, []);

	if (!isOpen) return null;

	return createPortal(
		<div className="Modal" style={modalStyle}>
			<div className="Modal__overlay"></div>

			<div className="Modal__body">
				<div className="Modal__body-close">
					<button className="Modal__body-close-button" onClick={onClose}>
						<i className="fa fa-light fa-xmark"></i>
					</button>
				</div>

				<div className="Modal__body-children">{children}</div>
			</div>
		</div>,
		document.getElementById('portal')
	);
}
