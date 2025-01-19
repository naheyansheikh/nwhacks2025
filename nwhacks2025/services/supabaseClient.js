import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bvmhgnxztvpxkgpqfdcv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bWhnbnh6dHZweGtncHFmZGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMzYwODUsImV4cCI6MjA1MjgxMjA4NX0.gLiqLRTfs0jcd53kvCtFlheGH8aVifPoknORx2VQoeM';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
