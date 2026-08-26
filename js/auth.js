import { supabase, SITE_URL } from './supabase-client.js';

// Sends a magic link to the given email. Resolves { error } on failure.
// `lang` is baked into the redirect URL so the language survives even if
// the link is opened in a different browser/app than the one that sent it
// (very common with email clients) — localStorage doesn't carry across
// that boundary, but a URL query param does.
export async function sendMagicLink(email, lang) {
  const redirectTo = SITE_URL + 'onboarding.html' + (lang ? `?lang=${lang}` : '');
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo }
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
