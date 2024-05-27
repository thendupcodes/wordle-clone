type HelpWordProps = {
  word: string;
  state: string;
  stateIdx: number;
  highContrast: boolean;
}

export default function HelpWord({ word, state, stateIdx, highContrast }: HelpWordProps) {
	return (
		<div className={`Help-Word ${highContrast ? 'Help-Word--high-contrast ' : ''}`}>
      {word.split('').map((letter, idx) => {
        return (
          <div
            key={`${letter}-${idx}`}
            className={`Help-Word__letter-container ${stateIdx === idx ? `Help-Word__letter-container--${state}` : ''}`}
          >
            <div className="Help-Word__letter">{letter}</div>
          </div>
        );
      })}
    </div>
	);
}
