import { GridCell } from "@/hooks/useWordle";
import { useEffect, useState } from "react";

export default function Row ({ rowIdx, cells, isSubmitted, shakeRow, gameWon, winningRow }: {
  cells: GridCell[],
  isSubmitted: boolean,
  shakeRow: boolean,
  gameWon: boolean,
  winningRow: number,
  rowIdx: number,
}) {
  const [bounceRow, setBounceRow] = useState(false);
  const [delay, setDelay] = useState(300);

  useEffect(() => {
    if (gameWon && winningRow === rowIdx) {
      setTimeout(() => {
        setDelay(100);
        setBounceRow(true)
      }, 1900); // flip animation=700ms + delay=1200ms
    }
  }, [gameWon, rowIdx, winningRow])

  return (
    <div key={`row_${rowIdx}`} className={`Wordle__body-grid-row ${shakeRow ? 'Wordle__body-grid-row--shake' : ''}`}>
      {cells.map(({ id, key, state }, idx) => {
          return (
            <div
              key={id}
              className={`Wordle__body-grid-cell ${
                isSubmitted ? 'Wordle__body-grid-cell--submitted' : ''
              } ${`Wordle__body-grid-cell--${state}`} ${
                bounceRow ? 'Wordle__body-grid-cell--bounce' : ''
              }`}
              style={isSubmitted ? {
                animationDelay: `${idx * delay}ms`
              } : null}
            >
              <div className="Wordle__body-grid-cell-letter">{key}</div>
            </div>
          );
        })
      }
    </div>
  );
}