import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FC, useState } from 'react';

import BasicPaperContainer from '../shared/BasicPaperContainer';
import { ClaimedGiftWithGift } from '../../domain/entities/ClaimedGift';
import PageTitle from '../shared/PageTitle';
import { PriorityTypeEnum } from '../../lib/constants/priorityTypes';
import { StatusTypeEnum } from '../../lib/types/StatusTypeEnum';
import { formatCurrency } from '../../utils/helpers/formatCurrency';

const getTableCols = (): GridColDef[] => [
    {
        field: 'name',
        headerName: 'name',
        flex: 1,
    },
    {
        field: 'display_name',
        headerName: 'user',
        flex: 1,
    },
    {
        field: 'price',
        headerName: 'price',
        flex: 1,
        renderCell: params => {
            const {
                row: { price },
            } = params;
            return `$${formatCurrency(price)}`;
        },
    },
    {
        field: 'status_id',
        headerName: 'status',
        flex: 1,
        renderCell: params => {
            const {
                row: { status_id },
            } = params;
            return StatusTypeEnum[status_id];
        },
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
];

type ClaimedGiftTableProps = {
    title: string;
    data: ClaimedGiftWithGift[] | undefined;
    isLoading: boolean;
};

const ClaimedGiftTable: FC<ClaimedGiftTableProps> = ({
    title,
    data,
    isLoading,
}) => {
    const [pageSize, setPageSize] = useState(5);
    const tableRows = (data ?? []).map(
        ({
            claimed_gift_id,
            status_id,
            gift: {
                name,
                price,
                priority,
                user: { display_name },
            },
        }) => ({
            id: claimed_gift_id,
            name,
            price,
            priority,
            status_id,
            display_name,
        }),
    );

    return (
        <BasicPaperContainer>
            <PageTitle>{title}</PageTitle>
            <DataGrid
                autoHeight
                rows={tableRows}
                columns={getTableCols()}
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

export default ClaimedGiftTable;
