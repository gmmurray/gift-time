import {
    endOfMonth,
    endOfWeek,
    endOfYear,
    startOfMonth,
    startOfWeek,
    startOfYear,
} from 'date-fns';

import { SpendingRange } from '../../lib/types/UserSpending';

export const getDateRange = (range: SpendingRange) => {
    let start, end;
    const now = new Date();
    switch (range) {
        case SpendingRange.week:
            start = startOfWeek(now);
            end = endOfWeek(now);
            break;
        case SpendingRange.month:
            start = startOfMonth(now);
            end = endOfMonth(now);
            break;
        case SpendingRange.year:
            start = startOfYear(now);
            end = endOfYear(now);
            break;
        default:
            start = new Date(1970);
            end = now;
    }
    return { start, end };
};
