import { create } from 'zustand';
import type { Account } from '../types/account';
import type { CreateAccountRequest, UpdateAccountRequest } from '../types/account';
import * as accountService from '../services/accountService';

interface AccountState {
  accounts: Account[];
  selectedAccountId: number | null;
  isLoading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  createAccount: (data: CreateAccountRequest) => Promise<Account>;
  updateAccount: (id: number, data: UpdateAccountRequest) => Promise<void>;
  deleteAccount: (id: number) => Promise<void>;
  selectAccount: (id: number | null) => void;
  getSelectedAccount: () => Account | null;
  clearAccounts: () => void;
  clearError: () => void;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  selectedAccountId: null,
  isLoading: false,
  error: null,

  fetchAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const accounts = await accountService.getAccounts();
      set({ accounts, isLoading: false });
      const { selectedAccountId } = get();
      if (selectedAccountId !== null && !accounts.some((a) => a.id === selectedAccountId)) {
        set({ selectedAccountId: accounts[0]?.id ?? null });
      } else if (selectedAccountId === null && accounts.length > 0) {
        set({ selectedAccountId: accounts[0].id });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch accounts',
        isLoading: false,
      });
    }
  },

  createAccount: async (data) => {
    const account = await accountService.createAccount(data);
    set((state) => ({
      accounts: [account, ...state.accounts],
      selectedAccountId: state.selectedAccountId ?? account.id,
    }));
    return account;
  },

  updateAccount: async (id, data) => {
    const account = await accountService.updateAccount(id, data);
    set((state) => ({
      accounts: state.accounts.map((a) => (a.id === id ? account : a)),
    }));
  },

  deleteAccount: async (id) => {
    await accountService.deleteAccount(id);
    set((state) => {
      const accounts = state.accounts.filter((a) => a.id !== id);
      const selectedAccountId =
        state.selectedAccountId === id ? (accounts[0]?.id ?? null) : state.selectedAccountId;
      return { accounts, selectedAccountId };
    });
  },

  selectAccount: (id) => set({ selectedAccountId: id }),

  getSelectedAccount: () => {
    const { accounts, selectedAccountId } = get();
    if (selectedAccountId === null) return null;
    return accounts.find((a) => a.id === selectedAccountId) ?? null;
  },

  clearAccounts: () => set({ accounts: [], selectedAccountId: null }),

  clearError: () => set({ error: null }),
}));
