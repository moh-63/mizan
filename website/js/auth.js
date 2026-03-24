// Redirect to sign-in if no active session
async function requireAuth() {
  const {
    data: { session },
  } = await sb.auth.getSession();
  if (!session) window.location.href = "signin.html";
  return session;
}

// Sign out and redirect
async function signOut() {
  await sb.auth.signOut();
  window.location.href = "signin.html";
}
