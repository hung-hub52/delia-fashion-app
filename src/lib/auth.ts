export const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/$/,'');

export function getToken() {
  if (typeof window === 'undefined') return null;
  let t = localStorage.getItem('token') || localStorage.getItem('access_token') || '';
  t = (t || '').replace(/^"(.*)"$/,'$1');
  if (t.startsWith('Bearer ')) t = t.slice(7);
  return t || null;
}

export function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function verifyAdmin(password: string) {
  const res = await fetch(`${API}/auth/verify-admin`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', ...authHeaders() },
    body: JSON.stringify({ password }),
  });
  const data = await res.json().catch(()=> ({}));
  if (!res.ok || !data?.ok) throw new Error(data?.message || 'Unauthorized');
  return data;
}
