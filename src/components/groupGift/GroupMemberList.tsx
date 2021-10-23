import './styles.css';

import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    Fade,
    Grid,
    Typography,
} from '@mui/material';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box } from '@mui/system';
import DataError from '../shared/DataError';
import { FC } from 'react';
import { GroupGiftMember } from '../../domain/entities/GroupMember';
import TooltipButton from '../shared/TooltipButton';
import { defaultBgColor } from '../../lib/constants/styles';
import { useGroupGiftContext } from '../../utils/contexts/groupGiftContext';

type GroupMemberListProps = {
    members: GroupGiftMember[];
};

const GroupMemberList: FC<GroupMemberListProps> = ({ members }) => {
    const { onSelectMember } = useGroupGiftContext();
    if (members.length === 0) {
        return (
            <DataError
                message="no members found"
                paperProps={{ elevation: 0 }}
            />
        );
    }

    return (
        <Grid container spacing={2}>
            {members.map(m => {
                const claimedGiftsCount = m.gifts.filter(
                    g => !!g.claimed_by,
                ).length;
                return (
                    <Grid item xs={12} md={6} key={m.user_id}>
                        <Fade in={true}>
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
                                    <Box
                                        component={Avatar}
                                        src={m.user.avatar_url ?? undefined}
                                        sx={{
                                            textAlign: 'center',
                                            alignContent: 'center',
                                            width: 75,
                                            height: 75,
                                            my: 2,
                                            ml: 2,
                                        }}
                                    />
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            my: 0,
                                        }}
                                        className="--without-padding"
                                    >
                                        <Box>
                                            <Typography variant="h6">
                                                {m.user.display_name}
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                color="text.secondary"
                                            >
                                                {m.is_owner ? (
                                                    'owner'
                                                ) : (
                                                    <span>&nbsp;&nbsp;</span>
                                                )}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body1">
                                                {claimedGiftsCount} /{' '}
                                                {m.gifts.length} gift(s) claimed
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions
                                        sx={{ m: 0, p: 0, ml: 'auto' }}
                                    >
                                        <TooltipButton
                                            text="view gifts"
                                            icon={ArrowForwardIosIcon}
                                            onClick={() => onSelectMember(m)}
                                            color="primary"
                                        />
                                    </CardActions>
                                </Box>
                            </Card>
                        </Fade>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default GroupMemberList;
