"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Issue = {
  id: string;
  title: string;
  category: "Pothole" | "Streetlight" | "Garbage" | "Water";
  location: string;
  status: "Open" | "In Progress" | "Resolved";
  votes: number;
  date: string;
  image: string;
};

// --- Mock Sanity Client ---
const mockSanityFetch = async () => {
  return [
    { id: "1", title: "Large Pothole on Main St", category: "Pothole", location: "123 Main St, Downtown", status: "In Progress", votes: 45, date: "2 days ago", image: "🚧" },
    { id: "2", title: "Streetlight not working", category: "Streetlight", location: "Oak Ave & 5th St", status: "Open", votes: 12, date: "5 hours ago", image: "💡" },
    { id: "3", title: "Garbage pile uncollected", category: "Garbage", location: "Behind Station Mall", status: "Resolved", votes: 89, date: "1 week ago", image: "🗑️" },
    { id: "4", title: "Water Pipe Leak", category: "Water", location: "Park Road", status: "Open", votes: 156, date: "1 hour ago", image: "💧" },
    { id: "5", title: "Deep pothole near school", category: "Pothole", location: "Elm St", status: "Open", votes: 34, date: "1 day ago", image: "🚧" },
  ] as Issue[];
};

export default function SmartCityHup() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState<"All" | "Open" | "Resolved">("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  
  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState<Issue["category"]>("Pothole");
  const [newLoc, setNewLoc] = useState("");

  useEffect(() => {
    mockSanityFetch().then(setIssues);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleVote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIssues(issues.map(iss => iss.id === id ? { ...iss, votes: iss.votes + 1 } : iss));
    showToast("Upvoted issue!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLoc) return;

    let emoji = "🚧";
    if (newCat === "Streetlight") emoji = "💡";
    if (newCat === "Garbage") emoji = "🗑️";
    if (newCat === "Water") emoji = "💧";

    const newIssue: Issue = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCat,
      location: newLoc,
      status: "Open",
      votes: 1,
      date: "Just now",
      image: emoji,
    };

    setIssues([newIssue, ...issues]);
    setModalOpen(false);
    setNewTitle("");
    setNewLoc("");
    showToast("Issue reported successfully to the municipality!");
  };

  const filteredIssues = issues.filter((iss) => {
    if (filter === "Open" && iss.status !== "Open") return false;
    if (filter === "Resolved" && iss.status !== "Resolved") return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      
      {/* Navbar */}
      <nav className="bg-rose-600 text-white p-4 shadow-md sticky top-0 z-40 flex justify-between items-center">
        <div className="text-xl font-black italic tracking-wide">
          CityFix.
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-white text-rose-600 px-4 py-2 rounded-full font-bold text-sm shadow hover:bg-rose-50 hover:scale-105 transition-all"
        >
          + Report Issue
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        
        {/* Stats Header */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <div className="text-3xl font-black text-rose-600">{issues.length}</div>
            <div className="text-xs text-slate-500 font-bold uppercase mt-1">Total Reports</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <div className="text-3xl font-black text-amber-500">{issues.filter(i => i.status==="Open").length}</div>
            <div className="text-xs text-slate-500 font-bold uppercase mt-1">Open Issues</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <div className="text-3xl font-black text-emerald-500">{issues.filter(i => i.status==="Resolved").length}</div>
            <div className="text-xs text-slate-500 font-bold uppercase mt-1">Resolved</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-lg inline-flex shadow-sm border border-slate-100">
          {(["All", "Open", "Resolved"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${filter === f ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredIssues.map(iss => (
              <motion.div
                key={iss.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex gap-4 items-start"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-3xl shrink-0 border border-slate-100 shadow-inner">
                  {iss.image}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg leading-tight">{iss.title}</h3>
                    <StatusBadge status={iss.status} />
                  </div>
                  
                  <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
                    <span className="text-rose-500">📍</span> {iss.location}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                    <span className="bg-slate-100 px-2 py-1 rounded-md">{iss.category}</span>
                    <span>{iss.date}</span>
                  </div>
                </div>

                <button 
                  onClick={(e) => handleVote(iss.id, e)}
                  className="flex flex-col items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-2 rounded-xl transition"
                >
                  <span className="text-lg">⬆</span>
                  <span className="font-black mt-1">{iss.votes}</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </main>

      {/* Report Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl relative w-full max-w-md z-10"
            >
              <button 
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 hover:bg-slate-200"
              >✕</button>
              
              <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                <span className="text-rose-600">🚨</span> Report Issue
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Issue Title</label>
                  <input required value={newTitle} onChange={e=>setNewTitle(e.target.value)} type="text" placeholder="E.g. Broken streetlight" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition font-medium" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select required value={newCat} onChange={e=>setNewCat(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition font-medium appearance-none">
                    <option>Pothole</option>
                    <option>Streetlight</option>
                    <option>Garbage</option>
                    <option>Water</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location Details</label>
                  <input required value={newLoc} onChange={e=>setNewLoc(e.target.value)} type="text" placeholder="E.g. Opposite Central Park" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition font-medium" />
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-rose-600 text-white font-black text-lg py-4 rounded-xl hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/30 transition transform hover:-translate-y-1">
                    Submit Report →
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 mx-auto inset-x-0 w-fit bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl font-bold flex items-center gap-2 z-50 border border-slate-700"
          >
            ✅ {toast}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Resolved") return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">✅ Resolved</span>;
  if (status === "In Progress") return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">⏳ In Progress</span>;
  return <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">🚨 Open</span>;
}
