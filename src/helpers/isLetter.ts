export default function isLetter(x: string): boolean {
  return x.length === 1 && x.match(/[a-z]/i) != null;
}