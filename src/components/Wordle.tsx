import { useEffect } from 'react';

import Keyboard from '@/components/Keyboard';
import Row from '@/components/Row';
import useWordle from '@/hooks/useWordle';

export default function Wordle () {  
  const { gridGuessHistory, gridCurrentGuess, gridGuessesLeft, guessIndex, handleUserInput } = useWordle();

  useEffect(() => {
    window.addEventListener('keyup', handleUserInput)

    return () => {
      window.removeEventListener('keyup', handleUserInput);
    }
  }, [handleUserInput])

  useEffect(() => {
    console.log({ gridGuessHistory });
  }, [gridGuessHistory]);

  useEffect(() => {
    console.log({ gridCurrentGuess });
  }, [gridCurrentGuess]);

  useEffect(() => {
    console.log({ gridGuessesLeft });
  }, [gridGuessesLeft]);

  return (
    // Wrapper 
    // Header => Title
    // Body => Grid of 6 rows x 5 cols
    // Each cell will be a div
    // Each div will contain an input that the user can type into

    // inputs on each cell
    // only activate the inputs for the current row
    // only activate the input for the current cell (based on users input)
    // user can type only a-z (cap or no cap)
    // on each value change, jump to next input
    // on backspace, delete last value
    // on enter, submit if user has typed all cells in the row

    <div className="Wordle">
      <div className="Wordle__header">
        WORDLE
      </div>

      <div className="Wordle__body">
        <div className="Wordle__body-grid">
          {gridGuessHistory.map((cells, idx) =>
            <Row
              key={`previous-guess-${idx}`}
              cells={cells}
              rowIdx={idx}
              isSubmitted={true}
            />
          )}

          <Row
            key={`current-guess-$}`}
            cells={gridCurrentGuess}
            rowIdx={guessIndex}
          />

          {gridGuessesLeft.map((cells, idx) =>
            <Row
              key={`next-guess-${idx}`}
              cells={cells}
              rowIdx={guessIndex + idx + 1}
            />
          )}
        </div>

        <div className="Wordle__body-keyboard">
          <Keyboard />
        </div>
      </div>
    </div>
  );
}

