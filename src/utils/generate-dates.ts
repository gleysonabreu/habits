import dayjs from 'dayjs';

export function generateDates() {
  const oneYearAgo = dayjs().subtract(1, 'year').startOf('week');
  const today = new Date();

  const dates = [];
  let compare = oneYearAgo;

  while (compare.isBefore(today)) {
    dates.push(compare.toDate());
    compare = compare.add(1, 'day');
  }

  return dates;
}
