export enum PriorityTypeEnum {
    low = 1,
    medium = 2,
    high = 3,
}

export const PriorityType = {
    low: {
        text: 'low',
        value: PriorityTypeEnum.low,
    },
    medium: {
        text: 'medium',
        value: PriorityTypeEnum.medium,
    },
    high: {
        text: 'high',
        value: PriorityTypeEnum.high,
    },
};
