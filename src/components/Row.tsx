const FULL_CORRECT_CLASS = 'Wordle__body-grid-cell--full-correct';
const HALF_CORRECT_CLASS = 'Wordle__body-grid-cell--half-correct';
const NOT_CORRECT_CLASS = 'Wordle__body-grid-cell--not-correct';
const FILLED_CLASS = 'Wordle__body-grid-cell--filled';

export default function Row ({ guess, rowIdx, answer, isSubmitted }: {
  guess: string,
  rowIdx: number,
  answer: string,
  isSubmitted: boolean,
}) {
  const answerCompare = answer.split('');

  const guessChars = Array(5).fill(null).map((_, idx) => {
    const guessChar = guess?.[idx] || '';

    return {
      charKey: guessChar,
      charClass: guessChar != '' ? FILLED_CLASS : '',
    };
  });

  if (isSubmitted) {
    // Instantiate all chars as being wrong, we will add correct classes later
    guessChars.forEach((_, idx) => {
      guessChars[idx].charClass = NOT_CORRECT_CLASS;
    });

    
    // Style the charactes that are in the word AND in the correct spot
    guessChars.forEach((guessChar, idx) => {
      if (answer[idx] === guessChar.charKey) {
        guessChars[idx].charClass = FULL_CORRECT_CLASS;
        
        // Modify the answer being compared for cases like duplicate letters in the guess
        //   e.g. if answer=BREAK and guess=KAYAK, only 1 K and 1 A should be styled correctly
        answerCompare.splice(answerCompare.indexOf(guessChar.charKey), 1);
      }
    });


    // Style the charactes that are in the word BUT NOT in the correct spot
    guessChars.forEach((guessChar, idx) => {
      if (answerCompare.includes(guessChar.charKey) && guessChars[idx].charClass != FULL_CORRECT_CLASS) {
        guessChars[idx].charClass = HALF_CORRECT_CLASS;
        answerCompare.splice(answerCompare.indexOf(guessChar.charKey), 1);
      }
    });
  }
 
  return (
    <div key={`row_${rowIdx}`} className="Wordle__body-grid-row">
      {
        guessChars.map(({ charKey, charClass }, idx) => {
          return (
            <div key={`row_col_${rowIdx}_${idx}`} className={`Wordle__body-grid-cell ${charClass}`}>
              {charKey}
            </div>
          );
        })
      }
    </div>
  );
}