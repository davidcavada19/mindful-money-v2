/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Search, 
  Trash2, 
  Filter, 
  ArrowUpDown, 
  Tag, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Expense } from '../types';
import { CATEGORIES } from '../constants';

interface HistoryViewProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';
type OuchFilter = 'all' | 'leak' | 'neutral' | 'painful';

export const HistoryView: React.FC<HistoryViewProps> = ({ expenses, onDelete }) => {
  const [ouchFilter, setOuchFilter] = React.useState<OuchFilter>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<SortOption>('newest');

  // Summary Logic
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalLeak = expenses
    .filter(e => e.ouchFactor <= 3)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const largestExpense = expenses.length > 0 
    ? [...expenses].sort((a, b) => b.amount - a.amount)[0] 
    : null;

  const mostCommonCategory = expenses.length > 0
    ? (() => {
        const counts = expenses.reduce((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        return (Object.entries(counts) as [string, number][]).sort((a, b) => b[1] - a[1])[0][0];
      })()
    : 'None';

  // Filtering Logic
  const filteredExpenses = expenses
    .filter(e => {
      const categoryMatch = categoryFilter === 'all' || e.category === categoryFilter;
      const ouchMatch = 
        ouchFilter === 'all' ? true :
        ouchFilter === 'leak' ? e.ouchFactor <= 3 :
        ouchFilter === 'neutral' ? (e.ouchFactor >= 4 && e.ouchFactor <= 6) :
        e.ouchFactor >= 7;
      return categoryMatch && ouchMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'highest') return b.amount - a.amount;
      if (sortBy === 'lowest') return a.amount - b.amount;
      return 0;
    });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-serif font-black tracking-tight text-slate-900">Spending History</h2>
          <p className="text-slate-500 font-medium">Review and audit your financial intentionality.</p>
        </div>
      </header>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryTile 
          label="Total Expenses" 
          value={`$${totalSpent.toFixed(2)}`} 
          icon={TrendingUp} 
          color="bg-blue-50 text-blue-600"
        />
        <SummaryTile 
          label="Total Leak Money" 
          value={`$${totalLeak.toFixed(2)}`} 
          icon={AlertCircle} 
          color="bg-orange-50 text-orange-600"
        />
        <SummaryTile 
          label="Largest Spend" 
          value={largestExpense ? `$${largestExpense.amount.toFixed(2)}` : '$0.00'} 
          subtitle={largestExpense?.category || '-'}
          icon={DollarSign} 
          color="bg-slate-900 text-white"
        />
        <SummaryTile 
          label="Top Usage" 
          value={mostCommonCategory} 
          icon={Tag} 
          color="bg-slate-50 text-slate-600"
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Ouch Ranges */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'leak', 'neutral', 'painful'] as OuchFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setOuchFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  ouchFilter === filter 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'leak' ? 'Leak' : filter === 'neutral' ? 'Neutral' : 'Painful'}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Category Select */}
            <div className="relative group">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-11 pr-8 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-slate-200 transition-all appearance-none cursor-pointer w-full md:w-56"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="relative group">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-11 pr-8 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-slate-200 transition-all appearance-none cursor-pointer w-full md:w-56"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredExpenses.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-20 rounded-[40px] border border-dashed border-slate-200 text-center"
            >
              <div className="bg-slate-50 p-4 rounded-full w-fit mx-auto mb-4">
                <Search className="h-8 w-8 text-slate-300" />
              </div>
              <h4 className="text-xl font-serif font-bold text-slate-900">No expenses found for this filter.</h4>
              <p className="text-slate-400 mt-2 max-w-xs mx-auto">Try adjusting your filters or log a new intentional purchase.</p>
            </motion.div>
          ) : (
            filteredExpenses.map((expense) => (
              <motion.div 
                layout
                key={expense.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group transition-all hover:border-slate-200 hover:shadow-md"
              >
                <div className="flex items-center gap-6 min-w-0">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ouch-gradient-${expense.ouchFactor} shadow-sm border border-white/50`}>
                    {expense.ouchFactor}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-slate-900 truncate text-lg uppercase tracking-tight">{expense.category}</h4>
                      <span className="flex-shrink-0 px-2 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-black uppercase rounded-md border border-slate-100">
                        {expense.category}
                      </span>
                    </div>
                    {expense.note && (
                      <p className="text-sm text-slate-500 font-medium truncate mb-1">{expense.note}</p>
                    )}
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                          {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUpDown className="h-3 w-3" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Ouch {expense.ouchFactor}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 pl-4">
                  <span className="text-2xl font-serif font-black text-slate-900 whitespace-nowrap">${expense.amount.toFixed(2)}</span>
                  <button 
                    onClick={() => onDelete(expense.id)}
                    className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

interface SummaryTileProps {
  label: string;
  value: string;
  subtitle?: string;
  icon: any;
  color: string;
}

const SummaryTile: React.FC<SummaryTileProps> = ({ label, value, subtitle, icon: Icon, color }) => (
  <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[120px]">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="mt-4">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <h5 className="text-xl font-serif font-black text-slate-900 truncate">{value}</h5>
      {subtitle && <p className="text-[10px] text-slate-400 truncate mt-0.5">{subtitle}</p>}
    </div>
  </div>
);
