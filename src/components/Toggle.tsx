type ToggleProps = {
	isToggled: boolean;
	handleToggle: () => void;
	offState: React.ReactNode; // Off-state icon component
	onState: React.ReactNode; // On-state icon component
	additionalClassNames?: string;
};

export default function Toggle({
	isToggled = false,
	handleToggle,
	offState,
	onState,
	additionalClassNames = '',
}: ToggleProps) {
	return (
		<div
			className={`Toggle ${additionalClassNames} ${
				isToggled ? 'Toggle--toggled' : ''
			}`}
			onClick={handleToggle}
		>
			<div className="Toggle__icon-wrapper">
				<div className="Toggle__icon">{isToggled ? onState : offState}</div>
			</div>
		</div>
	);
}
