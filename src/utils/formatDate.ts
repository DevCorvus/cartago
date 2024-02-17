function padtoTwoDigits(x: number) {
  return x.toString().padStart(2, '0');
}

export function formatDate(date: Date) {
  return [
    padtoTwoDigits(date.getMonth() + 1),
    padtoTwoDigits(date.getDate()),
    date.getFullYear(),
  ].join('/');
}
