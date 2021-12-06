import { AppContext, IAppContext } from '../contexts/appContext';
import { FC, useEffect, useState } from 'react';
import {
    useGetCurrentUserProfile,
    userProfileQueryKeys,
} from '../../domain/services/userProfileService';
import { useLocation, useNavigate } from 'react-router';

import { Auth } from '@supabase/ui';
import { groupInviteQueryKeys } from '../../domain/services/groupInviteService';
import { queryClient } from '../config/queryClient';
import { supabaseClient } from '../config/supabase';

const DEFAULT_USER_STATE = { profile: null, loading: true };

export const AppContextProvider: FC = ({ children }) => {
    const [appState, setAppState] = useState<IAppContext | null>({
        user: { ...DEFAULT_USER_STATE },
    });
    const [recoveryToken, setRecoveryToken] = useState<string | null>(null);

    const { user } = Auth.useUser();
    const { hash } = useLocation();
    const navigate = useNavigate();

    const { data, isLoading } = useGetCurrentUserProfile(user?.id);

    useEffect(() => {
        setAppState(state => ({
            ...state,
            user: { profile: data ?? null, loading: isLoading },
        }));
        if (data) queryClient.invalidateQueries(groupInviteQueryKeys.lists());
    }, [data, isLoading]);

    useEffect(() => {
        queryClient.invalidateQueries(userProfileQueryKeys.details());
    }, [user]);

    useEffect(() => {
        if (hash !== '') {
            const query = new URLSearchParams(hash.substring(1));
            const isRecovery = query.get('type') === 'recovery';

            if (isRecovery) {
                setRecoveryToken(query.get('access_token') ?? null);
            }
        }
    }, [hash, navigate]);

    useEffect(() => {
        const { data: listener } = supabaseClient.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_OUT') {
                    setAppState(state => ({
                        ...state,
                        user: { profile: null, loading: false },
                    }));
                } else if (event === 'PASSWORD_RECOVERY') {
                    await supabaseClient.auth.signOut();
                    navigate(
                        `/login?access_token=${recoveryToken}&type=recovery`,
                    );
                }
            },
        );

        return () => {
            listener?.unsubscribe();
        };
    }, [navigate, recoveryToken]);

    return (
        <AppContext.Provider value={appState}>{children}</AppContext.Provider>
    );
};
