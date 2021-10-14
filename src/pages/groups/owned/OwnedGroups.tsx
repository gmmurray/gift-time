import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { useCallback, useState } from 'react';

import { Auth } from '@supabase/ui';
import BasicPaperContainer from '../../../components/shared/BasicPaperContainer';
import { Button } from '@mui/material';
import PageTitle from '../../../components/shared/PageTitle';
import { useGetOwnedGroups } from '../../../domain/services/groupService';
import { useNavigate } from 'react-router';

const tableCols: GridColDef[] = [
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
];

const OwnedGroups = () => {
    const { user } = Auth.useUser();
    const { data, isLoading } = useGetOwnedGroups(user?.id);
    const [selected, setSelected] = useState<GridSelectionModel | null>(null);
    const [pageSize, setPageSize] = useState(5);
    const navigate = useNavigate();
    const handleViewClick = useCallback(() => {
        if (selected && selected[0] !== undefined) {
            navigate(`/groups/view/${selected[0]}`);
        }
    }, [navigate, selected]);

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
            <Button
                variant="contained"
                onClick={handleViewClick}
                disabled={!selected || (selected && !selected[0])}
                sx={{ mb: 2 }}
            >
                view group
            </Button>
            <DataGrid
                autoHeight
                rows={tableRows}
                columns={tableCols}
                loading={isLoading}
                pagination
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 20]}
                onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                onSelectionModelChange={data => setSelected(data)}
            />
        </BasicPaperContainer>
    );
};

export default OwnedGroups;
