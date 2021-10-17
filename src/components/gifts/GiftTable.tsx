import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FC, useCallback, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router';

import BasicPaperContainer from '../shared/BasicPaperContainer';
import { Gift } from '../../domain/entities/Gift';
import PageTitle from '../shared/PageTitle';
import { PriorityTypeEnum } from '../../lib/constants/priorityTypes';
import SettingsIcon from '@mui/icons-material/Settings';
import TooltipButton from '../shared/TooltipButton';
import { format } from 'date-fns';

const getTableCols = (navigate: NavigateFunction): GridColDef[] => [
    {
        field: 'name',
        headerName: 'name',
        flex: 1,
    },
    {
        field: 'priority',
        headerName: 'priority',
        flex: 1,
        renderCell: params => {
            const {
                row: { priority },
            } = params;
            return PriorityTypeEnum[priority];
        },
    },
    {
        field: 'created_at',
        headerName: 'created',
        flex: 1,
        renderCell: params => {
            const {
                row: { created_at },
            } = params;
            return format(new Date(created_at), 'yyyy-MM-dd');
        },
    },
    {
        field: 'actions',
        headerName: 'actions',
        flex: 1,
        sortable: false,
        align: 'right',
        headerAlign: 'right',
        renderCell: params => {
            const {
                row: { id },
            } = params;
            const onViewClick = () => navigate(`/gifts/view/${id}`);
            return (
                <TooltipButton
                    text="edit"
                    icon={SettingsIcon}
                    onClick={onViewClick}
                />
            );
        },
    },
];

type GiftTableProps = {
    title: string;
    data: Gift[] | undefined;
    isLoading: boolean;
};

const GiftTable: FC<GiftTableProps> = ({ title, data, isLoading }) => {
    const [pageSize, setPageSize] = useState(5);
    const navigate = useNavigate();

    const getColumnDefinitions = useCallback(
        () => getTableCols(navigate),
        [navigate],
    );

    const tableRows = (data ?? []).map(
        ({ gift_id, name, priority, created_at }) => ({
            id: gift_id,
            name,
            priority,
            created_at,
        }),
    );

    return (
        <BasicPaperContainer>
            <PageTitle>{title}</PageTitle>
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

export default GiftTable;
