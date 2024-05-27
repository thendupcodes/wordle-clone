type HelpWordProps = {
  word: string;
  colors: string[];
}

export default function HelpWord({ word, colors }: HelpWordProps) {
	return (
		<div className="Help-Word">
      {word.split('').map((letter, idx) => {
        return (
          <div
            key={`${letter}-${idx}`}
            className={`Help-Word__letter-container Help-Word__letter-container--${colors[idx]}`}
          >
            <div className="Help-Word__letter">{letter}</div>
          </div>
        );
      })}
    </div>
	);
}
