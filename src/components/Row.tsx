export default function Row ({ guess, rIdx, mainWord, isSubmitted }: {
  guess: string,
  rIdx: number,
  mainWord: string,
  isSubmitted: boolean,
}) {
  const chars: string[] = [];

  for (let cIdx = 0; cIdx < 5; cIdx++) {
    chars[cIdx] = guess?.[cIdx] || '';
  }

  return (
    <div key={`row_${rIdx}`} className="Wordle__body-grid-row">
      {
        chars.map((char, idx) => {
          let className = 'Wordle__body-grid-cell';
          if (isSubmitted) {
            if (mainWord[idx].toLowerCase() === char.toLowerCase()) {
              className += ' Wordle__body-grid-cell--green';
            } else if (mainWord.toLowerCase().includes(char.toLowerCase())) {
              className += ' Wordle__body-grid-cell--orange';
            }
          }

          if (char != '') {
            className = className + ' Wordle__body-grid-cell--filled'
          }

          return (
            <div key={`row_col_${rIdx}_${idx}`} className={className}>
              {char}
            </div>
          );
        })
      }
    </div>
  );
}