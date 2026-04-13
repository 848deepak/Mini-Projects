'use client';

import React, { useState, useEffect } from 'react';

// Interfaces mapping to our Spring Boot Entity
interface BankAccount {
  id: number;
  accountNumber: string;
  accountHolderName: string;
  balance: number;
  accountType: string;
}

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newHolderName, setNewHolderName] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [newType, setNewType] = useState('Savings');
  
  // Transaction states
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState('Deposit');
  const [txAccountId, setTxAccountId] = useState<number | null>(null);

  const API_URL = 'http://localhost:8080/api/accounts';

  const fetchAccounts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAccounts(data);
    } catch (e) {
      console.error('API Error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(API_URL + '/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          accountHolderName: newHolderName, 
          balance: parseFloat(newBalance), 
          accountType: newType 
        })
      });
      setNewHolderName('');
      setNewBalance('');
      fetchAccounts();
    } catch (e) { console.error(e); }
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAccountId) return;
    try {
      await fetch(`${API_URL}/transaction/${txAccountId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: txType,
          amount: parseFloat(txAmount)
        })
      });
      setTxAmount('');
      setTxAccountId(null);
      fetchAccounts();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12 animate-fade-in-down">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight gradient-text">NextGen Vault</h1>
          <p className="text-slate-400 mt-2 tracking-wide text-sm font-medium">FINANCIAL OPERATIONS COMMAND CENTER</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-6 py-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sm font-bold text-slate-200">System Secure</span>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Actions */}
        <div className="flex flex-col gap-8">
          
          {/* Create Account Module */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-border pb-4">Initialize New Account</h2>
            <form onSubmit={handleCreateAccount} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Account Holder</label>
                <input 
                  type="text" required 
                  value={newHolderName} onChange={e => setNewHolderName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g. John Doe" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Initial Deposit</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400">$</span>
                    <input 
                      type="number" required min="100" step="0.01"
                      value={newBalance} onChange={e => setNewBalance(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Type</label>
                  <select 
                    value={newType} onChange={e => setNewType(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option>Savings</option>
                    <option>Checking</option>
                    <option>Business</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95 uppercase tracking-wide text-sm mt-4">
                Generate Account
              </button>
            </form>
          </div>

          {/* Transaction Module */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-border pb-4">Execute Transfer</h2>
            <form onSubmit={handleTransaction} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Select Target Account</label>
                <select 
                  required
                  value={txAccountId || ''} 
                  onChange={e => setTxAccountId(Number(e.target.value))}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>-- Authenticate Account --</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountNumber} ({acc.accountHolderName})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Operation</label>
                  <select 
                    value={txType} onChange={e => setTxType(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                  >
                    <option className="text-emerald-400">Deposit</option>
                    <option className="text-rose-400">Withdraw</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Amount</label>
                  <input 
                    type="number" required min="1" step="0.01"
                    value={txAmount} onChange={e => setTxAmount(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="$ 0.00" 
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-100 hover:bg-white text-slate-900 font-extrabold py-3 rounded-lg shadow-lg shadow-white/10 transition-all active:scale-95 uppercase tracking-widest text-sm mt-4">
                Execute Security Protocol Protocol
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Active Ledger */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-border pb-4 flex justify-between items-center">
              <span>Active Ledger</span>
              <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
                {accounts.length} ACCOUNTS DETECTED
              </span>
            </h2>

            {loading ? (
              <div className="flex-grow flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : accounts.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-800/20">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                <p className="tracking-wide">Ledger is currently empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max overflow-y-auto pr-2 pb-4">
                {accounts.map((acc, index) => (
                  <div key={acc.id} className="group relative bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 rounded-xl p-5 transition-all hover:border-blue-500/30 overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/20 group-hover:via-purple-600/20 group-hover:to-blue-600/20 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="relative z-10 flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-mono text-blue-400 mb-1">{acc.accountNumber}</p>
                        <h3 className="text-lg font-bold text-white tracking-wide">{acc.accountHolderName}</h3>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-bold bg-slate-700 text-slate-300 py-1 px-3 rounded text-center">
                        {acc.accountType}
                      </span>
                    </div>
                    
                    <div className="relative z-10">
                      <p className="text-sm text-slate-400 mb-1 font-medium">Available Collateral</p>
                      <p className="text-3xl font-extrabold font-mono tracking-tight text-white">
                        <span className="text-slate-500 mr-1">$</span>
                        {acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
