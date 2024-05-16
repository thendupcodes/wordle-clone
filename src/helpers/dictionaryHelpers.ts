import words from '@/dictionary/words.json';

export function getToday() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
	const day = String(today.getDate()).padStart(2, '0');

	// Concatenate year, month, and day, and parse it into a number
	return parseInt(`${year}${month}${day}`, 10);
}

export function getWord(): string {
	const dictionaryLength = words.length;
	const today = getToday();
	const idx = today % dictionaryLength;

	return words[idx];
}

export function wordIsInDictionary(word: string): boolean {
	return words.includes(word);
}
