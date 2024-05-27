type HelpProps = {
  highContrast: boolean
;}

export default function Help({ highContrast }: HelpProps) {
	return (
		<div className="Help">
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

            <ul>
              <li><strong>{highContrast ? 'Orange' : 'Green'}</strong>: The letter is in the word and in the correct position.</li>
              <li><strong>{highContrast ? 'Blue' : 'Yellow'}</strong>: The letter is in the word but in the wrong position.</li>
              <li><strong>Gray</strong>: The letter is not in the word at all.</li>
            </ul>
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
