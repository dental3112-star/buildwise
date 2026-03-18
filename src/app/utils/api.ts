import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-663c61b0`;

// Helper function to check demo mode
function isDemoMode(): boolean {
  return localStorage.getItem('accessToken') === 'demo-mode';
}

// Helper function to get access token
function getAccessToken(): string {
  const token = localStorage.getItem('accessToken');
  if (!token || token === 'demo-mode') return publicAnonKey;
  return token;
}

// Helper function to make API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  // In demo mode, skip all API calls and throw a gentle error
  if (isDemoMode()) {
    throw new Error('DEMO_MODE');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAccessToken()}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // If unauthorized, redirect to login (not in demo mode)
      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        window.location.href = '/login';
        throw new Error('Unauthorized - Please login again');
      }
      
      throw new Error(errorData.error || `API call failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ========== CONTRACTS ==========

export async function getContracts() {
  return apiCall('/contracts');
}

export async function createContract(contract: any) {
  return apiCall('/contracts', {
    method: 'POST',
    body: JSON.stringify(contract),
  });
}

export async function updateContract(id: string, updates: any) {
  return apiCall(`/contracts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteContract(id: string) {
  return apiCall(`/contracts/${id}`, {
    method: 'DELETE',
  });
}

// ========== PAYMENTS ==========

export async function getPayments() {
  return apiCall('/payments');
}

export async function createPayment(payment: any) {
  return apiCall('/payments', {
    method: 'POST',
    body: JSON.stringify(payment),
  });
}

export async function updatePayment(id: string, updates: any) {
  return apiCall(`/payments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// ========== INCOME ==========

export async function getIncome() {
  return apiCall('/income');
}

export async function createIncome(income: any) {
  return apiCall('/income', {
    method: 'POST',
    body: JSON.stringify(income),
  });
}

export async function deleteIncome(id: string) {
  return apiCall(`/income/${id}`, {
    method: 'DELETE',
  });
}

// ========== EXPENSES ==========

export async function getExpenses() {
  return apiCall('/expenses');
}

export async function createExpense(expense: any) {
  return apiCall('/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  });
}

export async function deleteExpense(id: string) {
  return apiCall(`/expenses/${id}`, {
    method: 'DELETE',
  });
}

// ========== NOTIFICATIONS ==========

export async function getNotifications() {
  return apiCall('/notifications');
}

export async function updateNotification(id: string, updates: any) {
  return apiCall(`/notifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// ========== INITIALIZATION ==========

export async function initializeSampleData() {
  return apiCall('/init-data', {
    method: 'POST',
  });
}