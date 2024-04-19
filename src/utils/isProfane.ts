import Filter from 'bad-words';

export function isProfane(text: string): boolean {
  const filter = new Filter();
  return filter.isProfane(text);
}
