import { createClient } from '@supabase/supabase-js';

const url = 'https://nftqjxcvzkvqcmxpabkb.supabase.co';
const key = 'sb_publishable_BAROP8INA7BkvSzZ1fT1vg_iQh4iKRg';

const supabase = createClient(url, key);

async function test() {
  console.log('Testing Supabase Connection to:', url);
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error('Supabase query error (Tables might not be migrated yet):', error.message);
  } else {
    console.log('Successfully fetched categories from Supabase! Count:', data.length);
  }
}

test();
