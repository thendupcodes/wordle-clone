import { useEffect, useState } from 'react';

import Help from '@/components/Help';
import Modal from '@/components/Modal';
import ToastProvider from '@/components/ToastContext';
import Toggle from '@/components/Toggle';
import Tooltip from '@/components/Tooltip';
import Wordle from '@/components/Wordle';

import useLocalStorage from '@/hooks/useLocalStorage';

function App() {
	const appLocalStorage = useLocalStorage({ key: 'tt-wordle-app-state' });

	const [darkMode, setDarkMode] = useState(false);
	const [highContrast, setHighContrast] = useState(false);
	const [appTriggerModal, setAppTriggerModal] = useState(false);
	const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

	const modalStyle = (
		darkMode
			? {
					'--modal-overlay-bg-color': '#222222',
					'--modal-bg-color': '#101010',
					'--modal-ft-color': '#f7f7f7',
				}
			: {
					'--modal-overlay-bg-color': '#101010',
					'--modal-bg-color': '#f7f7f7',
					'--modal-ft-color': '#101010',
				}
	) as React.CSSProperties;

	const openHelpModal = () => {
		setIsHelpModalOpen(true);
	}

	const closeHelpModal = () => {
		setIsHelpModalOpen(false);
	};

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
		appLocalStorage.setItem(
			JSON.stringify({
				lsDarkMode: !darkMode,
				lsHighContrast: highContrast,
			})
		);
	};

	const toggleContrast = () => {
		setHighContrast(!highContrast);
		appLocalStorage.setItem(
			JSON.stringify({
				lsDarkMode: darkMode,
				lsHighContrast: !highContrast,
			})
		);
	};

	useEffect(() => {
		const storageDetails = appLocalStorage.getItem();

		if (storageDetails != null) {
			const { lsDarkMode, lsHighContrast } = JSON.parse(storageDetails);
			setDarkMode(lsDarkMode);
			setHighContrast(lsHighContrast);
		}
	}, []);

	return (
		<div
			className={`App ${darkMode ? 'App--dark' : ''} ${
				highContrast ? 'App--high-contrast' : ''
			}`}
		>
			<ToastProvider>
				<>
					<div className="Wordle__header">
						<div className="Wordle__header-title">WordleClone</div>

						<div className="Wordle__header-buttons">
							<Tooltip direction="bottom" delay={0} content="How to play">
								<button
									onClick={openHelpModal}
									className="Wordle__header-help-button"
								>
									<i className="fa-regular fa-circle-question"></i>
								</button>
							</Tooltip>

							<Tooltip direction="bottom" delay={0} content="See statistics">
								<button
									onClick={() => setAppTriggerModal(true)}
									className="Wordle__header-stats-button"
								>
									<i className="fa-solid fa-square-poll-vertical"></i>
								</button>
							</Tooltip>

							<Tooltip direction="bottom" delay={0} content="Toggle dark mode">
								<Toggle
									additionalClassNames="Toggle--dark-mode"
									isToggled={darkMode}
									handleToggle={toggleDarkMode}
									offState={<i className="fa-solid fa-sun" />}
									onState={<i className="fa-solid fa-moon" />}
								/>
							</Tooltip>

							<Tooltip
								direction="bottom-left"
								delay={0}
								content="Toggle contrast"
							>
								<Toggle
									additionalClassNames="Toggle--high-contrast"
									isToggled={highContrast}
									handleToggle={toggleContrast}
									offState={<i className="fa-solid fa-circle-half-stroke" />}
									onState={
										<i className="fa-solid fa-circle-half-stroke fa-flip-horizontal" />
									}
								/>
							</Tooltip>
						</div>
					</div>

					<Wordle
						darkMode={darkMode}
						modalStyle={modalStyle}
						appTriggerModal={appTriggerModal}
						setAppTriggerModal={setAppTriggerModal}
					/>

					<Modal
						isOpen={isHelpModalOpen}
						onClose={closeHelpModal}
						modalStyle={modalStyle}
					>
						<>
							<Help highContrast={highContrast} />
						</>
					</Modal>
				</>
			</ToastProvider>
		</div>
	);
}

export default App;
