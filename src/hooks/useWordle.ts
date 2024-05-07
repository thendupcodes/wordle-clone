import { getWord, wordIsInDictionary } from "@/helpers/dictionaryHelpers";
import isLetter from "@/helpers/isLetter";
import { useCallback, useEffect, useState } from "react";

export default function useWordle () {
  const [answer, setAnswer] = useState('')
  const [currentGuess, setCurrentGuess] = useState('');
  const [guessHistory, setGuessHistory] = useState<string[]>(Array(6).fill(null))
  const [guessIndex, setGuessIndex] = useState(0);

  const deleteChar = () => {
    setCurrentGuess((prev) => prev.slice(0,-1));
  }

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
    console.log('isLetter: ', isLetter(e.key));

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

  return { answer, currentGuess, guessHistory, guessIndex, handleUserInput };
}