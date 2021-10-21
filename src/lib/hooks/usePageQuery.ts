import { useLocation } from 'react-router';

export const usePageQuery = () => new URLSearchParams(useLocation().search);
