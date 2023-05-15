import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import weekday from 'dayjs/plugin/weekday';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.locale('pt-br');
dayjs.extend(relativeTime);
dayjs.extend(weekday);

