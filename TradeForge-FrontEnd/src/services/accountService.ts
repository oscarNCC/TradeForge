import axios from 'axios';
import { api } from './authService';
import type { Account, CreateAccountRequest, UpdateAccountRequest } from '../types/account';

function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data) {
    const d = err.response.data as { error?: string; errors?: Array<{ msg?: string }> };
    if (typeof d.error === 'string') return d.error;
    if (Array.isArray(d.errors) && d.errors[0]?.msg) return d.errors[0].msg;
  }
  return err instanceof Error ? err.message : 'Network error, please try again later';
}

export async function createAccount(data: CreateAccountRequest): Promise<Account> {
  try {
    const res = await api.post<Account>('/api/accounts', data);
    const account = res.data;
    if (!account || typeof account.id !== 'number') {
      throw new Error('Server returned no account data');
    }
    return account;
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }
}

export async function getAccounts(): Promise<Account[]> {
  try {
    const { data } = await api.get<Account[]>('/api/accounts');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }
}

export async function getAccountById(id: number): Promise<Account> {
  const { data } = await api.get<Account>(`/api/accounts/${id}`);
  return data;
}

export async function updateAccount(id: number, data: UpdateAccountRequest): Promise<Account> {
  try {
    const { data: account } = await api.put<Account>(`/api/accounts/${id}`, data);
    return account;
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }
}

export async function deleteAccount(id: number): Promise<void> {
  try {
    await api.delete(`/api/accounts/${id}`);
  } catch (err) {
    throw new Error(getApiErrorMessage(err));
  }
}
