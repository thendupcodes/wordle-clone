import { GridCell } from "@/hooks/useWordle";

export default function Row ({ rowIdx, cells, isSubmitted = false }: {
  cells: GridCell[],
  isSubmitted?: boolean,
  rowIdx: number,
}) {
  return (
    <div key={`row_${rowIdx}`} className="Wordle__body-grid-row">
      {cells.map(({ id, key, state }, idx) => {
          return (
            <div
              key={id}
              className={`Wordle__body-grid-cell ${
                isSubmitted ? 'Wordle__body-grid-cell--submitted' : ''
              } ${`Wordle__body-grid-cell--${state}`}`}
              style={isSubmitted ? {
                animationDelay: `${idx * 300}ms`
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