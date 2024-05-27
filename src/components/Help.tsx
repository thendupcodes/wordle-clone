import HelpWord from "./HelpWord";

type HelpProps = {
  highContrast: boolean;
  helpStyle: React.CSSProperties;
}

export default function Help({ highContrast, helpStyle }: HelpProps) {
	return (
		<div className="Help" style={helpStyle}>
      <div className="Help__heading">WordleClone</div>

      <div className="Help__main">
        Welcome to WordleClone! The goal of the game is to guess the hidden 5-letter word in six tries or less, BUT THERE IS A TWIST! In this game, all the words are terms or abbreviations you would hear in the software engineering world.
      </div>

      <div className="Help__body">
        <div className="Help__body-heading">How to play</div>

        <div className="Help__body-content">
          <ul>
            <li>Type a 5-letter word and press the "Enter" key to submit your guess.</li>

            <li>After you submit a guess, each letter will change color to give you hints about the hidden word.</li>

            <li>Examples:
              <div className="Help__body-content-example">
                <HelpWord word="REGEX" state="correct" stateIdx={1} highContrast={highContrast} />
                <strong>{highContrast ? 'Orange' : 'Green'}</strong>: The letter is in the word and in the correct position.
              </div>

              <div className="Help__body-content-example">
                <HelpWord word="HTTPS" state="partial" stateIdx={2} highContrast={highContrast} />
                <strong>{highContrast ? 'Blue' : 'Yellow'}</strong>: The letter is in the word but in the wrong position.
              </div>

              <div className="Help__body-content-example">
                <HelpWord word="SCRUM" state="wrong" stateIdx={4} highContrast={highContrast} />
                <strong>Gray</strong>: The letter is not in the word at all.
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="Help__body">
        <div className="Help__body-heading">Tips and Strategies</div>

        <div className="Help__body-content">
          <ul>
            <li>Start with common words that use a variety of letters.</li>

            <li>Pay attention to letter frequencies and common letter patterns.</li>

            <li>Use the color feedback to eliminate possibilities and zero in on the correct word.</li>
          </ul>
        </div>
      </div>

      <div className="Help__footer">
				<p>Thanks for playing!</p>
			</div>
    </div>
	);
}
