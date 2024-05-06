import { useCallback, useEffect, useState } from 'react';

import Row from '@/components/Row';

async function fetchWords () {
  const response = await fetch('/api/fe/wordle-words');

  return await response.json();
}

export default function Wordle () {  
  const [mainWord, setMainWord] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(null))
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    fetchWords().then((data) => {
      const word = data[Math.floor(Math.random() * data.length)]

      setMainWord(word);
    })
  }, [])

  const handleChange = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
      if (e.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0,-1));
      } else if (e.key === 'Enter' && currentGuess.length === 5) {
        const temp = guesses;
        temp[currentRow] = currentGuess;
        setGuesses(temp);

        console.log({ currentGuess, mainWord, currentRow })

        if (currentGuess.toLowerCase() === mainWord.toLowerCase() || currentRow === 6) {
          setGameOver(true);
        }

        setCurrentRow((x) => x+1);
        setCurrentGuess('');
      } else {
        if (e.keyCode >= 65 && e.keyCode <= 90 && currentGuess.length < 5) {
          setCurrentGuess(currentGuess + e.key);
        }
      }
  }, [currentGuess, currentRow, mainWord, gameOver])

  useEffect(() => {    
    window.addEventListener('keydown', (e) => handleChange(e))

    return () => {
      window.removeEventListener('keydown', handleChange);
    }
  }, [currentGuess, currentRow, mainWord, gameOver])

  useEffect(() => {
    console.log({ mainWord, gameOver })
  }, [mainWord, gameOver])

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
      <div className="Wordle__header">Let's play WORDLE!</div>

      <div className="Wordle__body">
        <div className="Wordle__body-grid">
          {/* loop over each guess (row), then loop over row (letter) */}

          {guesses.map((guess, rIdx) =>
            <Row
              key={rIdx}
              guess={currentRow === rIdx ? currentGuess : guess}
              rIdx={rIdx}
              mainWord={mainWord}
              isSubmitted={currentRow > rIdx}
            />
          )}
        </div>
      </div>
    </div>
  );
}

