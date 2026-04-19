/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Save, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Expense, WishlistItem } from '../types';
import { CATEGORIES } from '../constants';

interface ExpenseFormProps {
  onClose: () => void;
  onSubmit: (data: Partial<Expense | WishlistItem>, isWishlist: boolean) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, onSubmit }) => {
  const [category, setCategory] = React.useState('');
  const [note, setNote] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [ouchFactor, setOuchFactor] = React.useState(5);
  const [isWishlist, setIsWishlist] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    onSubmit({
      category,
      note,
      amount: parseFloat(amount),
      ouchFactor: isWishlist ? undefined : ouchFactor,
    }, isWishlist);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-serif font-black">Logged Spending</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
            <select
              required
              autoFocus
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 transition-all font-medium appearance-none cursor-pointer"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Optional Note</label>
            <input
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 transition-all font-medium"
              placeholder="e.g. Netflix, Lunch with Sarah..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
              <input
                required
                type="number"
                step="0.01"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-8 focus:ring-2 focus:ring-orange-500 transition-all font-bold text-xl"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <input
              type="checkbox"
              id="wishlist"
              className="h-5 w-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
              checked={isWishlist}
              onChange={e => setIsWishlist(e.target.checked)}
            />
            <label htmlFor="wishlist" className="flex flex-col cursor-pointer">
              <span className="font-bold text-orange-800 text-sm">Use 48-Hour Rule</span>
              <span className="text-orange-600 text-xs">Wait 2 days before actually buying this.</span>
            </label>
          </div>

          {!isWishlist && (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ouch Factor (1-10)</label>
                  <div className={`px-3 py-1 rounded-full font-black text-sm ouch-gradient-${ouchFactor} transition-colors duration-300`}>
                    {ouchFactor}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">How painful did this purchase feel to your wallet?</p>
              </div>

              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 transition-all"
                  value={ouchFactor}
                  onChange={e => setOuchFactor(parseInt(e.target.value))}
                />
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  <span className="w-24">Didn't notice</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-md border tracking-normal transition-all duration-300 ${
                    ouchFactor <= 3 ? 'bg-green-50 border-green-200 text-green-600' : 
                    ouchFactor <= 6 ? 'bg-blue-50 border-blue-200 text-blue-600' : 
                    'bg-red-50 border-red-200 text-red-600'
                  }`}>
                    {ouchFactor <= 3 ? 'Leak Money' : ouchFactor <= 6 ? 'Neutral Spend' : 'Painful Purchase'}
                  </span>
                  <span className="w-24 text-right">It really hurt</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-slate-900 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
            >
              {isWishlist ? (
                <>
                  <Clock className="h-5 w-5" />
                  Start 48h Wait
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Log Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
