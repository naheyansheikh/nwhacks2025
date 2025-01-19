import { supabase } from './supabaseClient';

export const signUp = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return user;
};

export const signIn = async (email, password) => {
  const { user, error } = await supabase.auth.signIn({ email, password });
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
