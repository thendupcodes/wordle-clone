import { getWord, wordIsInDictionary } from "@/helpers/dictionaryHelpers";
import isLetter from "@/helpers/isLetter";
import { useCallback, useEffect, useMemo, useState } from "react";

const FULL_CORRECT_CLASS = 'Wordle__body-grid-cell--full-correct';
const HALF_CORRECT_CLASS = 'Wordle__body-grid-cell--half-correct';
const NOT_CORRECT_CLASS = 'Wordle__body-grid-cell--not-correct';
const FILLED_CLASS = 'Wordle__body-grid-cell--filled';

export default function useWordle () {
  const [answer, setAnswer] = useState('')
  const [currentGuess, setCurrentGuess] = useState('');
  const [guessHistory, setGuessHistory] = useState<string[]>(Array(6).fill(''))
  const [guessIndex, setGuessIndex] = useState(0);

  const deleteChar = () => {
    setCurrentGuess((prev) => prev.slice(0,-1));
  }

  const grid = useMemo(() => {
    return guessHistory.map((guessHistoryWord, rowIdx) => {
      const isSubmitted = rowIdx < guessIndex;
      const guess = rowIdx === guessIndex ? currentGuess :  guessHistoryWord;
      const answerCompare = answer.split('');

      const gridChars = Array(5).fill(null).map((_, idx) => {
        const guessChar = guess?.[idx] || '';

        return {
          charKey: guessChar,
          charClass: guessChar != '' ? FILLED_CLASS : '',
        };
      });

      if (isSubmitted) {
        // Instantiate all chars as being wrong, we will add correct classes later
        gridChars.forEach((_, idx) => {
          gridChars[idx].charClass = NOT_CORRECT_CLASS;
        });

        
        // Style the charactes that are in the word AND in the correct spot
        gridChars.forEach((guessChar, idx) => {
          if (answer[idx] === guessChar.charKey) {
            gridChars[idx].charClass = FULL_CORRECT_CLASS;
            
            // Modify the answer being compared for cases like duplicate letters in the guess
            //   e.g. if answer=BREAK and guess=KAYAK, only 1 K and 1 A should be styled correctly
            answerCompare.splice(answerCompare.indexOf(guessChar.charKey), 1);
          }
        });


        // Style the charactes that are in the word BUT NOT in the correct spot
        gridChars.forEach((guessChar, idx) => {
          if (answerCompare.includes(guessChar.charKey) && gridChars[idx].charClass != FULL_CORRECT_CLASS) {
            gridChars[idx].charClass = HALF_CORRECT_CLASS;
            answerCompare.splice(answerCompare.indexOf(guessChar.charKey), 1);
          }
        });
      }

      return gridChars;
    });
  }, [guessHistory, guessIndex, currentGuess, answer])

  console.log({ grid });

  const submitGuess = useCallback(() => {
    if (guessIndex > 5) {
      // User has used up all guesses
      console.log('GAME OVER');
      return;
    }

    if (guessHistory.includes(currentGuess)) {
      // Already guessed case
      console.log('ALREADY GUESSED');
      return;
    }

    if (currentGuess.length !== 5) {
      // not enough chars in guess
      console.log('NOT ENOUGH');
      return;
    }

    if (!wordIsInDictionary(currentGuess)) {
      // Word is invalid
      console.log('INVALID');
      return;
    }
  
    setGuessHistory(prev => {
      const temp = [...prev]; // Create a copy of the guesses array
      temp[guessIndex] = currentGuess; // Update the current row with the current guess
      return temp; // Return the updated guesses array
    });
  
    setGuessIndex(prevRow => prevRow + 1); // Increment current row
    setCurrentGuess(''); // Reset current guess
  }, [currentGuess, guessHistory, guessIndex]);

  const addChar = (char: string) => {
    if (currentGuess.length < 5) {
      setCurrentGuess(prev => {
        return (prev + char.toUpperCase());
      });
    }
  }

  const handleUserInput = (e: KeyboardEvent) => {
    if (isLetter(e.key)) {
      return addChar(e.key);
    } else if (e.key === 'Backspace') {
      return deleteChar();
    } else if (e.key === 'Enter') {
      return submitGuess();
    } 
  }

  useEffect(() => {
    const word = getWord();

    setAnswer(word);
  }, []);

  return { answer, grid, currentGuess, guessIndex, handleUserInput };
}