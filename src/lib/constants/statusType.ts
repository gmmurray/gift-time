import { StatusTypeEnum } from '../types/StatusTypeEnum';

export const StatusType = {
    claimed: {
        text: 'claimed',
        value: StatusTypeEnum.claimed,
    },
    purchased: {
        text: 'purchased',
        value: StatusTypeEnum.purchased,
    },
};

export const getStatusText = (status_id?: number) => {
    if (!status_id) return null;
    const result = Object.keys(StatusType).find(
        // @ts-ignore
        k => StatusType[k].value === status_id,
    );
    // @ts-ignore
    if (result) return StatusType[result].text;
    return null;
};
