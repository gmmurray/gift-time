import { createContext, useContext } from 'react';

import { GroupGiftMember } from '../../domain/entities/GroupMember';

export interface IGroupGiftContext {
    selectedMember: GroupGiftMember | null;
    onSelectMember: (member?: GroupGiftMember) => any;
    members: GroupGiftMember[];
}

const defaultGroupGiftContext: IGroupGiftContext = {
    selectedMember: null,
    onSelectMember: () => {},
    members: [],
};

export const GroupGiftContext = createContext<IGroupGiftContext>(
    defaultGroupGiftContext,
);
export const useGroupGiftContext = () => useContext(GroupGiftContext);
