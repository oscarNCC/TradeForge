export type AccountType = 'eval' | 'demo_funded' | 'live';

export interface Account {
  id: number;
  user_id: number;
  account_name: string;
  account_type: string | null;
  broker: string | null;
  initial_capital: string | null;
  current_balance: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAccountRequest {
  account_name: string;
  account_type?: AccountType | null;
  broker?: string | null;
  initial_capital?: number | null;
}

export interface UpdateAccountRequest {
  account_name?: string;
  account_type?: AccountType | null;
  broker?: string | null;
  initial_capital?: number | null;
  current_balance?: number | null;
  is_active?: boolean;
}
