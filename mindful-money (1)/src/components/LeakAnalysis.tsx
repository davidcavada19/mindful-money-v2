/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, TrendingDown, Target, Zap, ArrowRight, PieChart, ShieldCheck, Lightbulb, Calendar, Coffee } from 'lucide-react';
import { motion } from 'motion/react';
import { Expense } from '../types';

interface LeakAnalysisProps {
  expenses: Expense[];
}

export const LeakAnalysis: React.FC<LeakAnalysisProps> = ({ expenses }) => {
  const leaks = expenses.filter(e => e.ouchFactor <= 3);
  const totalLeak = leaks.reduce((sum, e) => sum + e.amount, 0);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgLeak = leaks.length > 0 ? totalLeak / leaks.length : 0;
  const biggestLeak = leaks.length > 0 ? [...leaks].sort((a, b) => b.amount - a.amount)[0] : null;

  if (leaks.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-green-50 p-6 rounded-full mb-6">
          <Zap className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-serif font-black text-slate-900">No invisible leaks detected.</h2>
        <p className="text-slate-400 max-w-md mx-auto mt-4 text-lg">
          Your wallet is airtight. Every dollar spent is passing through your logic filter. Great job.
        </p>
      </div>
    );
  }

  // Category Breakdown Logic
  const categoryLeaks = leaks.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCatLeaks = (Object.entries(categoryLeaks) as [string, number][])
    .sort((a, b) => b[1] - a[1]);

  // Leak Control Score Logic
  // Formula: 100 - (% of total money that was leaked) adjusted by frequency
  const leakPercentage = (totalLeak / (totalSpent || 1)) * 100;
  const intentionalCountPercentage = ((expenses.length - leaks.length) / (expenses.length || 1)) * 100;
  const score = Math.max(0, Math.round(( (100 - leakPercentage) * 0.7 ) + ( intentionalCountPercentage * 0.3 )));

  // Recommendations Engine Logic
  const recommendations: { icon: any; text: string; subtext: string; color: string }[] = [];
  
  // 1. Category savings
  if (sortedCatLeaks.length > 0) {
    const [topCat, topAmt] = sortedCatLeaks[0];
    recommendations.push({
      icon: <Coffee className="h-5 w-5" />,
      text: `Reducing ${topCat} could save you $${topAmt.toFixed(2)}/cycle`,
      subtext: `This is currently your #1 source of invisible spend.`,
      color: "border-orange-200 bg-orange-50 text-orange-950"
    });
  }

  // 2. Small purchases
  const under20Leaks = leaks.filter(e => e.amount < 20);
  const under20Total = under20Leaks.reduce((s, e) => s + e.amount, 0);
  if (under20Leaks.length > 0) {
    recommendations.push({
      icon: <Target className="h-5 w-5" />,
      text: `Small buys under $20 represent ${((under20Total / totalLeak) * 100).toFixed(0)}% of leaks`,
      subtext: `It's not the big items sinking the ship, it's the small ones you don't even notice.`,
      color: "border-blue-200 bg-blue-50 text-blue-950"
    });
  }

  // 3. Weekend logic
  const weekendLeaks = leaks.filter(e => {
    const day = new Date(e.date).getDay();
    return day === 0 || day === 6; // Sun or Sat
  });
  const weekdayLeaks = leaks.filter(e => {
    const day = new Date(e.date).getDay();
    return day !== 0 && day !== 6;
  });
  
  if (weekendLeaks.length > weekdayLeaks.length) {
    recommendations.push({
      icon: <Calendar className="h-5 w-5" />,
      text: `Weekend leaks are higher than weekdays`,
      subtext: `Your spending resistance drops significantly on Saturday and Sunday.`,
      color: "border-slate-200 bg-slate-50 text-slate-950"
    });
  }

  // 4. Top 3 concentration
  const top3Leaks = sortedCatLeaks.slice(0, 3).reduce((s, [_, a]) => s + a, 0);
  if (sortedCatLeaks.length >= 3) {
    recommendations.push({
      icon: <PieChart className="h-5 w-5" />,
      text: `Top 3 categories are ${((top3Leaks / totalLeak) * 100).toFixed(0)}% of your leakage`,
      subtext: `Focus your willpower solely on these sectors for a 0 to 70 impact.`,
      color: "border-green-200 bg-green-50 text-green-950"
    });
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2 block">Behavioral Analysis</span>
        <h1 className="text-4xl font-serif font-black tracking-tight text-slate-900">Leak Analysis</h1>
        <p className="text-slate-500 font-medium">Turning raw transaction data into behavioral insights.</p>
      </header>

      {/* Behavioral Score & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-50 overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${score}%` }}
               className="h-full bg-slate-900"
             />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Leak Control Score</p>
          <div className="relative">
            <svg className="h-32 w-32 -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                <motion.circle 
                    cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.4" 
                    initial={{ strokeDashoffset: 364.4 }}
                    animate={{ strokeDashoffset: 364.4 * (1 - score/100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-slate-900" 
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-serif font-black">{score}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">/ 100</span>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 mt-6 leading-relaxed px-4">
            {score > 80 ? "Premium intentionality level. Your spending logic is robust." : 
             score > 50 ? "Balanced spending. Minor behavioral leaks detected." : 
             "Attention required. Your spending habits are bypassing your intentional filters."}
          </p>
        </div>

        {/* Summary Mini Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <SummaryCard label="Total Leak" value={`$${totalLeak.toFixed(2)}`} color="text-orange-600 bg-orange-50" icon={<TrendingDown className="h-4 w-4" />} />
          <SummaryCard label="Leak Count" value={leaks.length.toString()} color="text-slate-900 bg-slate-100" icon={<Target className="h-4 w-4" />} />
          <SummaryCard label="Avg. Leak" value={`$${avgLeak.toFixed(2)}`} color="text-slate-600 bg-slate-50" icon={<Zap className="h-4 w-4" />} />
          <SummaryCard label="Biggest Leak" value={biggestLeak ? `$${biggestLeak.amount.toFixed(2)}` : '$0.00'} subtitle={biggestLeak?.category} color="text-slate-900 bg-slate-900 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-serif font-black text-slate-900">Leak Breakdown</h3>
              <p className="text-sm text-slate-400">Leaked capital by sector.</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-2xl">
              <PieChart className="h-5 w-5 text-slate-400" />
            </div>
          </div>
          
          <div className="space-y-6 flex-1">
            {sortedCatLeaks.map(([cat, amt]) => (
              <div key={cat} className="group cursor-default">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">{((amt / totalLeak) * 100).toFixed(1)}%</span>
                    <span className="font-bold text-slate-900">{cat}</span>
                  </div>
                  <span className="font-serif font-black text-slate-900">${amt.toFixed(2)}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(amt / totalLeak) * 100}%` }}
                    className="h-full bg-slate-900 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations Engine */}
        <section className="space-y-4">
          <div className="px-2 flex items-center gap-3 mb-4">
            <Lightbulb className="h-5 w-5 text-orange-500" />
            <h3 className="text-xl font-serif font-black text-slate-900">Recommendations</h3>
          </div>
          <div className="grid gap-4">
            {recommendations.map((rec, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-[32px] border ${rec.color.split(' ')[0]} ${rec.color.split(' ')[1]} transition-all hover:scale-[1.02] cursor-default`}
              >
                <div className="flex gap-4">
                   <div className="mt-1">{rec.icon}</div>
                   <div>
                    <h5 className="font-bold text-slate-900 text-sm leading-tight mb-1">{rec.text}</h5>
                    <p className="text-xs opacity-70 font-medium leading-relaxed">{rec.subtext}</p>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Leak Transaction List */}
      <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-serif font-black text-slate-900">Leak Feed</h3>
            <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">Newest First</span>
        </div>
        <div className="grid gap-3">
          {leaks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item) => (
            <div key={item.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[28px] border border-transparent hover:border-slate-200 transition-all group">
              <div className="flex items-center gap-5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black ouch-gradient-${item.ouchFactor} shadow-sm border border-white/40 text-white`}>
                  {item.ouchFactor}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">{item.category}</h5>
                  {item.note && <p className="text-xs text-slate-500 font-medium">{item.note}</p>}
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-serif font-black text-slate-900">${item.amount.toFixed(2)}</p>
                <div className="flex items-center gap-1 justify-end mt-1">
                    <AlertCircle className="h-3 w-3 text-orange-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Leak</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const SummaryCard = ({ label, value, subtitle, color, icon }: any) => (
  <div className={`p-8 rounded-[40px] flex flex-col justify-between min-h-[160px] relative overflow-hidden transition-all hover:shadow-lg ${color.includes('text-white') ? color : 'bg-white border border-slate-100 shadow-sm'}`}>
    <div className="flex justify-between items-start">
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${color.includes('text-white') ? 'text-slate-400' : 'text-slate-400'}`}>{label}</p>
        {icon && <div className="p-2 bg-slate-50/10 rounded-xl">{icon}</div>}
    </div>
    <div className="mt-4">
      <h4 className={`text-3xl font-serif font-black ${color.includes('text-white') ? 'text-white' : color.split(' ')[0]}`}>{value}</h4>
      {subtitle && <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500 truncate mt-1 bg-slate-50 inline-block px-2 py-0.5 rounded-full border border-slate-100">{subtitle}</p>}
    </div>
  </div>
);

