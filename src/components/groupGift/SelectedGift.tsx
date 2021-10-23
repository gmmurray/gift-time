import {
    AppBar,
    Box,
    Button,
    ButtonGroup,
    ClickAwayListener,
    Divider,
    Grow,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Toolbar,
    Typography,
} from '@mui/material';
import { FC, Fragment, useCallback, useEffect, useRef, useState } from 'react';
import {
    createFailureMessage,
    createSuccessMessage,
} from '../../utils/config/snackbar';
import {
    getPriorityIcon,
    getPriorityText,
} from '../../lib/constants/priorityTypes';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Auth } from '@supabase/ui';
import CloseIcon from '@mui/icons-material/Close';
import { GiftWithClaim } from '../../domain/entities/Gift';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import LaunchIcon from '@mui/icons-material/Launch';
import { LoadingButton } from '@mui/lab';
import PaymentIcon from '@mui/icons-material/Payment';
import { StatusTypeEnum } from '../../lib/types/StatusTypeEnum';
import TooltipButton from '../shared/TooltipButton';
import { defaultBgColor } from '../../lib/constants/styles';
import { formatCurrency } from '../../utils/helpers/formatCurrency';
import { getStatusText } from '../../lib/constants/statusType';
import { useGroupGiftContext } from '../../utils/contexts/groupGiftContext';
import { useSnackbar } from 'notistack';
import { useUpdateGiftStatus } from '../../domain/services/claimedGiftService';

const statusButtonOptions = ['claim', 'purchase', 'purchased', 'unclaim'];

type SelectedGiftProps = {
    onDeselect: () => any;
    gift: GiftWithClaim | null;
    currentUserId: string;
};

const SelectedGift: FC<SelectedGiftProps> = ({
    onDeselect,
    gift,
    currentUserId,
}) => {
    const { reloadGroupGift, members } = useGroupGiftContext();
    const [statusButtonOpen, setStatusButtonOpen] = useState(false);
    const [selectedStatusOption, setSelectedStatusOption] = useState(0);
    const statusButtonRef = useRef<HTMLDivElement | null>(null);
    const { enqueueSnackbar } = useSnackbar();
    const { user } = Auth.useUser();

    const giftStatusMutation = useUpdateGiftStatus();

    useEffect(() => {
        if (gift) {
            setSelectedStatusOption(gift.claimed_by?.status_id ?? 0);
        }
    }, [gift]);

    const handleOpenStatusButton = useCallback(
        () => setStatusButtonOpen(state => !state),
        [],
    );

    const handleCloseStatusButton = useCallback((event: Event) => {
        if (
            statusButtonRef.current &&
            statusButtonRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }
        setStatusButtonOpen(false);
    }, []);

    const handleStatusSelect = useCallback((status_id: number) => {
        setStatusButtonOpen(false);
        setSelectedStatusOption(status_id);
    }, []);

    const handleGiftStatusMutation = useCallback(
        (
            input_status_id: StatusTypeEnum | null,
            input_gift_id?: number,
            input_user_id?: string,
        ) =>
            giftStatusMutation.mutate(
                {
                    input_status_id,
                    input_gift_id,
                    input_user_id,
                },
                {
                    onSuccess: async () => {
                        createSuccessMessage(enqueueSnackbar, 'status updated');
                        reloadGroupGift();
                    },
                    onError: async () =>
                        createFailureMessage(
                            enqueueSnackbar,
                            'error updating status',
                        ),
                },
            ),
        [enqueueSnackbar, giftStatusMutation, reloadGroupGift],
    );

    const handleUpdateStatus = useCallback(() => {
        if (!user?.id || !gift) return;
        const currentGiftStatus = gift?.claimed_by?.status_id ?? null;
        let newStatusId;
        switch (selectedStatusOption) {
            case 0:
                newStatusId = StatusTypeEnum.claimed;
                break;
            case 1:
                newStatusId = StatusTypeEnum.purchased;
                break;
            case 3:
                newStatusId = null;
                break;
            default:
                newStatusId = -1;
                break;
        }
        if (newStatusId === -1 || currentGiftStatus === newStatusId) return;

        handleGiftStatusMutation(newStatusId, gift.gift_id, user.id);
    }, [user?.id, gift, selectedStatusOption, handleGiftStatusMutation]);

    if (!gift) return null;
    const canChangeStatus =
        !gift.claimed_by || gift.claimed_by?.claimed_by === currentUserId;

    const statusText = getStatusText(gift.claimed_by?.status_id) ?? 'unclaimed';
    const showClaimedByUser =
        canChangeStatus ||
        members.some(m => m.user_id === gift.claimed_by?.claimed_by);
    const claimedByText =
        statusText !== 'unclaimed' && showClaimedByUser
            ? `${statusText} by ${
                  canChangeStatus
                      ? 'me'
                      : gift.claimed_by?.claimed_by_user.display_name
              }`
            : statusText;

    const isMutating = giftStatusMutation.isLoading;

    return (
        <Grow in={true}>
            <Paper elevation={3} sx={{ bgcolor: defaultBgColor, pb: 2 }}>
                <AppBar position="relative" color="transparent" elevation={0}>
                    <Toolbar>
                        <TooltipButton
                            edge="start"
                            color="primary"
                            text="back"
                            icon={CloseIcon}
                            onClick={onDeselect}
                            sx={{ ml: 'auto' }}
                        />
                    </Toolbar>
                </AppBar>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5">
                        {gift.name}
                        {gift.web_link && gift.web_link.length > 0 && (
                            <IconButton
                                href={gift.web_link}
                                target="_blank"
                                color="secondary"
                            >
                                <LaunchIcon />
                            </IconButton>
                        )}
                    </Typography>
                </Box>
                <List>
                    <ListItem alignItems="flex-start">
                        <ListItemIcon>
                            {getPriorityIcon(gift.priority)}
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2">
                                {getPriorityText(gift.priority) + ' priority'}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    {!!gift.description && gift.description.length > 0 && (
                        <Fragment>
                            <ListItem alignItems="flex-start">
                                <ListItemIcon>
                                    <InfoIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    <Typography variant="body2">
                                        {gift.description}
                                    </Typography>
                                </ListItemText>
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </Fragment>
                    )}
                    <ListItem alignItems="flex-start">
                        <ListItemIcon>
                            <PaymentIcon />
                        </ListItemIcon>
                        <ListItemText>
                            ${formatCurrency(gift.price)}
                        </ListItemText>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem alignItems="flex-start">
                        <ListItemIcon>
                            <GroupIcon />
                        </ListItemIcon>
                        <ListItemText>{claimedByText}</ListItemText>
                    </ListItem>
                </List>
                <Box sx={{ mx: 'auto', textAlign: 'center' }}>
                    <ButtonGroup
                        variant="contained"
                        ref={statusButtonRef}
                        disabled={!canChangeStatus}
                    >
                        <LoadingButton
                            onClick={handleUpdateStatus}
                            disabled={selectedStatusOption === 2}
                            loading={isMutating}
                        >
                            {statusButtonOptions[selectedStatusOption]}
                        </LoadingButton>
                        <Button
                            size="small"
                            onClick={handleOpenStatusButton}
                            disabled={isMutating}
                        >
                            <ArrowDropDownIcon />
                        </Button>
                    </ButtonGroup>
                </Box>
                <Popper
                    open={statusButtonOpen}
                    anchorEl={statusButtonRef.current}
                    role={undefined}
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
                        <Grow {...TransitionProps}>
                            <Paper>
                                <ClickAwayListener
                                    onClickAway={handleCloseStatusButton}
                                >
                                    <MenuList>
                                        {statusButtonOptions.map(
                                            (option, index) =>
                                                index === 2 ? null : (
                                                    <MenuItem
                                                        key={option}
                                                        disabled={
                                                            !canChangeStatus ||
                                                            (index === 3 &&
                                                                !gift.claimed_by)
                                                        }
                                                        selected={
                                                            index ===
                                                            selectedStatusOption
                                                        }
                                                        onClick={() =>
                                                            handleStatusSelect(
                                                                index,
                                                            )
                                                        }
                                                    >
                                                        {option}
                                                    </MenuItem>
                                                ),
                                        )}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </Paper>
        </Grow>
    );
};

export default SelectedGift;
