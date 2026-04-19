/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Wallet, Home, CreditCard, Target, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Expense, IncomeProfile } from '../types';

interface CashflowViewProps {
  expenses: Expense[];
  profile: IncomeProfile;
}

export const CashflowView: React.FC<CashflowViewProps> = ({ expenses, profile }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const fixedCosts = profile.rentMortgage + profile.debtPayments;
  const freeCashTotal = profile.monthlyIncome - fixedCosts - profile.savingsGoal;
  const currentSafeSpend = freeCashTotal - totalSpent;
  
  const leaks = monthlyExpenses.filter(e => e.ouchFactor <= 3);
  const leakTotal = leaks.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2 block">System Pulse</span>
        <h1 className="text-4xl font-serif font-black tracking-tight text-slate-900">Cashflow Architecture</h1>
        <p className="text-slate-500 font-medium">Visualizing your monthly resource velocity.</p>
      </header>

      {/* High Level Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <FlowCard 
          label="Total Inflow" 
          amount={profile.monthlyIncome} 
          icon={<Wallet className="h-6 w-6 text-green-500" />}
          description="Gross monthly take-home."
          trend="primary"
        />
        <FlowCard 
          label="Committed Outflow" 
          amount={fixedCosts} 
          icon={<Home className="h-6 w-6 text-blue-500" />}
          description="Fixed rent, mortgage, and debt."
          trend="neutral"
        />
        <FlowCard 
          label="Flexible Liquidity" 
          amount={freeCashTotal} 
          icon={<ArrowUpRight className="h-6 w-6 text-purple-500" />}
          description="Cash available after obligations."
          trend="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cashflow Breakdown Bar */}
        <section className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-serif font-black">Monthly Allocation</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Calculated Pulse</span>
          </div>

          <div className="space-y-12">
            <div className="h-10 w-full bg-slate-50 rounded-2xl flex overflow-hidden shadow-inner">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(profile.rentMortgage / profile.monthlyIncome) * 100}%` }}
                 className="h-full bg-blue-500 border-r border-white/20"
               />
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(profile.debtPayments / profile.monthlyIncome) * 100}%` }}
                 className="h-full bg-red-400 border-r border-white/20"
               />
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(profile.savingsGoal / profile.monthlyIncome) * 100}%` }}
                 className="h-full bg-green-500 border-r border-white/20"
               />
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(totalSpent / profile.monthlyIncome) * 100}%` }}
                 className="h-full bg-slate-900 border-r border-white/20"
               />
               <div className="flex-1 bg-slate-100 italic flex items-center justify-center text-[10px] font-black text-slate-300">RESERVE</div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <LegendItem color="bg-blue-500" label="Housing" amount={profile.rentMortgage} />
              <LegendItem color="bg-red-400" label="Debt" amount={profile.debtPayments} />
              <LegendItem color="bg-green-500" label="Savings" amount={profile.savingsGoal} />
              <LegendItem color="bg-slate-900" label="Expenses" amount={totalSpent} />
            </div>
          </div>
        </section>

        {/* Leak Pressure */}
        <section className="bg-orange-50 p-10 rounded-[48px] border border-orange-100 flex flex-col justify-between">
           <div className="space-y-4">
             <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
                <AlertCircle className="h-6 w-6 text-orange-600" />
             </div>
             <h3 className="text-2xl font-serif font-black text-orange-950">Leak Pressure</h3>
             <p className="text-orange-800/80 font-medium">
                Your low-resistance spending is currently consuming 
                <span className="font-black text-orange-950 px-1"> {((leakTotal / profile.monthlyIncome) * 100).toFixed(1)}% </span> 
                of your total inflow.
             </p>
           </div>

           <div className="mt-8 space-y-6">
              <div className="p-6 bg-white rounded-[32px] border border-orange-200">
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-1">Leak Monthly Impact</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-black text-orange-950">${leakTotal.toFixed(2)}</span>
                    <span className="text-orange-400 font-bold text-xs">per month</span>
                </div>
              </div>
              <p className="text-xs text-orange-800/60 leading-relaxed font-medium">
                Every dollar in this bucket is bypassing your filter. Reducing this pressure by 50% would add <strong>${(leakTotal/2).toFixed(2)}</strong> to your monthly reserve.
              </p>
           </div>
        </section>
      </div>
      
      {/* Financial Health Summary */}
      <section className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h3 className="text-3xl font-serif font-black text-slate-900 leading-tight">
            Free Cash <br/> Remaining
          </h3>
          <p className="text-slate-500 font-medium max-w-sm">
            After all bills, debts, savings, and current month expenses, this is your remaining "Safety Ceiling."
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-slate-50 p-10 rounded-[40px] border border-slate-100">
           <span className="text-6xl font-serif font-black text-slate-900">${currentSafeSpend.toFixed(0)}</span>
           <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Remaining Reserve</span>
        </div>
      </section>
    </div>
  );
};

const FlowCard = ({ label, amount, icon, description, trend }: any) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[200px] hover:shadow-lg transition-all">
    <div className="flex justify-between items-start">
      <div className="bg-slate-50 p-4 rounded-2xl">
        {icon}
      </div>
      {trend === 'primary' && <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight">Main Inflow</span>}
    </div>
    <div className="mt-6">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <h4 className="text-3xl font-serif font-black text-slate-900">${amount.toLocaleString()}</h4>
      <p className="text-xs text-slate-400 font-medium mt-1">{description}</p>
    </div>
  </div>
);

const LegendItem = ({ color, label, amount }: any) => (
  <div className="flex items-center gap-3">
    <div className={`w-3 h-3 rounded-full ${color}`} />
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">{label}</p>
      <p className="text-sm font-bold text-slate-900">${amount.toLocaleString()}</p>
    </div>
  </div>
);
