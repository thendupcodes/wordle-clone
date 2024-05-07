import { useCallback, useEffect, useState } from "react";

import { getWord, wordIsInDictionary } from "@/helpers/dictionaryHelpers";
import isLetter from "@/helpers/isLetter";

import alphabetLetters from '@/dictionary/alphabets.json';

const TOTAL_GUESSES = 6;
const WORD_LENGTH = 5;

export type KeyboardLetter = {
  id: string;
  key: string;
  color: 'default' | 'correct' | 'partial' | 'wrong';
}

const STATE_CORRECT = 'correct';
const STATE_PARTIAL_CORRECT = 'partial';
const STATE_NOT_CORRECT = 'wrong';
const STATE_EMPTY = 'empty';
const STATE_FILLED = 'filled';

export type GridCell = {
  id: string;
  key: string;
  state: typeof STATE_CORRECT | typeof STATE_PARTIAL_CORRECT | typeof STATE_NOT_CORRECT | typeof STATE_EMPTY | typeof STATE_FILLED;
}

export default function useWordle () {
  const [answer, setAnswer] = useState('')  
  const [guessIndex, setGuessIndex] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const [guessesLeft, setGuessesLeft] = useState(TOTAL_GUESSES - 1);
  const [gridGuessHistory, setGridGuessHistory] = useState<GridCell[][]>([]);
  const [gridCurrentGuess, setGridCurrentGuess] = useState<GridCell[]>([]);
  const [gridGuessesLeft, setGridGuessesLeft] = useState<GridCell[][]>([]);

  const [usedKeys, setUsedKeys] = useState(alphabetLetters.map((letter) => {
    return {
      key: letter,
      color: 'default',
    }
  }));

  useEffect(() => {
    const gridRows: GridCell[][] = [];
    for (let i = 0; i < previousGuesses.length; i++) {
      const gridRow: GridCell[] = [];
      const answerCompare = answer.split('');

      // Instantiate all chars as being wrong, we will add correct classes later
      for (let j = 0; j < WORD_LENGTH; j++) {
        gridRow.push({
          id: `guess_history_${i}_letter_${j}`,
          key: previousGuesses[i][j],
          state: STATE_NOT_CORRECT,
        });
      }      
      // Style the charactes that are in the word AND in the correct spot
      gridRow.forEach((ltr, idx) => {
        if (answer[idx] === ltr.key) {
          ltr.state = STATE_CORRECT;
          
          // Modify the answer being compared for cases like duplicate letters in the guess
          //   e.g. if answer=BREAK and guess=KAYAK, only 1 K and 1 A should be styled correctly
          answerCompare.splice(answerCompare.indexOf(ltr.key), 1);
        }
      });

      // Style the charactes that are in the word BUT NOT in the correct spot
      gridRow.forEach((ltr, idx) => {
        if (answerCompare.includes(ltr.key) && gridRow[idx].state != STATE_CORRECT) {
          gridRow[idx].state = STATE_PARTIAL_CORRECT;
          answerCompare.splice(answerCompare.indexOf(ltr.key), 1);
        }
      });

      gridRows.push(gridRow);
    }

    setGridGuessHistory(gridRows);
  }, [answer, previousGuesses])

  useEffect(() => {
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
  }, [currentGuess])

  useEffect(() => {
    const gridRows: GridCell[][] = [];
    for (let i = 0; i < guessesLeft; i++) {
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
  }, [guessesLeft])

  const submitGuess = useCallback(() => {
    if (guessIndex >= TOTAL_GUESSES) {
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
    setGuessesLeft(prev => prev - 1);
    setCurrentGuess('');
  }, [guessIndex, previousGuesses, currentGuess]);

  const addChar = (char: string) => {
    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => {
        return (prev + char.toUpperCase());
      });
    }
  }

  const deleteChar = () => {
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

  useEffect(() => {
    const word = getWord();

    setAnswer(word);
  }, []);

  return { gridGuessHistory, gridCurrentGuess, gridGuessesLeft, answer, guessIndex, usedKeys, handleUserInput };
}