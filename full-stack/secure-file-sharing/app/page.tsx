"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FileItem = {
  id: string;
  name: string;
  size: string;
  type: "folder" | "image" | "document" | "video" | "audio";
  date: string;
  shared: boolean;
};

// --- Mock Sanity Client ---
const mockSanityFetch = async () => {
  return [
    { id: "1", name: "Project Requirements.pdf", size: "2.4 MB", type: "document", date: "Apr 10, 2026", shared: true },
    { id: "2", name: "Marketing Assets", size: "--", type: "folder", date: "Apr 08, 2026", shared: false },
    { id: "3", name: "Design_System_v2.fig", size: "14.8 MB", type: "document", date: "Apr 05, 2026", shared: true },
    { id: "4", name: "Team_Offsite_2026.jpg", size: "5.2 MB", type: "image", date: "Mar 30, 2026", shared: false },
    { id: "5", name: "Q1_Financial_Report.xlsx", size: "1.1 MB", type: "document", date: "Mar 25, 2026", shared: false },
    { id: "6", name: "Demo_Recording.mp4", size: "124 MB", type: "video", date: "Mar 20, 2026", shared: true },
    { id: "7", name: "Client_Feedback", size: "--", type: "folder", date: "Mar 15, 2026", shared: false },
  ] as FileItem[];
};

export default function SecureFileSharing() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [search, setSearch] = useState("");
  const [viewState, setViewState] = useState<"all" | "shared" | "recent">("all");
  const [toast, setToast] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Initial fetch from "Sanity"
    mockSanityFetch().then((data) => setFiles(data));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: `Uploaded_File_${Math.floor(Math.random() * 1000)}.pdf`,
        size: "3.5 MB",
        type: "document",
        date: "Just now",
        shared: false,
      };
      setFiles([newFile, ...files]);
      setIsUploading(false);
      showToast("File uploaded and encrypted successfully! 🔒");
    }, 1500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "folder": return "📁";
      case "image": return "🖼️";
      case "video": return "🎥";
      case "audio": return "🎵";
      default: return "📄";
    }
  };

  const filteredFiles = files.filter((f) => {
    if (viewState === "shared" && !f.shared) return false;
    if (viewState === "recent" && f.date !== "Just now") return false; // Simulated recent filter
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex w-full h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col pt-8">
        <div className="px-6 mb-8 text-xl font-extrabold tracking-tight">
          Secure<span className="text-emerald-400">Share</span> 🔒
        </div>
        
        <button 
          onClick={handleUpload}
          disabled={isUploading}
          className="mx-6 mb-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2"
        >
          {isUploading ? "Uploading..." : "⊕ New Upload"}
        </button>

        <nav className="flex-1 px-3 space-y-1">
          <NavItem active={viewState==="all"} onClick={()=>setViewState("all")} icon="☁️" label="My Files" />
          <NavItem active={viewState==="shared"} onClick={()=>setViewState("shared")} icon="🤝" label="Shared with me" />
          <NavItem active={viewState==="recent"} onClick={()=>setViewState("recent")} icon="⏱️" label="Recent" />
        </nav>

        <div className="p-6">
          <div className="text-xs text-slate-400 font-bold uppercase mb-2">Storage</div>
          <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
            <div className="bg-emerald-400 h-2 rounded-full" style={{ width: "45%" }}></div>
          </div>
          <div className="text-xs text-slate-400">45 GB of 100 GB used</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="w-full max-w-xl">
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400">🔍</span>
              <input 
                type="text" 
                placeholder="Search encrypted files, folders..." 
                className="w-full bg-slate-100 placeholder-slate-400 text-slate-700 rounded-full py-2.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-200 transition"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
            DP
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold capitalize">
              {viewState === "all" ? "My Files" : viewState === "shared" ? "Shared with me" : "Recent"}
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-12 gap-4 border-b border-slate-100 p-4 text-xs font-bold text-slate-400 uppercase">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Date Modified</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-1 text-center">Shared</div>
            </div>

            <div className="divide-y divide-slate-50">
              <AnimatePresence>
                {filteredFiles.map((f) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition cursor-pointer group"
                  >
                    <div className="col-span-6 flex items-center gap-3">
                      <div className="text-2xl">{getIcon(f.type)}</div>
                      <span className="font-medium text-slate-800 group-hover:text-emerald-600 transition">
                        {f.name}
                      </span>
                    </div>
                    <div className="col-span-3 text-sm text-slate-500">{f.date}</div>
                    <div className="col-span-2 text-sm text-slate-500">{f.size}</div>
                    <div className="col-span-1 flex justify-center">
                      {f.shared && <span className="text-slate-400 text-lg">🤝</span>}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredFiles.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                  No files found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl font-medium z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: ()=>void, icon: string, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}
