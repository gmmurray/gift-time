import { FC, Fragment, useCallback, useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import ResponsiveDialog from '../shared/ResponsiveDialog';
import parseHtml from 'html-react-parser';
import { useAppContext } from '../../utils/contexts/appContext';
import { useGetActiveVersion } from '../../domain/services/versionService';
import { usePatchUserProfile } from '../../domain/services/userProfileService';

const VersionNoticeWrapper: FC = ({ children }) => {
    const { user: { profile } = { profile: null } } = useAppContext() || {};

    const [showMessage, setShowMessage] = useState(false);

    const { data, isLoading } = useGetActiveVersion();
    const mutateUserProfileQuery = usePatchUserProfile();

    const handleVersionUpdate = useCallback(() => {
        if (!isLoading && profile && data) {
            return mutateUserProfileQuery.mutate({
                user_id: profile.user_id,
                userProfile: { version_id: data.version_id },
            });
        }
    }, [data, isLoading, mutateUserProfileQuery, profile]);

    useEffect(() => {
        if (profile && data) {
            if (profile.version_id !== data.version_id) {
                setShowMessage(true);
            } else {
                setShowMessage(false);
            }
        }
    }, [profile, data]);

    const renderDialogContent = () => {
        return data ? parseHtml(data.description) : null;
    };

    return (
        <Fragment>
            {children}
            <ResponsiveDialog open={showMessage} onClose={handleVersionUpdate}>
                <div>{renderDialogContent()}</div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleVersionUpdate}
                    >
                        nice!
                    </Button>
                </div>
            </ResponsiveDialog>
        </Fragment>
    );
};

export default VersionNoticeWrapper;
