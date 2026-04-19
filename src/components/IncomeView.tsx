/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  Home, 
  CreditCard, 
  Target, 
  Sparkles, 
  Save, 
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { IncomeProfile } from '../types';

interface IncomeViewProps {
  profile: IncomeProfile | null;
  onUpdate: (profile: IncomeProfile) => void;
}

export const IncomeView: React.FC<IncomeViewProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = React.useState<IncomeProfile>(profile || {
    monthlyIncome: 0,
    rentMortgage: 0,
    debtPayments: 0,
    savingsGoal: 0,
    weeklyFlexTarget: 0,
  });

  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = () => {
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleChange = (field: keyof IncomeProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2 block">Personal CFO</span>
        <h1 className="text-4xl font-serif font-black tracking-tight text-slate-900">Financial Profile</h1>
        <p className="text-slate-500 font-medium">Configure the numbers that power your Personal CFO engine.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <InputCard 
            icon={<Wallet className="h-5 w-5 text-orange-500" />}
            label="Income Sources"
            value={formData.monthlyIncome}
            onChange={(v) => handleChange('monthlyIncome', v)}
            placeholder="e.g. 5000"
            description="Your total net income after taxes."
          />
          <InputCard 
            icon={<Home className="h-5 w-5 text-blue-500" />}
            label="Housing Costs"
            value={formData.rentMortgage}
            onChange={(v) => handleChange('rentMortgage', v)}
            placeholder="e.g. 1500"
            description="Your primary monthly housing obligation."
          />
          <InputCard 
            icon={<CreditCard className="h-5 w-5 text-red-500" />}
            label="Debt Load"
            value={formData.debtPayments}
            onChange={(v) => handleChange('debtPayments', v)}
            placeholder="e.g. 400"
            description="Minimum payments for loans and cards."
          />
        </div>

        <div className="space-y-6">
          <InputCard 
            icon={<Target className="h-5 w-5 text-green-500" />}
            label="Savings Targets"
            value={formData.savingsGoal}
            onChange={(v) => handleChange('savingsGoal', v)}
            placeholder="e.g. 1000"
            description="The amount you intend to set aside first."
          />
          <InputCard 
            icon={<Sparkles className="h-5 w-5 text-purple-500" />}
            label="Weekly Flex Spend"
            value={formData.weeklyFlexTarget}
            onChange={(v) => handleChange('weeklyFlexTarget', v)}
            placeholder="e.g. 200"
            description="Target for non-essential lifestyle spending."
          />

          <div className="bg-slate-900 p-8 rounded-[40px] text-white flex flex-col justify-between min-h-[240px] shadow-2xl relative overflow-hidden">
             <div className="relative z-10 space-y-4">
               <h3 className="text-xl font-serif font-black">Ready to Update?</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Updating these figures will instantly recalculate your 
                 <strong> Health Score</strong> and <strong> Safe Remaining Spend</strong> on the Dashboard.
               </p>
             </div>
             
             <button 
                onClick={handleSave}
                className={`relative z-10 w-full py-4 rounded-[20px] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
                  isSaved ? 'bg-green-500 text-white' : 'bg-white text-slate-900 hover:bg-slate-100 hover:-translate-y-1'
                }`}
             >
               {isSaved ? <ShieldCheck className="h-5 w-5" /> : <Save className="h-5 w-5" />}
               {isSaved ? 'Profile Updated' : 'Lock In Profile'}
             </button>

             <div className="absolute -right-8 -bottom-8 opacity-10">
                <TrendingUp className="h-48 w-48 rotate-12" />
             </div>
          </div>
        </div>
      </div>

      {/* Logic Preview Card */}
      {formData.monthlyIncome > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-black text-slate-900">Logic Summary</h3>
            <p className="text-slate-500 font-medium">How Mindful Money sees your economy:</p>
            <div className="space-y-2">
              <SummaryLine label="Fixed Obligations" value={formData.rentMortgage + formData.debtPayments} />
              <SummaryLine label="Savings Priority" value={formData.savingsGoal} />
              <SummaryLine label="Calculated Surplus" value={formData.monthlyIncome - (formData.rentMortgage + formData.debtPayments + formData.savingsGoal)} highlight />
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end">
             <div className="text-right">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Max Daily Allowance</p>
               <p className="text-5xl font-serif font-black text-slate-900">
                 ${((formData.monthlyIncome - (formData.rentMortgage + formData.debtPayments + formData.savingsGoal)) / 30.4).toFixed(2)}
               </p>
               <p className="text-xs font-bold text-slate-400 mt-2 italic">Based on your surplus liquidity.</p>
             </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

const InputCard = ({ icon, label, value, onChange, placeholder, description }: any) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4 group hover:border-slate-200 transition-all">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
        {icon}
      </div>
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    </div>
    <div className="relative">
      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-serif font-black text-slate-300">$</span>
      <input 
        type="number"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-none py-2 pl-6 text-3xl font-serif font-black focus:outline-none placeholder:text-slate-100"
      />
    </div>
    <p className="text-xs text-slate-400 font-medium">{description}</p>
  </div>
);

const SummaryLine = ({ label, value, highlight }: any) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-none">
    <span className="text-sm font-bold text-slate-500">{label}</span>
    <span className={`font-serif font-black ${highlight ? 'text-xl text-green-600' : 'text-slate-900'}`}>${value.toLocaleString()}</span>
  </div>
);
