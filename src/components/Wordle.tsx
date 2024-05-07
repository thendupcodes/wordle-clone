import { useEffect } from 'react';

import Keyboard from '@/components/Keyboard';
import Row from '@/components/Row';
import useWordle from '@/hooks/useWordle';

export default function Wordle () {  
  const { grid, guessIndex, handleUserInput, keyboardKeys, gameOver } = useWordle();

  useEffect(() => {
    if (!gameOver) {
      window.addEventListener('keyup', handleUserInput);
    }

    return () => {
      window.removeEventListener('keyup', handleUserInput);
    }
  }, [handleUserInput, gameOver])

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
          {grid.map((cells, rowIdx) =>
            <Row
              key={`row-${rowIdx}`}
              cells={cells}
              rowIdx={rowIdx}
              isSubmitted={rowIdx < guessIndex}
            />
          )}
        </div>

        <div className="Wordle__body-keyboard">
          <Keyboard keyboardKeys={keyboardKeys} />
        </div>
      </div>
    </div>
  );
}

