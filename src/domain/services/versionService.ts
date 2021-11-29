import { Version, VersionsTable } from '../entities/Version';

import { defaultQueryCacheTime } from '../../lib/constants/defaultQueryCacheTime';
import { supabaseClient } from '../../utils/config/supabase';
import { useQuery } from 'react-query';

export const versionQueryKeys = {
    all: [VersionsTable] as const,
    lists: () => [...versionQueryKeys.all, 'list'] as const,
    list: (...args: any[]) =>
        [...versionQueryKeys.lists(), { ...args }] as const,
    active: ['active'],
};

const getActiveVersion = async () => {
    const { data, error } = await supabaseClient
        .from<Version>(VersionsTable)
        .select()
        .match({ is_active: true })
        .single();

    if (error) throw error.message;

    return data;
};

export const useGetActiveVersion = () =>
    useQuery(versionQueryKeys.active, () => getActiveVersion(), {
        staleTime: defaultQueryCacheTime,
        retry: 0,
    });
