import { Button, Tab } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { SyntheticEvent, useCallback, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import BasicPaperContainer from '../../../components/shared/BasicPaperContainer';
import GroupTab from './GroupTab';
import InviteTab from './InviteTab';
import MemberTab from './MemberTab';
import PageTitle from '../../../components/shared/PageTitle';
import { SxProps } from '@mui/system';

const tabPanelStyles: SxProps = { px: 0, pb: 0 };

const ViewGroup = () => {
    const [currentTab, setCurrentTab] = useState('0');
    const { group_id } = useParams();

    const handleTabChange = useCallback(
        (event: SyntheticEvent, newTabValue: string) =>
            setCurrentTab(newTabValue),
        [],
    );

    return (
        <BasicPaperContainer>
            <PageTitle>group details</PageTitle>
            <Button component={Link} to={`/group-gift/${group_id}`}>
                go to page
            </Button>
            <TabContext value={currentTab}>
                <TabList
                    onChange={handleTabChange}
                    scrollButtons="auto"
                    variant="fullWidth"
                    centered
                >
                    <Tab label="update" value="0" />
                    <Tab label="invitations" value="1" />
                    <Tab label="members" value="2" />
                </TabList>
                <TabPanel value="0" sx={tabPanelStyles}>
                    <GroupTab />
                </TabPanel>
                <TabPanel value="1" sx={tabPanelStyles}>
                    <InviteTab />
                </TabPanel>
                <TabPanel value="2" sx={tabPanelStyles}>
                    <MemberTab />
                </TabPanel>
            </TabContext>
        </BasicPaperContainer>
    );
};

export default ViewGroup;
