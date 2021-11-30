export const pageTitles: { [key: string]: string } = {
    '/login': 'login',
    '/groups/new': 'new group',
    '/groups/owned': 'owned groups',
    '/groups/joined': 'joined groups',
    '/groups/invited': 'invited groups',
    '/groups/view': 'view group',
    '/gifts/new': 'new gift',
    '/gifts/public': 'public gifts',
    '/gifts/private': 'private gifts',
    '/gifts/view': 'view gift',
    '/gifts/claimed': 'claimed gifts',
    '/group-gift': 'group gift',
    '/home': 'home',
    '*': 'not found',
};

export const getPageTitle = (pathname: string) => {
    const key = Object.keys(pageTitles).find(k => pathname.includes(k));
    if (key) return `gift time - ${pageTitles[key]}`;
    else return 'gift time';
};
