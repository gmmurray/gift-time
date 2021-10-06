import '@fontsource/raleway/300.css';
import '@fontsource/raleway/400.css';
import '@fontsource/raleway/500.css';
import '@fontsource/raleway/700.css';

import { CssBaseline, ThemeProvider } from '@mui/material';

import AlertProvider from './utils/providers/AlertProvider';
import App from './App';
import { AppContextProvider } from './utils/providers/AppContextProvider';
import { Auth } from '@supabase/ui';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { StyledEngineProvider } from '@mui/styled-engine';
import { queryClient } from './utils/config/queryClient';
import { supabaseClient } from './utils/config/supabase';
import { theme } from './utils/config/theme';

const AppRoot = () => {
    return (
        <BrowserRouter>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <QueryClientProvider client={queryClient}>
                        <AlertProvider>
                            <Auth.UserContextProvider
                                supabaseClient={supabaseClient}
                            >
                                <AppContextProvider>
                                    <App />
                                </AppContextProvider>
                            </Auth.UserContextProvider>
                        </AlertProvider>
                    </QueryClientProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </BrowserRouter>
    );
};

export default AppRoot;
