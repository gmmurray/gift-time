import { createClient } from '@supabase/supabase-js';

const url =
    process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_SUPABASE_URL ?? ''
        : process.env.REACT_APP_SUPABASE_URL_DEV ?? '';

const anon_key =
    process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_SUPABASE_ANON_KEY ?? ''
        : process.env.REACT_APP_SUPABASE_ANON_KEY_DEV ?? '';

export const supabaseClient = createClient(url, anon_key);
