import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Fragment, useCallback, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router';

import { Auth } from '@supabase/ui';
import BasicPaperContainer from '../../../components/shared/BasicPaperContainer';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import PageTitle from '../../../components/shared/PageTitle';
import TooltipButton from '../../../components/shared/TooltipButton';
import { useGetOwnedGroups } from '../../../domain/services/groupService';

const getTableCols = (navigate: NavigateFunction): GridColDef[] => [
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
        field: 'memberCount',
        headerName: 'members',
        flex: 1,
        align: 'right',
        headerAlign: 'right',
    },
    {
        field: 'inviteCount',
        headerName: 'invites',
        flex: 1,
        align: 'right',
        headerAlign: 'right',
    },
    {
        field: 'actions',
        headerName: 'actions',
        sortable: false,
        align: 'right',
        headerAlign: 'right',
        renderCell: params => {
            const { id } = params.row;
            const onViewClick = () => navigate(`/groups/view/${id}`);
            const onPageClick = () => navigate(`/group-gift/${id}`);
            return (
                <Fragment>
                    <TooltipButton
                        text="edit group"
                        icon={EditIcon}
                        onClick={onViewClick}
                    />
                    <TooltipButton
                        text="go to page"
                        icon={HomeIcon}
                        onClick={onPageClick}
                    />
                </Fragment>
            );
        },
    },
];

const OwnedGroups = () => {
    const { user } = Auth.useUser();
    const { data, isLoading } = useGetOwnedGroups(user?.id);
    const [pageSize, setPageSize] = useState(5);
    const navigate = useNavigate();

    const getColumnDefinitions = useCallback(
        () => getTableCols(navigate),
        [navigate],
    );

    const tableRows = (data ?? []).map(g => ({
        id: g.group_id,
        name: g.name,
        due_date: g.due_date,
        memberCount: g.members.length,
        inviteCount: g.invitations.length,
    }));

    return (
        <BasicPaperContainer>
            <PageTitle>my groups</PageTitle>
            <DataGrid
                autoHeight
                rows={tableRows}
                columns={getColumnDefinitions()}
                loading={isLoading}
                pagination
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 20]}
                onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                disableSelectionOnClick
            />
        </BasicPaperContainer>
    );
};

export default OwnedGroups;
