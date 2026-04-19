/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Wallet, AlertCircle, ShoppingBag, TrendingUp, ArrowRight, Target, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion } from 'motion/react';
import { Expense, WishlistItem, IncomeProfile } from '../types';

interface DashboardProps {
  expenses: Expense[];
  wishlist: WishlistItem[];
  incomeProfile: IncomeProfile | null;
  onAddClick: () => void;
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ expenses, wishlist, incomeProfile, onAddClick, onNavigate }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const leakyMoney = monthlyExpenses
    .filter(e => e.ouchFactor <= 3)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const categories = monthlyExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = (Object.entries(categories) as [string, number][])
    .sort((a, b) => b[1] - a[1]);

  const topCategory = sortedCategories[0]?.[0];
  
  const biggestExpense = monthlyExpenses.length > 0 
    ? [...monthlyExpenses].sort((a, b) => b.amount - a.amount)[0] 
    : null;

  const freqCategories = monthlyExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFreqCat = (Object.entries(freqCategories) as [string, number][])
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  // Financial Health Calculations
  const income = incomeProfile?.monthlyIncome || 0;
  const hasIncomeData = income > 0;

  const fixedBills = (incomeProfile?.rentMortgage || 0) + (incomeProfile?.debtPayments || 0);
  const savingsGoal = incomeProfile?.savingsGoal || 0;
  const safeRemaining = Math.max(0, income - fixedBills - totalSpent - savingsGoal);
  const leakRatio = hasIncomeData ? (leakyMoney / income) * 100 : 0;

  // Health Score (0-100)
  let statusScore = 0;
  if (hasIncomeData) {
    let healthScore = 100;
    healthScore -= (leakyMoney / income) * 200; 
    healthScore -= (totalSpent / income) * 50;  
    if (incomeProfile) {
      healthScore -= (incomeProfile.debtPayments / income) * 100; 
    }
    statusScore = Math.max(0, Math.min(100, Math.round(healthScore)));
  }

  const weekendSpent = monthlyExpenses.filter(e => {
    const day = new Date(e.date).getDay();
    return day === 0 || day === 6;
  }).reduce((s, e) => s + e.amount, 0);
  
  const weekdaySpent = totalSpent - weekendSpent;
  const weekendWeekdayRatio = weekdaySpent > 0 ? (weekendSpent / 2) / (weekdaySpent / 5 || 1) : 0;

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2 block">Monthly Intelligence</span>
          <h1 className="text-4xl font-serif font-black tracking-tight text-slate-900">Executive Overview</h1>
          <p className="text-slate-500 font-medium">Refined data from your Personal CFO engine.</p>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black shadow-xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-0.5 transition-all uppercase tracking-widest text-[11px]"
        >
          <Plus className="h-5 w-5" />
          Log Transaction
        </button>
      </header>

      {/* Conditional Intelligence Cards */}
      {!hasIncomeData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[200px]">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 leading-none">Total Spent</p>
                <h3 className="text-3xl font-serif font-black text-slate-900">${totalSpent.toLocaleString()}</h3>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-300">
                <ShieldCheck className="h-4 w-4" />
                Raw Data Tracking Active
              </div>
           </div>
           <motion.div 
             whileHover={{ y: -4 }}
             onClick={() => onNavigate('profile')}
             className="bg-slate-900 p-8 rounded-[40px] text-white flex flex-col justify-between min-h-[200px] cursor-pointer shadow-xl shadow-slate-100 group transition-all"
           >
              <div className="flex justify-between items-start">
                 <div className="bg-white/10 p-4 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-orange-400" />
                 </div>
                 <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="text-xl font-serif font-black mb-1">Complete your Financial Profile</h4>
                <p className="text-slate-400 text-xs font-medium">Unlock deeper financial insights and Personal CFO intelligence.</p>
              </div>
           </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Monthly Income" value={`$${income.toLocaleString()}`} icon={<Wallet className="h-6 w-6" />} color="blue" />
          <StatCard label="Burn Rate" value={`$${totalSpent.toLocaleString()}`} icon={<ShieldCheck className="h-6 w-6" />} color="slate" />
          <StatCard 
              label="Leak Exposure" 
              value={`$${leakyMoney.toLocaleString()}`} 
              icon={<AlertCircle className="h-6 w-6" />} 
              color="orange" 
              subtitle={`${leakRatio.toFixed(1)}% of income`}
              highlight={leakyMoney > (income * 0.1)} 
              action={() => onNavigate('leak')}
          />
          <StatCard 
              label="Remaining Safe Spend" 
              value={`$${safeRemaining.toLocaleString()}`} 
              icon={<Target className="h-6 w-6" />} 
              color="green" 
              action={() => onNavigate('cashflow')}
          />
        </div>
      )}

      {hasIncomeData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Health Score Gauge */}
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Financial Health Score</p>
              <div className="relative mb-8">
                <svg className="h-48 w-48 -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                  <motion.circle 
                      cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="502.6" 
                      initial={{ strokeDashoffset: 502.6 }}
                      animate={{ strokeDashoffset: 502.6 * (1 - statusScore/100) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={statusScore > 75 ? "text-green-500" : statusScore > 40 ? "text-orange-500" : "text-red-500"} 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-serif font-black">{statusScore}</span>
                  <HeartPulse className={`h-6 w-6 mt-1 ${statusScore > 75 ? "text-green-500" : statusScore > 40 ? "text-orange-500" : "text-red-500"}`} />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-500 leading-relaxed px-4">
                {statusScore > 80 ? "Your financial core is solid. High intentionality detected." : 
                  statusScore > 50 ? "Stable, but leaking efficiency. Optimize low-value spend." : 
                  "Critical leaks impacting capital reserves. Immediate behavioral adjustment needed."}
              </p>
          </div>

          {/* AI Insight Engine */}
          <div className="lg:col-span-2 bg-slate-900 p-10 rounded-[48px] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150">
              <TrendingUp className="h-48 w-48" />
            </div>
            
            <div className="relative space-y-8">
              <div className="flex items-center gap-3">
                <span className="bg-orange-500 p-2 rounded-xl">
                  <Sparkles className="h-5 w-5 text-slate-900" />
                </span>
                <h3 className="text-xl font-serif font-black">CFO Insights Engine</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InsightCard 
                      title="Leak Impact" 
                      text={`${leakRatio.toFixed(1)}% of your income went to low-resistance spending.`}
                      sub={`Reduces savings by $${leakyMoney} this month.`}
                  />
                  <InsightCard 
                      title="Savings Potential" 
                      text={`If you reduce leaks by 40%, you save $${(leakyMoney * 0.4).toFixed(0)}/mo.`}
                      sub={`Capital that could boost your net worth.`}
                  />
                  <InsightCard 
                      title="Housing Pressure" 
                      text={`Rent consumes ${((incomeProfile?.rentMortgage || 0) / income * 100).toFixed(0)}% of income.`}
                      sub={((incomeProfile?.rentMortgage || 0) / income) > 0.3 ? "Above standard recommendation." : "Healthy allocation."}
                  />
                  <InsightCard 
                      title="Behavioral Shift" 
                      text={weekendWeekdayRatio > 1.5 ? `Weekend spending is ${weekendWeekdayRatio.toFixed(1)}x weekdays.` : "Consistent daily spending levels."}
                      sub={`Focus willpower on leisure periods.`}
                  />
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 flex justify-between items-center text-slate-400">
                <p className="text-xs font-medium italic">"Data without insight is just noise."</p>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Savings Target</span>
                      <span className={totalSpent + fixedBills + savingsGoal <= income ? "text-green-500 font-bold" : "text-red-400 font-bold"}>
                          {totalSpent + fixedBills + savingsGoal <= income ? "ON TRACK" : "BEHIND TARGET"}
                      </span>
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Sectors - Always Shown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top Spend Sectors */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-serif font-black flex items-center gap-2 font-black uppercase tracking-widest text-sm">
              Primary Spend Sectors
            </h4>
          </div>
          <div className="space-y-4">
            {sortedCategories.slice(0, 3).length > 0 ? (
              sortedCategories.slice(0, 3).map(([cat, amt]) => (
                <div key={cat} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="font-bold text-slate-700">{cat}</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-serif font-black text-slate-900">${amt.toFixed(0)}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase">{((amt/income)*100).toFixed(1)}% OF INC</span>
                    </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic py-8 text-center uppercase tracking-widest">Awaiting transaction data...</p>
            )}
          </div>
        </div>

        {/* Quick Intelligence Block */}
        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 grid grid-cols-2 gap-8">
            <InsightBlock 
                label="Primary Burn" 
                value={topCategory || 'N/A'} 
                desc={topCategory ? `Main allocation sector.` : 'No data.'} 
            />
            <InsightBlock 
                label="Biggest Hit" 
                value={biggestExpense ? `$${biggestExpense.amount.toFixed(0)}` : 'N/A'} 
                desc={biggestExpense ? `Single largest hit.` : 'No data.'} 
            />
            <InsightBlock 
                label="Frequency" 
                value={mostFreqCat || 'N/A'} 
                desc={mostFreqCat ? `Most common sector.` : 'No data.'} 
            />
            <div className="flex flex-col justify-end">
                <button 
                    onClick={() => onNavigate('wishlist')}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-orange-200 transition-all"
                >
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                            <ShoppingBag className="h-4 w-4 text-slate-400 group-hover:text-orange-500" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Wishlist</span>
                    </div>
                    <span className="text-lg font-serif font-black">{wishlist.length}</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, highlight, action, subtitle }: any) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    slate: 'bg-slate-50 text-slate-800'
  } as any;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col justify-between min-h-[200px] bg-white group cursor-default`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-xl ${colorMap[color]}`}>
          {icon}
        </div>
        {action && (
            <button 
                onClick={action}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-slate-900 flex items-center gap-1"
            >
                Audit <ArrowRight className="h-3 w-3" />
            </button>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 leading-none">{label}</p>
        <h3 className="text-3xl font-serif font-black text-slate-900 leading-tight">{value}</h3>
        {subtitle && <p className="text-[10px] font-black text-orange-500 mt-1 uppercase tracking-tight">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

const InsightBlock = ({ label, value, desc }: any) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="font-serif font-black text-slate-900 text-lg leading-tight">{value}</p>
    <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

const InsightCard = ({ title, text, sub }: any) => (
    <div className="bg-white/5 border border-white/10 p-5 rounded-[28px] hover:bg-white/10 transition-colors">
        <h5 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-2">{title}</h5>
        <p className="text-sm font-bold text-white mb-1 leading-tight">{text}</p>
        <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
    </div>
);

const Sparkles = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </svg>
);

