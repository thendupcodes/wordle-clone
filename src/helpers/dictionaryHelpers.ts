import dictionary from '@/dictionary/dictionary.json';
import techWords from '@/dictionary/techWords.json';

export function getToday() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
	const day = String(today.getDate()).padStart(2, '0');

	// Concatenate year, month, and day, and parse it into a number
	return parseInt(`${year}${month}${day}`, 10);
}

export function getTodaysAnswer(): string {
	const dictionaryLength = techWords.length;
	const today = getToday();
	const idx = today % dictionaryLength;

	return techWords[idx];
}

export function wordIsInDictionary(word: string): boolean {
	return dictionary.includes(word);
}
