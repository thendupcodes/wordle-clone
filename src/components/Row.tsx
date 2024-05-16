import { FLIP_ANIMATION_DUR, GridCell } from '@/hooks/useWordle';
import { useEffect, useState } from 'react';

type RowProps = {
	cells: GridCell[];
	isSubmitted: boolean;
	shakeRow: boolean;
	gameWon: boolean;
	winningRow: number;
	rowIdx: number;
	avoidAnimation: boolean;
};

export default function Row({
	rowIdx,
	cells,
	isSubmitted,
	shakeRow,
	gameWon,
	winningRow,
	avoidAnimation,
}: RowProps) {
	const [bounceRow, setBounceRow] = useState(false);
	const [delay, setDelay] = useState(300);

	useEffect(() => {
		if (gameWon && winningRow === rowIdx) {
			setTimeout(() => {
				setDelay(100);
				setBounceRow(true);
			}, FLIP_ANIMATION_DUR);
		}
	}, [gameWon, rowIdx, winningRow]);

	return (
		<div
			key={`row_${rowIdx}`}
			className={`Wordle__body-grid-row ${
				shakeRow ? 'Wordle__body-grid-row--shake' : ''
			}`}
		>
			{cells.map(({ id, key, state }, idx) => {
				return (
					<div
						key={id}
						className={`Wordle__body-grid-cell ${
							isSubmitted ? 'Wordle__body-grid-cell--submitted' : ''
						} ${
							avoidAnimation ? 'Wordle__body-grid-cell--no-animate' : ''
						} ${`Wordle__body-grid-cell--${state}`} ${
							bounceRow ? 'Wordle__body-grid-cell--bounce' : ''
						}`}
						style={
							isSubmitted
								? {
										animationDelay: `${idx * delay}ms`,
								  }
								: null
						}
					>
						<div className="Wordle__body-grid-cell-letter">{key}</div>
					</div>
				);
			})}
		</div>
	);
}
