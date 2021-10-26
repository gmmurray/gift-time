import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Grid,
    Paper,
    Typography,
} from '@mui/material';

import { Auth } from '@supabase/ui';
import { Box } from '@mui/system';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

const SIXTEEN_BY_NINE_PADDING = '56.25%';

type LandingPageCard = {
    heading: string;
    content: string;
    path: string;
    image: string;
};

const landingPageCards: LandingPageCard[] = [
    {
        heading: 'gifts',
        content:
            'this is your wish list. you can keep track of what you want - whether that is what you want to be given to you, or what you want to get for yourself.',
        path: '/gifts',
        image: '/images/landing-page/gifts.jpg',
    },
    {
        heading: 'groups',
        content:
            "gift-giving holiday coming up? office gift event? random gifts for fun? a group let's people know what others are asking for and pledge to buy if they so choose.",
        path: '/groups/owned',
        image: '/images/landing-page/groups.jpg',
    },
];

const LandingPage = () => {
    const { user } = Auth.useUser();
    const isLoggedIn = !!user;
    return (
        <Fragment>
            <Container>
                <Paper
                    elevation={2}
                    sx={{
                        pt: 6,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography
                            variant="h2"
                            align="center"
                            color="primary"
                            gutterBottom
                        >
                            gift time
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            color="secondary"
                            paragraph
                        >
                            there's nothing better than receiving a great gift.
                            sometimes it is something you've been asking for.
                            other times it is something you didn't know you
                            wanted until you saw it. the hard part, of course,
                            is <i>buying</i> gifts.
                        </Typography>
                        <Box sx={{ mt: 4 }}>
                            <Grid container spacing={2} justifyContent="center">
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to="/login?signup=true"
                                >
                                    get started
                                </Button>
                            </Grid>
                        </Box>
                    </Container>
                </Paper>
                <Grid container spacing={2} sx={{ pt: 2 }}>
                    {landingPageCards.map(
                        ({ image, heading, content, path }, index) => (
                            <Grid item key={index} xs={12} sm={6}>
                                <Card
                                    elevation={2}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <CardMedia
                                        image={image}
                                        title={`${heading} image`}
                                        sx={{
                                            paddingTop: SIXTEEN_BY_NINE_PADDING,
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5">
                                            {heading}
                                        </Typography>
                                        <Typography>{content}</Typography>
                                    </CardContent>
                                    {isLoggedIn && (
                                        <CardActions>
                                            <Button
                                                size="small"
                                                color="secondary"
                                                variant="contained"
                                                component={Link}
                                                to={path}
                                            >
                                                view
                                            </Button>
                                        </CardActions>
                                    )}
                                </Card>
                            </Grid>
                        ),
                    )}
                </Grid>
            </Container>
        </Fragment>
    );
};

export default LandingPage;
