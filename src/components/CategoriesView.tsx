/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Tag, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Expense } from '../types';
import { CATEGORIES } from '../constants';

interface CategoriesViewProps {
  expenses: Expense[];
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ expenses }) => {
  const categories = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const sorted = (Object.entries(categories) as [string, number][])
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-serif font-black tracking-tight text-slate-900">Spending Sectors</h1>
        <p className="text-slate-500 font-medium">Analyze where your resources are allocated.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map(cat => {
            const amount = categories[cat] || 0;
            const count = expenses.filter(e => e.category === cat).length;
            
            return (
                <motion.div 
                    key={cat}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px] group transition-all hover:border-slate-200"
                >
                    <div className="flex justify-between items-start">
                        <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-slate-100 transition-colors">
                            <Tag className="h-4 w-4 text-slate-400" />
                        </div>
                        {amount > 0 && (
                            <div className="flex items-center gap-1 text-green-500">
                                <TrendingUp className="h-3 w-3" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">Active</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4">
                        <h4 className="text-lg font-serif font-black text-slate-900 mb-1">{cat}</h4>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Spent</p>
                                <p className="text-xl font-black text-slate-900 mt-1">${amount.toFixed(2)}</p>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{count} Items</p>
                        </div>
                    </div>
                </motion.div>
            );
        })}
      </div>
    </div>
  );
};
