import FlagIcon from '@mui/icons-material/Flag';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

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

export const getPriorityText = (priority: number) => {
    const result = Object.keys(PriorityType).find(
        // @ts-ignore
        k => PriorityType[k].value === priority,
    );
    // @ts-ignore
    if (result) return PriorityType[result].text;
    return null;
};

export const getPriorityIcon = (priority: number) => {
    switch (priority) {
        case 2:
            return <FlagIcon color="warning" />;
        case 3:
            return <PriorityHighIcon color="error" />;
        case 1:
        default:
            return <FlagIcon color="success" />;
    }
};
