export enum SpendingRange {
    week = 1,
    month = 2,
    year = 3,
    lifetime = 4,
}

export type UserSpending = {
    range: SpendingRange;
    user_id: string;
    total: number;
    dataPoints: { date: Date; amount: number; name: string }[];
};
