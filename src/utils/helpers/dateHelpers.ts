export const getDateMonthsAgo = (num: number, date: Date) => {
    const result = new Date();
    result.setMonth(date.getMonth() - num);
    return result;
};
