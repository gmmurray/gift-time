import { Connector, Label, Series, Size } from 'devextreme-react/chart';
import DashboardElement, { DashboardElementMenuItem } from './DashboardElement';
import { FC, useState } from 'react';
import { GridSize, useMediaQuery } from '@mui/material';

import { Auth } from '@supabase/ui';
import { PieChart } from 'devextreme-react';
import { SpendingRange } from '../../lib/types/UserSpending';
import { formatCurrency } from '../../utils/helpers/formatCurrency';
import { useGetUserSpending } from '../../domain/services/claimedGiftService';
import { useTheme } from '@mui/system';

const viewTypeNames: { [key: number]: string } = {
    [SpendingRange.week]: 'week',
    [SpendingRange.month]: 'month',
    [SpendingRange.year]: 'year',
    [SpendingRange.lifetime]: 'all time',
};

const customizeText = ({ value }: { value: number }) => `$${value}`;

type SpendingProps = {
    size: GridSize;
};

const Spending: FC<SpendingProps> = ({ size }) => {
    const [spendingRange, setDateRange] = useState(SpendingRange.year);
    const { user } = Auth.useUser();
    const { data, isLoading } = useGetUserSpending(spendingRange, user?.id);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const title = `spending - ${viewTypeNames[spendingRange]}`;
    const isNoData = !data;

    const menuItems: DashboardElementMenuItem[] = [
        {
            text: 'week',
            onClick: () => setDateRange(SpendingRange.week),
            selected: spendingRange === SpendingRange.week,
        },
        {
            text: 'month',
            onClick: () => setDateRange(SpendingRange.month),
            selected: spendingRange === SpendingRange.month,
        },
        {
            text: 'year',
            onClick: () => setDateRange(SpendingRange.year),
            selected: spendingRange === SpendingRange.year,
        },
        {
            text: 'all time',
            onClick: () => setDateRange(SpendingRange.lifetime),
            selected: spendingRange === SpendingRange.lifetime,
        },
    ];

    return (
        <DashboardElement
            row={2}
            title={title}
            size={size}
            isLoading={isLoading}
            isNoData={isNoData}
            menuItems={menuItems}
        >
            {/* @ts-ignore */}
            <PieChart
                dataSource={data?.dataPoints}
                palette="Pastel"
                title={`$${formatCurrency(data?.total ?? 0)} total`}
                legend={{ visible: !isMobile }}
            >
                {/* @ts-ignore */}
                <Series argumentField="name" valueField="amount">
                    {/* @ts-ignore */}
                    <Label visible={true} customizeText={customizeText}>
                        {/* @ts-ignore */}
                        <Connector visible={true} width={1} />
                    </Label>
                </Series>
                {/* @ts-ignore */}
                <Size height={175} />
            </PieChart>
        </DashboardElement>
    );
};

export default Spending;
