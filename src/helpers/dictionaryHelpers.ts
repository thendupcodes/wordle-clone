import words from '@/dictionary/words.json';

export function getWord(): string {
  return words[50];
}

export function wordIsInDictionary(word: string): boolean {
  return words.includes(word);
}