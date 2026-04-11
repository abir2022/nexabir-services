import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eyzjjtyujyexxxuudlmz.supabase.co';
const supabaseKey = 'sb_publishable_lDLD1qSA6Op6ArrUKoBYuw_uT0DKVdy';

export const supabase = createClient(supabaseUrl, supabaseKey);
