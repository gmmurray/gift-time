import ResponsiveSideTabPage, {
    TabPageListItem,
} from '../../components/shared/ResponsiveSideTabPage';

import Add from '@mui/icons-material/Add';
import PublicIcon from '@mui/icons-material/Public';
import SellIcon from '@mui/icons-material/Sell';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const getGiftRoute = (fullRoute: string) => {
    return fullRoute.replace('/gifts/', '');
};

const listItems: TabPageListItem[] = [
    {
        name: 'new gift',
        mobileName: 'new',
        path: 'new',
        icon: <Add />,
    },
    {
        name: 'public gifts',
        mobileName: 'public',
        path: 'public',
        icon: <PublicIcon />,
    },
    {
        name: 'private gifts',
        mobileName: 'private',
        path: 'private',
        icon: <VisibilityOffIcon />,
    },
    {
        name: 'claimed gifts',
        mobileName: 'claimed',
        path: 'claimed',
        icon: <SellIcon />,
    },
];

const Gifts = () => (
    <ResponsiveSideTabPage listItems={listItems} getTabRoute={getGiftRoute} />
);

export default Gifts;
