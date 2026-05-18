const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  register: (body: { name: string; email: string; password: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),

  // Dashboard
  stats: () => request('/settings/stats'),

  // Borrowers
  getBorrowers: () => request('/borrowers'),
  createBorrower: (body: { name: string; phone: string; email?: string }) =>
    request('/borrowers', { method: 'POST', body: JSON.stringify(body) }),
  deleteBorrower: (id: string) => request(`/borrowers/${id}`, { method: 'DELETE' }),

  // Debts
  getDebts: () => request('/debts'),
  getDebt: (id: string) => request(`/debts/${id}`),
  createDebt: (body: { borrowerId: string; amount: number; flatFee: number; durationMonths: number; startDate?: string }) =>
    request('/debts', { method: 'POST', body: JSON.stringify(body) }),
  getMyDebts: () => request('/debts/my'),

  // Payments
  getPendingPayments: () => request('/payments/pending'),
  approvePayment: (id: string, note?: string) =>
    request(`/payments/${id}/approve`, { method: 'POST', body: JSON.stringify({ note }) }),
  rejectPayment: (id: string, note?: string) =>
    request(`/payments/${id}/reject`, { method: 'POST', body: JSON.stringify({ note }) }),

  // Settings
  getSettings: () => request('/settings'),
  saveSettings: (body: { paymentInfo?: object; smsConfig?: object }) =>
    request('/settings', { method: 'POST', body: JSON.stringify(body) }),
};
