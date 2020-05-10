import { format  } from 'date-fns';
import getWeek from 'date-fns/getWeek';

export const getDateHour = (createdAt) => {
    return format(new Date(createdAt), 'yyyy-MM-dd hh:00:00');
};
  
export const getDay = (createdAt) => {
    return format(new Date(createdAt), 'yyyy-MM-dd 00:00:00');
};

export const getWeekNo = (createdAt) => {
    const day = new Date(createdAt);
    var result = getWeek(day);
    return result + '-' + day.getFullYear();
};
  