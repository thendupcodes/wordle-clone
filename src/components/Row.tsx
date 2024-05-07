export default function Row ({ rowIdx, isSubmitted, guess }: {
  guess: Record<string, string>[],
  isSubmitted: boolean,
  rowIdx: number,
}) {
  return (
    <div key={`row_${rowIdx}`} className="Wordle__body-grid-row">
      {
        guess.map(({ charKey, charClass }, idx) => {
          return (
            <div
              key={`row_${rowIdx}_col_${idx}`}
              className={`Wordle__body-grid-cell ${
                isSubmitted ? 'Wordle__body-grid-cell--submitted' : ''
              } ${
                charClass != '' ? `Wordle__body-grid-cell--${charClass}` : ''
              }`}
              style={isSubmitted ? {
                animationDelay: `${idx * 300}ms`
              } : null}
            >
              <div className="Wordle__body-grid-cell-letter">{charKey}</div>
            </div>
          );
        })
      }
    </div>
  );
}