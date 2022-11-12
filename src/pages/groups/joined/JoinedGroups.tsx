import { Avatar, Box, FormControlLabel, Switch, Tooltip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { NavigateFunction, useNavigate } from 'react-router';
import { useCallback, useState } from 'react';

import { Auth } from '@supabase/ui';
import BasicPaperContainer from '../../../components/shared/BasicPaperContainer';
import HomeIcon from '@mui/icons-material/Home';
import PageTitle from '../../../components/shared/PageTitle';
import TooltipButton from '../../../components/shared/TooltipButton';
import { useGetJoinedGroups } from '../../../domain/services/groupService';

const getTableCols = (navigate: NavigateFunction): GridColDef[] => [
    {
        field: 'display_name',
        headerName: 'owner',
        renderCell: params => {
            const { avatar_url = '', display_name } = params.row;
            return (
                <Tooltip title={display_name}>
                    <Avatar src={avatar_url === '' ? undefined : avatar_url} />
                </Tooltip>
            );
        },
    },
    {
        field: 'name',
        headerName: 'name',
        flex: 1,
    },
    {
        field: 'due_date',
        headerName: 'date',
        flex: 1,
    },
    {
        field: 'actions',
        headerName: 'actions',
        sortable: false,
        align: 'right',
        headerAlign: 'right',
        renderCell: params => {
            const { id } = params.row;
            const onClick = () => navigate(`/group-gift/${id}`);
            return (
                <TooltipButton
                    text="go to page"
                    icon={HomeIcon}
                    onClick={onClick}
                />
            );
        },
    },
];

const JoinedGroups = () => {
    const { user } = Auth.useUser();
    const [showExpiredGroups, setShowExpiredGroups] = useState(false);
    const { data, isLoading } = useGetJoinedGroups(user?.id, showExpiredGroups);
    const [pageSize, setPageSize] = useState(5);
    const onPageSizeChange = useCallback(
        (newPageSize: number) => setPageSize(newPageSize),
        [],
    );
    const navigate = useNavigate();

    const getColumnDefinitions = useCallback(
        () => getTableCols(navigate),
        [navigate],
    );

    const handleShowExpiredToggle = useCallback(
        () => setShowExpiredGroups(state => !state),
        [],
    );

    const tableRows = (data ?? []).map(g => ({
        id: g.group_id,
        name: g.name,
        due_date: g.due_date,
        display_name: g.user.display_name,
        avatar_url: g.user.avatar_url,
    }));

    return (
        <BasicPaperContainer>
            <PageTitle>joined groups</PageTitle>
            <Box>
                <FormControlLabel
                    label="Show expired"
                    control={
                        <Switch
                            checked={showExpiredGroups}
                            onChange={handleShowExpiredToggle}
                        />
                    }
                />
            </Box>
            <DataGrid
                autoHeight
                rows={tableRows}
                columns={getColumnDefinitions()}
                loading={isLoading}
                pagination
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 20]}
                onPageSizeChange={onPageSizeChange}
                disableSelectionOnClick
            />
        </BasicPaperContainer>
    );
};

export default JoinedGroups;
