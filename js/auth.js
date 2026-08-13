import { supabase, SITE_URL } from './supabase-client.js';

// Sends a magic link to the given email. Resolves { error } on failure.
export async function sendMagicLink(email) {
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: SITE_URL + 'onboarding.html' }
  });
}

// Redirects to login.html if there's no active session.
// Returns the session if one exists.
export async function requireSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

// True if the signed-in user already has a completed profile row.
export async function hasProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();
  return !error && !!data;
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}
