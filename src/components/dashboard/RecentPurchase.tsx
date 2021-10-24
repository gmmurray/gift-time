import { Grid, GridSize, Typography } from '@mui/material';

import { Auth } from '@supabase/ui';
import DashboardElement from './DashboardElement';
import { FC } from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/helpers/formatCurrency';
import { useGetMostRecentPurchase } from '../../domain/services/claimedGiftService';

type RecentPurchaseProps = {
    size: GridSize;
};

const RecentPurchase: FC<RecentPurchaseProps> = ({ size }) => {
    const { user } = Auth.useUser();
    const { data, isLoading } = useGetMostRecentPurchase(user?.id);

    return (
        <DashboardElement
            row={2}
            title="recent purchase"
            size={size}
            isLoading={isLoading}
            isNoData={!data}
        >
            {data && (
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h6" color="error">
                            ${formatCurrency(data.gift.price)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {data.gift.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            for {data.gift.user.display_name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" color="text.secondary">
                            on {format(new Date(data.created_at), 'yyyy-MM-dd')}
                        </Typography>
                    </Grid>
                </Grid>
            )}
        </DashboardElement>
    );
};

export default RecentPurchase;
