import './styles.css';

import {
    Card,
    CardActions,
    CardContent,
    Grid,
    Grow,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    getPriorityIcon,
    getPriorityText,
} from '../../lib/constants/priorityTypes';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Auth } from '@supabase/ui';
import { Box } from '@mui/system';
import DataError from '../shared/DataError';
import { FC } from 'react';
import { GiftWithClaim } from '../../domain/entities/Gift';
import TooltipButton from '../shared/TooltipButton';
import { defaultBgColor } from '../../lib/constants/styles';
import { formatCurrency } from '../../utils/helpers/formatCurrency';
import { getStatusText } from '../../lib/constants/statusType';
import { useGroupGiftContext } from '../../utils/contexts/groupGiftContext';

type GiftListProps = {
    gifts: GiftWithClaim[];
    onSelect: (gift_id: number | null) => any;
};

const GiftList: FC<GiftListProps> = ({ gifts, onSelect }) => {
    const { members } = useGroupGiftContext();
    const { user } = Auth.useUser();
    if (gifts.length === 0) {
        return (
            <DataError message="no gifts found" paperProps={{ elevation: 0 }} />
        );
    }

    return (
        <Grid container spacing={2}>
            {gifts.map((g: GiftWithClaim) => {
                const status_id = g.claimed_by?.status_id;
                const claimedByUser = g.claimed_by?.claimed_by;
                const showClaimedByUser =
                    claimedByUser === user?.id ||
                    members.some(m => m.user_id === claimedByUser);
                const byText =
                    showClaimedByUser && claimedByUser !== undefined
                        ? ` by ${
                              claimedByUser === user?.id
                                  ? 'me'
                                  : g.claimed_by?.claimed_by_user.display_name
                          }`
                        : '';

                const statusText =
                    status_id !== undefined
                        ? // @ts-ignore
                          `${getStatusText(status_id)}${byText}`
                        : null;
                return (
                    <Grid item xs={12} md={6} key={g.gift_id}>
                        <Grow in={true}>
                            <Card
                                sx={{ bgcolor: defaultBgColor }}
                                elevation={3}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            my: 0,
                                        }}
                                        className="--without-padding"
                                    >
                                        <Box>
                                            <Grid container>
                                                <Grid item>
                                                    <Typography variant="h6">
                                                        {g.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Tooltip
                                                        title={
                                                            getPriorityText(
                                                                g.priority,
                                                            ) + ' priority'
                                                        }
                                                    >
                                                        {getPriorityIcon(
                                                            g.priority,
                                                        )}
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                            <Typography
                                                variant="subtitle2"
                                                color="text.secondary"
                                            >
                                                {statusText ?? 'available'}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body1">
                                                ${formatCurrency(g.price)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions
                                        sx={{ m: 0, p: 0, ml: 'auto' }}
                                    >
                                        <TooltipButton
                                            text="view"
                                            icon={ArrowForwardIosIcon}
                                            onClick={() => onSelect(g.gift_id)}
                                            color="primary"
                                        />
                                    </CardActions>
                                </Box>
                            </Card>
                        </Grow>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default GiftList;
