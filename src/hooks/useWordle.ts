import { useEffect, useMemo, useState } from 'react';

import {
	getToday,
	getTodaysAnswer,
	wordIsInDictionary,
} from '@/helpers/dictionaryHelpers';
import isLetter from '@/helpers/isLetter';

import { useToaster } from '@/components/ToastContext';
import alphabetLetters from '@/dictionary/alphabets.json';
import useLocalStorage from './useLocalStorage';

const TOTAL_GUESSES = 6;
const WORD_LENGTH = 5;

export const FLIP_ANIMATION_DUR = 1900; // flip animation=700ms + delay=1200ms

const KEY_STATE_DEFAULT = 'default';
const KEY_STATE_CORRECT = 'correct';
const KEY_STATE_PARTIAL = 'partial';
const KEY_STATE_WRONG = 'wrong';

const winPhrases = [
	'You are a genius!',
	'Woah, amazing!',
	'Well played, GG!',
	'Not too shabby!',
	'Good run!',
	'Well, that was close!',
];

export type KeyboardLetter = {
	id: string;
	key: string;
	state:
		| typeof KEY_STATE_DEFAULT
		| typeof KEY_STATE_CORRECT
		| typeof KEY_STATE_PARTIAL
		| typeof KEY_STATE_WRONG;
};

const CELL_STATE_CORRECT = 'correct';
const CELL_STATE_PARTIAL_CORRECT = 'partial';
const CELL_STATE_NOT_CORRECT = 'wrong';
const CELL_STATE_EMPTY = 'empty';
const CELL_STATE_FILLED = 'filled';

export type GridCell = {
	id: string;
	key: string;
	state:
		| typeof CELL_STATE_CORRECT
		| typeof CELL_STATE_PARTIAL_CORRECT
		| typeof CELL_STATE_NOT_CORRECT
		| typeof CELL_STATE_EMPTY
		| typeof CELL_STATE_FILLED;
};

export default function useWordle() {
	const { openToast } = useToaster();
	const gameLocalStorage = useLocalStorage({ key: 'tt-wordle-game-state' });
	const statsLocalStorage = useLocalStorage({ key: 'tt-wordle-statistics' });

	const [today, setToday] = useState(null);
	const [answer, setAnswer] = useState('');
	const [gameOverOnLoad, setGameOverOnLoad] = useState(false);
	const [currentGuess, setCurrentGuess] = useState('');
	const [guessIndex, setGuessIndex] = useState(0);
	const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
	const [isRevealing, setIsRevealing] = useState(false);
	const [avoidAnimationIdx, setAvoidAnimationIdx] = useState(-1);
	const [gridGuessHistory, setGridGuessHistory] = useState<GridCell[][]>([]);
	const [gridCurrentGuess, setGridCurrentGuess] = useState<GridCell[]>([]);
	const [gridGuessesLeft, setGridGuessesLeft] = useState<GridCell[][]>([]);
	const [shakeRow, setShakeRow] = useState(false);
	const [userStats, setUserStats] = useState(null);
	const [isStatsModalOpen, setisStatsModalOpen] = useState(false);

	const [keyboardKeys, setKeyboardKeys] = useState<
		Record<string, KeyboardLetter['state']>
	>(() => {
		const alphabetKeys: Record<string, KeyboardLetter['state']> = {};

		alphabetLetters.forEach((letter) => {
			alphabetKeys[letter] = KEY_STATE_DEFAULT;
		});

		return alphabetKeys;
	});

	const [gameOver, gameWon, winningRow] = useMemo(() => {
		const outOfTurns = guessIndex >= TOTAL_GUESSES;
		const correctAnswer = previousGuesses.includes(answer);
		const correctRow = correctAnswer ? guessIndex - 1 : null;

		return [outOfTurns || correctAnswer, correctAnswer, correctRow];
	}, [answer, guessIndex, previousGuesses]);

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

		return result;
	}, [gridGuessHistory, gridCurrentGuess, gridGuessesLeft]);

	const updateStats = (winState = true) => {
		const currentStatsLS = statsLocalStorage.getItem();
		const currentStats =
			currentStatsLS == null ? {} : JSON.parse(currentStatsLS);

		const newStats = {
			games: currentStats.games != null ? currentStats.games : 0,
			wins: currentStats.wins != null ? currentStats.wins : 0,
			guesses: currentStats.guesses != null ? currentStats.guesses : 0,
			guessDistribution:
				currentStats.guessDistribution != null
					? currentStats.guessDistribution
					: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
		};

		newStats.games += 1;
		
		if (winState) {
			newStats.wins = gameWon ? newStats.wins + 1 : newStats.wins;
			newStats.guesses += guessIndex;
			newStats.guessDistribution[guessIndex] += 1;
		}
		

		setUserStats(newStats);

		statsLocalStorage.setItem(JSON.stringify(newStats));
	};

	const updateGameState = () => {
		const storageItems = {
			lsDate: today,
			lsCurrentGuess: currentGuess,
			lsPreviousGuesses: previousGuesses,
			lsGuessIndex: guessIndex,
			lsGameOver: gameOver,
		};

		if (guessIndex < TOTAL_GUESSES) {
			storageItems.lsCurrentGuess = '';
			if (!gameOver) {
				storageItems.lsGuessIndex += 1; // only bump the index in LS if the user has yet to finish the game
				storageItems.lsPreviousGuesses = [
					...storageItems.lsPreviousGuesses,
					currentGuess,
				];
			}
		} else {
			storageItems.lsGameOver = true;
			storageItems.lsCurrentGuess = null;
		}

		gameLocalStorage.setItem(JSON.stringify(storageItems));
	}

	const openStatsModal = () => {
		setisStatsModalOpen(true);
	};

	const closeStatsModal = () => {
		setisStatsModalOpen(false);
	};

	const animateRow = () => {
		setShakeRow(true);

		setTimeout(() => {
			setShakeRow(false);
		}, 700);
	};

	const submitGuess = () => {
		if (gameOver) {
			// User has used up all guesses
			return;
		}

		if (previousGuesses.includes(currentGuess)) {
			// Already guessed case
			openToast('Already guessed word');
			animateRow();
			return;
		}

		if (currentGuess.length !== WORD_LENGTH) {
			// not enough chars in guess
			openToast('Not enough letters');
			animateRow();
			return;
		}

		if (!wordIsInDictionary(currentGuess)) {
			// Word is invalid
			openToast('Not word in list');
			animateRow();
			return;
		}

		// The guess is valid so we can reveal whether it is correct or not and move to the next guess
		setIsRevealing(true);

		setPreviousGuesses((prev) => [...prev, currentGuess]); // Create a copy of the guesses array and update with the current guess
		if (guessIndex < TOTAL_GUESSES) {
			setCurrentGuess('');
			setGuessIndex((prev) => prev + 1); // Increment current row
		} else {
			setCurrentGuess(null);
		}

		updateGameState();

		setTimeout(() => {
			setIsRevealing(false);
		}, FLIP_ANIMATION_DUR);
	};

	const addChar = (char: string) => {
		if (gameOver) return;

		if (currentGuess.length < WORD_LENGTH) {
			setCurrentGuess((prev) => {
				const newGuess = prev + char.toUpperCase();
				gameLocalStorage.setItem(
					JSON.stringify({
						lsDate: today,
						lsCurrentGuess: newGuess,
						lsPreviousGuesses: previousGuesses,
						lsGuessIndex: guessIndex,
						lsGameOver: gameOver,
					})
				);

				return newGuess;
			});
		}
	};

	const deleteChar = () => {
		if (gameOver) return;

		setCurrentGuess((prev) => {
			const newGuess = prev.slice(0, -1);
			gameLocalStorage.setItem(
				JSON.stringify({
					lsDate: today,
					lsCurrentGuess: newGuess,
					lsPreviousGuesses: previousGuesses,
					lsGuessIndex: guessIndex,
					lsGameOver: gameOver,
				})
			);

			return newGuess;
		});
	};

	const handleUserInput = (e: KeyboardEvent) => {
		if (isRevealing) return;

		if (isLetter(e.key)) {
			return addChar(e.key);
		} else if (e.key === 'Backspace') {
			return deleteChar();
		} else if (e.key === 'Enter') {
			return submitGuess();
		}
	};

	useEffect(() => {
		if (gameOver && gameOverOnLoad != null && !gameOverOnLoad) {
			updateGameState();
		}
	}, [gameOver]);

	useEffect(() => {
		// Hook for determining whether to show the stats modal (on game win or page load)
		if (gameOver) {
			if (gameOverOnLoad != null && !gameOverOnLoad) {
				// Update the stats if the user has played out the game (game didnt end on load)
				updateStats(gameWon);
			} else if (gameWon != null && !gameWon) {
				setTimeout(() => {
					openToast(answer, 3000);
				}, 1000);
			}
	
			setTimeout(() => {
				if (gameOverOnLoad != null && !gameOverOnLoad) {
					openToast(gameWon ? winPhrases[guessIndex - 1] : answer , 3000);
					setTimeout(() => {
						openStatsModal();
					}, 2000);
				} else {
					if (gameWon) {
						setTimeout(() => {
							openStatsModal();
						}, 1000);
					}
				}
			}, FLIP_ANIMATION_DUR);
		}
	}, [gameWon, gameOver, gameOverOnLoad, guessIndex]);

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
				if (
					answerCompare.includes(ltr.key) &&
					gridRow[idx].state != CELL_STATE_CORRECT
				) {
					gridRow[idx].state = CELL_STATE_PARTIAL_CORRECT;
					answerCompare.splice(answerCompare.indexOf(ltr.key), 1);
				}
			});

			setTimeout(() => {
				setKeyboardKeys((prev) => {
					const newKeys = { ...prev };

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
								if (
									newKeys[letter.key] != KEY_STATE_CORRECT &&
									newKeys[letter.key] != KEY_STATE_PARTIAL
								) {
									newKeys[letter.key] = KEY_STATE_WRONG;
								}
								return;

							// no default
						}
					});

					return newKeys;
				});
			}, FLIP_ANIMATION_DUR);
			gridRows.push(gridRow);
		}

		setGridGuessHistory(gridRows);
	}, [answer, previousGuesses]);

	useEffect(() => {
		if (currentGuess != null && guessIndex < TOTAL_GUESSES) {
			const gridRow: GridCell[] = [];
			for (let i = 0; i < WORD_LENGTH; i++) {
				const gridCell: GridCell = {
					id: `guess_cur_letter_${i}`,
					key: '',
					state: 'empty',
				};

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
	}, [currentGuess, guessIndex]);

	useEffect(() => {
		const gridRows: GridCell[][] = [];

		for (let i = 0; i < TOTAL_GUESSES - previousGuesses.length - 1; i++) {
			const gridRow: GridCell[] = [];

			for (let j = 0; j < WORD_LENGTH; j++) {
				const gridCell: GridCell = {
					id: `guess_rem_${i}_letter_${j}`,
					key: '',
					state: 'empty',
				};
				gridRow.push(gridCell);
			}

			gridRows.push(gridRow);
		}

		setGridGuessesLeft(gridRows);
	}, [previousGuesses]);

	useEffect(() => {
		const todaysAnswer = getTodaysAnswer();
		const todayNum = getToday();
		const storageDetails = gameLocalStorage.getItem();
		const currentStatsLS = statsLocalStorage.getItem();

		setToday(todayNum);
		if (currentStatsLS != null) {
			setUserStats(JSON.parse(currentStatsLS));
		}

		if (storageDetails != null) {
			const { lsDate, lsCurrentGuess, lsPreviousGuesses, lsGuessIndex, lsGameOver } = JSON.parse(storageDetails);

			const alreadyWon = lsPreviousGuesses.includes(todaysAnswer);

			if (lsDate == null || lsDate != todayNum) {
				gameLocalStorage.deleteItem();
			} else {
				setCurrentGuess(lsCurrentGuess);
				setGuessIndex(lsGuessIndex);
				setPreviousGuesses(lsPreviousGuesses);
				setGameOverOnLoad(lsGameOver);
				setAvoidAnimationIdx(alreadyWon ? 0 : lsGuessIndex - 1);
			}
		}

		setAnswer(todaysAnswer);
	}, []);

	return {
		answer,
		guessIndex,
		grid,
		keyboardKeys,
		shakeRow,
		gameOver,
		gameWon,
		previousGuesses,
		winningRow,
		avoidAnimationIdx,
		userStats,
		isStatsModalOpen,
		openStatsModal,
		closeStatsModal,
		submitGuess,
		addChar,
		deleteChar,
		handleUserInput,
	};
}
