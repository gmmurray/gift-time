import { ChangeEvent } from 'react';

export const transformStringOutputToBoolean = (
    e: ChangeEvent<HTMLInputElement>,
) => {
    switch (e.target.value) {
        case 'true':
            return true;
        case 'false':
            return false;
        case 'null':
            return null;
    }
};

export const transformBooleanInputToString = (value: true | false | null) => {
    if (value === true) {
        return 'true';
    } else if (value === false) {
        return 'false';
    } else if (value === null) {
        return 'null';
    }
};
