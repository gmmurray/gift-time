import { createContext, useContext } from 'react';

import { GroupGiftMember } from '../../domain/entities/GroupMember';
import { noop } from '../helpers/noop';

export interface IGroupGiftContext {
    selectedMember: GroupGiftMember | null;
    onSelectMember: (member?: GroupGiftMember) => any;
    members: GroupGiftMember[];
    group_Id: number | null;
    reloadGroupGift: () => any;
}

const defaultGroupGiftContext: IGroupGiftContext = {
    selectedMember: null,
    onSelectMember: noop,
    members: [],
    group_Id: null,
    reloadGroupGift: noop,
};

export const GroupGiftContext = createContext<IGroupGiftContext>(
    defaultGroupGiftContext,
);
export const useGroupGiftContext = () => useContext(GroupGiftContext);
