import {
    Button,
    Container,
    Grid,
    Icon,
    TextField,
    Typography,
} from '@mui/material';
import { Fragment, useCallback, useState } from 'react';
import {
    forgotPasswordSchema,
    signInSchema,
    signupSchema,
} from '../../utils/config/formSchema/auth';
import { useLocation, useNavigate } from 'react-router';

import { LocationStateType } from '../../lib/types/locationState';
import LockIcon from '@mui/icons-material/Lock';
import { styles } from './styles';
import { supabaseClient } from '../../utils/config/supabase';
import { useForm } from 'react-hook-form';
import { usePageQuery } from '../../lib/hooks/usePageQuery';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

const googleLogoPath = '/Google__G__Logo.svg';
type LoginForm = {
    email: string;
    password: string;
    confirmPassword: string;
};

type ForgotPasswordForm = {
    email: string;
};

const Login = () => {
    const location = useLocation();
    const query = usePageQuery();
    let navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const startWithSignUp = query.get('signup') === 'true';

    const [isSignUp, setIsSignUp] = useState(startWithSignUp);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const forgotPasswordValidationSchema = forgotPasswordSchema;
    const loginSignupValidationSchema = isSignUp ? signupSchema : signInSchema;

    const {
        register: registerForgotPassword,
        handleSubmit: handleForgotPasswordFormSubmit,
        formState: { errors: forgotPasswordErrors },
        reset: resetForgotPassword,
    } = useForm({
        resolver: yupResolver(forgotPasswordValidationSchema),
    });

    const {
        register: registerLogin,
        handleSubmit: handleLoginFormSubmit,
        formState: { errors: loginErrors },
        reset: resetLogin,
    } = useForm({
        resolver: yupResolver(loginSignupValidationSchema),
    });

    const handleSignUpToggle = useCallback(
        (e: any) => {
            e.preventDefault();
            setIsSignUp(!isSignUp);
        },
        [isSignUp],
    );

    const handleEmailSignIn = useCallback(
        async ({ email, password }: LoginForm) => {
            await supabaseClient.auth.signIn({ email, password });
            const locationState = location.state as LocationStateType;
            if (locationState?.from) {
                navigate(locationState.from.pathname);
            }
        },
        [location.state, navigate],
    );

    const handleEmailSignUp = useCallback(
        async ({ email, password }: LoginForm) => {
            await supabaseClient.auth.signUp({ email, password });
            enqueueSnackbar('signed up', { variant: 'success' });
            const locationState = location.state as LocationStateType;
            if (locationState?.from) {
                navigate(locationState.from.pathname);
            }
        },
        [enqueueSnackbar, location.state, navigate],
    );

    const handleLoginSubmit = useCallback(
        async (data: LoginForm) => {
            setIsLoading(true);
            if (isSignUp) {
                await handleEmailSignUp(data);
            } else {
                await handleEmailSignIn(data);
            }
            setIsLoading(false);
        },
        [handleEmailSignIn, handleEmailSignUp, isSignUp],
    );

    const handleGoogleClick = useCallback(
        async (e: any) => {
            e.preventDefault();
            setIsLoading(true);
            await supabaseClient.auth.signIn({ provider: 'google' });
            setIsLoading(false);
            const locationState = location.state as LocationStateType;
            if (locationState?.from) {
                navigate(locationState.from.pathname);
            }
        },
        [location.state, navigate],
    );

    const handleForgotPasswordSubmit = useCallback(
        async (data: ForgotPasswordForm) => {
            setIsLoading(true);
            await supabaseClient.auth.api.resetPasswordForEmail(data.email);
            setIsLoading(false);
        },
        [],
    );

    const handleForgotPasswordClick = useCallback(
        (e: any) => {
            e.preventDefault();
            resetForgotPassword();
            resetLogin();
            setIsForgotPassword(!isForgotPassword);
        },
        [isForgotPassword, resetForgotPassword, resetLogin],
    );

    const renderForm = () => {
        if (isForgotPassword) {
            return (
                <Fragment>
                    <Grid item sx={styles.input}>
                        <TextField
                            {...registerForgotPassword('email')}
                            label="email"
                            fullWidth
                            disabled={isLoading}
                            error={!!forgotPasswordErrors.email}
                            helperText={forgotPasswordErrors.email?.message}
                        />
                    </Grid>
                    <Grid item sx={styles.input}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            color="primary"
                            disabled={isLoading}
                        >
                            send recovery email
                        </Button>
                    </Grid>
                    <Grid item sx={styles.input}>
                        <Button
                            variant="text"
                            fullWidth
                            color="primary"
                            disabled={isLoading}
                            onClick={handleForgotPasswordClick}
                        >
                            cancel
                        </Button>
                    </Grid>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <Grid item sx={styles.input}>
                        <TextField
                            label="email"
                            fullWidth
                            autoFocus
                            disabled={isLoading}
                            {...registerLogin('email')}
                            error={!!loginErrors.email}
                            helperText={loginErrors.email?.message}
                        />
                    </Grid>
                    <Grid item sx={styles.input}>
                        <TextField
                            type="password"
                            label="password"
                            fullWidth
                            disabled={isLoading}
                            {...registerLogin('password')}
                            error={!!loginErrors.password}
                            helperText={loginErrors.password?.message}
                        />
                    </Grid>
                    {isSignUp && (
                        <Grid item sx={styles.input}>
                            <TextField
                                type="password"
                                label="confirm password"
                                fullWidth
                                disabled={isLoading}
                                {...registerLogin('confirmPassword')}
                                error={!!loginErrors.confirmPassword}
                                helperText={
                                    loginErrors.confirmPassword?.message
                                }
                            />
                        </Grid>
                    )}
                    <Grid item sx={styles.input}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            color="primary"
                            disabled={isLoading}
                        >
                            {isSignUp ? 'sign up' : 'sign in'}
                        </Button>
                    </Grid>
                    <Grid item sx={styles.input}>
                        <Button
                            onClick={handleGoogleClick}
                            variant="contained"
                            fullWidth
                            disabled={isLoading}
                            startIcon={
                                <Icon sx={styles.iconRoot}>
                                    <img
                                        src={googleLogoPath}
                                        style={{
                                            display: 'flex',
                                            height: 'inherit',
                                            width: 'inherit',
                                        }}
                                        alt="google logo"
                                    />
                                </Icon>
                            }
                        >
                            {isSignUp ? 'sign up' : 'sign in'}
                        </Button>
                    </Grid>
                    <Grid item sx={styles.input}>
                        <Button
                            fullWidth
                            color="primary"
                            disabled={isLoading}
                            onClick={handleSignUpToggle}
                        >
                            {isSignUp
                                ? 'sign in instead'
                                : `don't have an account? sign up`}
                        </Button>
                    </Grid>
                    <Grid item sx={styles.input}>
                        <Button
                            variant="text"
                            fullWidth
                            color="primary"
                            disabled={isLoading}
                            onClick={handleForgotPasswordClick}
                        >
                            forgot your password?
                        </Button>
                    </Grid>
                </Fragment>
            );
        }
    };

    return (
        <Container>
            <form
                onSubmit={
                    isForgotPassword
                        ? handleForgotPasswordFormSubmit(
                              handleForgotPasswordSubmit,
                          )
                        : handleLoginFormSubmit(handleLoginSubmit)
                }
            >
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={styles.container}
                >
                    <Grid item>
                        <LockIcon fontSize="large" color="primary" />
                    </Grid>
                    <Grid item>
                        <Typography variant="h4" color="primary">
                            gift time
                        </Typography>
                    </Grid>
                    {renderForm()}
                </Grid>
            </form>
        </Container>
    );
};

export default Login;
