export default function Row ({ rowIdx, guess }: {
  guess: Record<string, string>[],
  rowIdx: number,
}) {
  return (
    <div key={`row_${rowIdx}`} className="Wordle__body-grid-row">
      {
        guess.map(({ charKey, charClass }, idx) => {
          return (
            <div key={`row_${rowIdx}_col_${idx}`} className={`Wordle__body-grid-cell ${charClass}`}>
              {charKey}
            </div>
          );
        })
      }
    </div>
  );
}