import { useCallback, useEffect, useMemo, useState } from "react";

import { getWord, wordIsInDictionary } from "@/helpers/dictionaryHelpers";
import isLetter from "@/helpers/isLetter";

import alphabetLetters from '@/dictionary/alphabets.json';

const TOTAL_GUESSES = 6;
const WORD_LENGTH = 5;

const KEY_STATE_DEFAULT = 'default';
const KEY_STATE_CORRECT = 'correct';
const KEY_STATE_PARTIAL = 'partial';
const KEY_STATE_WRONG = 'wrong';

export type KeyboardLetter = {
  id: string;
  key: string;
  state: typeof KEY_STATE_DEFAULT | typeof KEY_STATE_CORRECT | typeof KEY_STATE_PARTIAL | typeof KEY_STATE_WRONG;
}

const CELL_STATE_CORRECT = 'correct';
const CELL_STATE_PARTIAL_CORRECT = 'partial';
const CELL_STATE_NOT_CORRECT = 'wrong';
const CELL_STATE_EMPTY = 'empty';
const CELL_STATE_FILLED = 'filled';

export type GridCell = {
  id: string;
  key: string;
  state: typeof CELL_STATE_CORRECT | typeof CELL_STATE_PARTIAL_CORRECT | typeof CELL_STATE_NOT_CORRECT | typeof CELL_STATE_EMPTY | typeof CELL_STATE_FILLED;
}

export default function useWordle () {
  const [answer, setAnswer] = useState('')  
  const [guessIndex, setGuessIndex] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const [gridGuessHistory, setGridGuessHistory] = useState<GridCell[][]>([]);
  const [gridCurrentGuess, setGridCurrentGuess] = useState<GridCell[]>([]);
  const [gridGuessesLeft, setGridGuessesLeft] = useState<GridCell[][]>([]);

  const [keyboardKeys, setKeyboardKeys] = useState<Record<string, KeyboardLetter['state']>>(() => {
    const alphabetKeys: Record<string, KeyboardLetter['state']> = {};

    alphabetLetters.forEach((letter) => {
      alphabetKeys[letter] = KEY_STATE_DEFAULT;
    })

    return alphabetKeys;
  });

  const gameOver = useMemo(() => {
    if (guessIndex >= TOTAL_GUESSES) return true;

    if (previousGuesses.includes(answer)) return true;

    return false;
  }, [answer, guessIndex, previousGuesses])

  useEffect(() => {
    console.log({ gameOver, guessIndex });
  }, [gameOver, guessIndex]);

  useEffect(() => {
    const gridRows: GridCell[][] = [];

    for (let i = 0; i < previousGuesses.length; i++) {
      const gridRow: GridCell[] = [];
      const answerCompare = answer.split('');

      // Instantiate all characters as being wrong, we will add correct classes next
      for (let j = 0; j < WORD_LENGTH; j++) {
        gridRow.push({
          id: `guess_history_${i}_letter_${j}`,
          key: previousGuesses[i][j],
          state: CELL_STATE_NOT_CORRECT,
        });
      }

      // Style the characters that are in the word AND in the correct spot
      gridRow.forEach((ltr, idx) => {
        if (answer[idx] === ltr.key) {
          ltr.state = CELL_STATE_CORRECT;
          
          // Modify the answer being compared for cases like duplicate letters in the guess
          //   e.g. if answer=BREAK and guess=KAYAK, only 1 K and 1 A should be styled correctly
          answerCompare.splice(answerCompare.indexOf(ltr.key), 1);
        }
      });

      // Style the charactes that are in the word BUT NOT in the correct spot
      gridRow.forEach((ltr, idx) => {
        if (answerCompare.includes(ltr.key) && gridRow[idx].state != CELL_STATE_CORRECT) {
          gridRow[idx].state = CELL_STATE_PARTIAL_CORRECT;
          answerCompare.splice(answerCompare.indexOf(ltr.key), 1);
        }
      });
      
      setKeyboardKeys((prev) => {
        const newKeys = {...prev};
      
        gridRow.forEach((letter) => {
          switch (letter.state) {
            case CELL_STATE_CORRECT:
              newKeys[letter.key] = KEY_STATE_CORRECT;
              return;

            case CELL_STATE_PARTIAL_CORRECT:
              if (newKeys[letter.key] != KEY_STATE_CORRECT) {
                newKeys[letter.key] = KEY_STATE_PARTIAL;
              }
              return;

            case CELL_STATE_NOT_CORRECT:
              if (newKeys[letter.key] != KEY_STATE_CORRECT && newKeys[letter.key] != KEY_STATE_PARTIAL) {
                newKeys[letter.key] = KEY_STATE_WRONG;
              }
              return;

            // no default
          }  
        })

        return newKeys;
      });
      gridRows.push(gridRow);
    }

    setGridGuessHistory(gridRows);
  }, [answer, previousGuesses])

  useEffect(() => {
    if (currentGuess != null && guessIndex < TOTAL_GUESSES) {
      const gridRow: GridCell[] = []
      for (let i = 0; i < WORD_LENGTH; i++) {
        const gridCell: GridCell = {
          id: `guess_cur_letter_${i}`,
          key: '',
          state: 'empty',
        }

        if (currentGuess[i] != null) {
          gridCell.key = currentGuess[i];
          gridCell.state = 'filled';
        }

        gridRow.push(gridCell);
      }

      setGridCurrentGuess(gridRow);
    } else {
      setGridCurrentGuess(null);
    }
  }, [currentGuess, guessIndex])

  useEffect(() => {
    const gridRows: GridCell[][] = [];

    for (let i = 0; i < TOTAL_GUESSES - previousGuesses.length - 1; i++) {
      const gridRow: GridCell[] = [];

      for (let j = 0; j < WORD_LENGTH; j++) {
        const gridCell: GridCell = {
          id: `guess_rem_${i}_letter_${j}`,
          key: '',
          state: 'empty',
        }
        gridRow.push(gridCell);
      }

      gridRows.push(gridRow);
    }

    setGridGuessesLeft(gridRows);
  }, [previousGuesses])

  const submitGuess = useCallback(() => {
    if (gameOver) {
      // User has used up all guesses
      console.log('GAME OVER');
      return;
    }

    if (previousGuesses.includes(currentGuess)) {
      // Already guessed case
      console.log('ALREADY GUESSED');
      return;
    }

    if (currentGuess.length !== WORD_LENGTH) {
      // not enough chars in guess
      console.log('NOT ENOUGH');
      return;
    }

    if (!wordIsInDictionary(currentGuess)) {
      // Word is invalid
      console.log('INVALID');
      return;
    }

    setGuessIndex(prev => prev + 1); // Increment current row
    setPreviousGuesses(prev => {
      const temp = [...prev]; // Create a copy of the guesses array
      temp[guessIndex] = currentGuess; // Update the current row with the current guess
      return temp; // Return the updated guesses array
    });

    if (guessIndex < TOTAL_GUESSES) {
      setCurrentGuess('');
    } else {
      setCurrentGuess(null);
    }
  }, [gameOver, previousGuesses, currentGuess, guessIndex]);

  const addChar = (char: string) => {
    if (gameOver) return;

    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => {
        return (prev + char.toUpperCase());
      });
    }
  }

  const deleteChar = () => {
    if (gameOver) return;

    setCurrentGuess((prev) => prev.slice(0,-1));
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

  const grid = useMemo(() => {
    const result = [];

    if (gridGuessHistory.length > 0) {
      result.push(...gridGuessHistory);
    }

    if (gridCurrentGuess != null) {
      result.push(gridCurrentGuess);
    }

    if (gridGuessesLeft.length > 0) {
      result.push(...gridGuessesLeft);
    }

    return result
  }, [gridGuessHistory, gridCurrentGuess, gridGuessesLeft])

  useEffect(() => {
    const word = getWord();

    setAnswer(word);
  }, []);

  return { grid, gridGuessHistory, gridCurrentGuess, gridGuessesLeft, answer, guessIndex, keyboardKeys, handleUserInput, gameOver };
}