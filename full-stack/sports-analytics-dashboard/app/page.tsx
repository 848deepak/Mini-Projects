"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type PlayerStat = {
  id: string;
  name: string;
  team: string;
  points: number;
  assists: number;
  rebounds: number;
  efficiency: number;
  recentGames: number[];
};

// --- Mock Sanity Client ---
const mockSanityFetch = async () => {
  return [
    { id: "1", name: "Virat Kohli", team: "RCB", points: 85, assists: 0, rebounds: 0, efficiency: 92.5, recentGames: [45, 85, 12, 114, 55] },
    { id: "2", name: "MS Dhoni", team: "CSK", points: 42, assists: 0, rebounds: 0, efficiency: 88.0, recentGames: [20, 42, 15, 60, 30] },
    { id: "3", name: "Rohit Sharma", team: "MI", points: 76, assists: 0, rebounds: 0, efficiency: 90.1, recentGames: [10, 76, 25, 80, 45] },
    { id: "4", name: "Jasprit Bumrah", team: "MI", points: 0, assists: 4, rebounds: 0, efficiency: 95.0, recentGames: [1, 4, 2, 3, 2] },
  ] as PlayerStat[];
};

export default function SportsAnalytics() {
  const [stats, setStats] = useState<PlayerStat[]>([]);

  useEffect(() => {
    mockSanityFetch().then(setStats);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans min-h-screen">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            Sports<span className="text-blue-500">Analytics</span>
          </h1>
          <p className="text-slate-400 font-medium">Real-time performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition">Export Data</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KPI Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          {[
            { label: "Total Matches", value: "142", trend: "+12%" },
            { label: "Avg Efficiency", value: "88.9", trend: "+2.4%" },
            { label: "Top Scorer", value: "V. Kohli", trend: "" },
            { label: "Total Wickets", value: "85", trend: "-5%" },
          ].map((kpi, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl"
            >
              <div className="text-sm font-bold text-slate-500 uppercase mb-2">{kpi.label}</div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-black text-white">{kpi.value}</div>
                {kpi.trend && (
                  <div className={`text-sm font-bold ${kpi.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {kpi.trend}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Player Stats Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-hidden">
          <h2 className="text-xl font-bold text-white mb-6">Top Performers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-500 uppercase border-b border-slate-800">
                  <th className="pb-3 px-4">Player</th>
                  <th className="pb-3 px-4">Team</th>
                  <th className="pb-3 px-4 text-right">Score/W</th>
                  <th className="pb-3 px-4 text-right">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {stats.map((player, i) => (
                  <motion.tr 
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="hover:bg-slate-800/50 transition cursor-pointer"
                  >
                    <td className="py-4 px-4 font-bold text-slate-200">{player.name}</td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded font-mono">{player.team}</span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-blue-400">
                      {player.points || player.assists}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-mono">{player.efficiency}</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${player.efficiency}%` }}></div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Visualization Placeholder */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Recent Form</h2>
          <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-auto pb-4">
            {stats[0]?.recentGames.map((val, i) => (
              <div key={i} className="w-full flex justify-center h-full items-end group relative">
                <div className="absolute -top-8 bg-blue-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none">
                  {val} Runs
                </div>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / 120) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="w-full max-w-[40px] bg-gradient-to-t from-blue-900 to-blue-500 rounded-t-sm hover:brightness-125 transition"
                />
              </div>
            ))}
          </div>
          <div className="text-center text-sm font-bold text-slate-500 mt-2">V. Kohli (Last 5 Innings)</div>
        </div>

      </div>
    </div>
  );
}
