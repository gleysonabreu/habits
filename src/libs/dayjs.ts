import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/pt-br';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(weekday);
dayjs.extend(isoWeek);
