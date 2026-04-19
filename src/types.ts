/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Expense {
  id: string;
  category: string;
  note?: string;
  amount: number;
  ouchFactor: number; // 1-10
  date: string; // ISO string
}

export interface WishlistItem {
  id: string;
  category: string;
  note?: string;
  amount: number;
  addedAt: string; // ISO string
  isWaitOver?: boolean;
}

export interface IncomeProfile {
  monthlyIncome: number;
  rentMortgage: number;
  debtPayments: number;
  savingsGoal: number;
  weeklyFlexTarget: number;
}

export interface UserStats {
  incomeProfile: IncomeProfile | null;
  totalSpent: number;
  leakyMoney: number; // Ouch 1-3
}
