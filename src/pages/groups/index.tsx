import ResponsiveSideTabPage, {
    TabPageListItem,
} from '../../components/shared/ResponsiveSideTabPage';

import Add from '@mui/icons-material/Add';
import GroupAdd from '@mui/icons-material/GroupAdd';
import People from '@mui/icons-material/People';
import PeopleOutline from '@mui/icons-material/PeopleOutline';

const getGroupRoute = (fullRoute: string) => {
    return fullRoute.replace('/groups/', '');
};

const listItems: TabPageListItem[] = [
    {
        name: 'new group',
        mobileName: 'new',
        path: 'new',
        icon: <Add />,
    },
    {
        name: 'my groups',
        mobileName: 'owned',
        path: 'owned',
        icon: <People />,
    },
    {
        name: 'joined groups',
        mobileName: 'joined',
        path: 'joined',
        icon: <PeopleOutline />,
    },
    {
        name: 'invitations',
        mobileName: 'invited',
        path: 'invited',
        icon: <GroupAdd />,
    },
];

const Groups = () => (
    <ResponsiveSideTabPage listItems={listItems} getTabRoute={getGroupRoute} />
);

export default Groups;
