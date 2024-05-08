import { useEffect } from 'react';

import Keyboard from '@/components/Keyboard';
import Row from '@/components/Row';
import useWordle from '@/hooks/useWordle';

export default function Wordle () {  
  const {
    grid,
    guessIndex,
    shakeRow,
    keyboardKeys,
    gameOver,
    gameWon,
    winningRow,
    avoidAnimationIdx,
    handleUserInput,
    submitGuess,
    addChar,
    deleteChar,
  } = useWordle();

  useEffect(() => {
    window.addEventListener('keyup', handleUserInput);

    if (gameOver) {
      window.removeEventListener('keyup', handleUserInput);
    }

    return () => {
      window.removeEventListener('keyup', handleUserInput);
    }
  }, [handleUserInput, gameOver])

  return (
    <div className="Wordle">
      <div className="Wordle__body">
        <div className="Wordle__body-grid">
          {grid.map((cells, rowIdx) =>
            <Row
              key={`row-${rowIdx}`}
              cells={cells}
              rowIdx={rowIdx}
              shakeRow={guessIndex === rowIdx && shakeRow}
              gameWon={gameWon}
              winningRow={winningRow}
              avoidAnimation={rowIdx < guessIndex && (gameWon ? rowIdx < avoidAnimationIdx : rowIdx <= avoidAnimationIdx)}
              isSubmitted={rowIdx < guessIndex}
            />
          )}
        </div>

        <div className="Wordle__body-keyboard">
          <Keyboard
            keyboardKeys={keyboardKeys}
            submitGuess={submitGuess}
            addChar={addChar}
            deleteChar={deleteChar}
          />
        </div>
      </div>
    </div>
  );
}

