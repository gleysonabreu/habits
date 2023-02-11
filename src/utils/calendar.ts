import dayjs from 'dayjs';

export function createCalendar() {
  const now = dayjs();
  const endDate = now.startOf('day');
  const startDate = now.subtract(4, 'month').startOf('week');
  let date = startDate;
  const dates: Date[] = [];

  while (date <= endDate) {
    dates.push(date.startOf('day').toDate());
    date = date.add(1, 'day');
  }

  return dates;
}
