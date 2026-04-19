/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Shield, Bell, CreditCard, LogOut, ChevronRight, Wallet, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { IncomeProfile } from '../types';

interface SettingsViewProps {
  incomeProfile: IncomeProfile | null;
  onUpdateProfile: (profile: IncomeProfile | null) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ incomeProfile, onUpdateProfile }) => {
  const handleResetIncome = () => {
    if (confirm("Recalibrate your Financial Profile? This will reset your income and obligation settings.")) {
        onUpdateProfile(null);
    }
  };

  const clearAllData = () => {
    if (confirm("DANGER: This will permanently purge all history, leaks, and profile data. Are you sure?")) {
        localStorage.clear();
        window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      <header>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2 block">System Configuration</span>
        <h1 className="text-4xl font-serif font-black tracking-tight text-slate-900">System Preferences</h1>
        <p className="text-slate-500 font-medium">Manage your financial environment and profile.</p>
      </header>

      <div className="max-w-2xl space-y-6">
        <SettingsGroup title="CFO Dimensions">
          <button onClick={handleResetIncome} className="w-full text-left">
            <SettingsItem 
                icon={<Wallet className="h-5 w-5" />} 
                label="Financial Profile Data" 
                value={incomeProfile ? `$${incomeProfile.monthlyIncome.toLocaleString()} Inflow Registered` : "Not Initialized"} 
            />
          </button>
          <SettingsItem 
            icon={<CreditCard className="h-5 w-5" />} 
            label="Base Currency" 
            value="USD ($)" 
          />
        </SettingsGroup>

        <SettingsGroup title="Intelligence & Security">
          <SettingsItem icon={<Shield className="h-5 w-5" />} label="Biometric Lock" value="Enabled" toggle />
          <SettingsItem icon={<Bell className="h-5 w-5" />} label="Intention Alerts" value="Daily at 8:00 AM" />
        </SettingsGroup>

        <SettingsGroup title="Data Governance">
            <button 
                onClick={clearAllData}
                className="w-full text-left p-6 flex items-center justify-between text-red-500 hover:bg-red-50 transition-colors uppercase font-black text-xs tracking-widest group"
            >
                <div className="flex items-center gap-4">
                    <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>Purge Local Environment Data</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </SettingsGroup>
      </div>

      <div className="pt-12 flex flex-col items-center text-slate-300">
        <p className="text-[10px] font-black uppercase tracking-widest">Mindful Money v2.5.0</p>
        <p className="text-[9px] font-medium mt-1">Refined and Integrated</p>
      </div>
    </div>
  );
};

const SettingsGroup = ({ title, children }: any) => (
  <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
    <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h3>
    </div>
    <div className="divide-y divide-slate-50">
      {children}
    </div>
  </div>
);

const SettingsItem = ({ icon, label, value, toggle }: any) => (
  <div className="p-6 flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 transition-colors">
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-white transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 leading-none mb-1">{label}</p>
        <p className="text-xs text-slate-400 font-medium">{value}</p>
      </div>
    </div>
    {toggle ? (
      <div className="w-10 h-5 bg-slate-900 rounded-full relative">
        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
      </div>
    ) : (
      <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-slate-400 transition-colors" />
    )}
  </div>
);

