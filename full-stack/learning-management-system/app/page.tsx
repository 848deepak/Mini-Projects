"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Lesson = {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
};

type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type Course = {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  modules: Module[];
};

// --- Mock Sanity Client ---
const mockSanityFetch = async () => {
  return [
    {
      id: "course-1",
      title: "Advanced TypeScript Patterns",
      instructor: "Matt Pocock",
      progress: 35,
      modules: [
        {
          id: "m1",
          title: "Introduction to Type Inference",
          lessons: [
            { id: "l1", title: "Basic Inference", duration: "12:05", completed: true },
            { id: "l2", title: "Inference Limitations", duration: "08:30", completed: true },
            { id: "l3", title: "Working with Generics", duration: "15:45", completed: true },
          ]
        },
        {
          id: "m2",
          title: "Conditional Types",
          lessons: [
            { id: "l4", title: "What are Conditional Types?", duration: "10:20", completed: false },
            { id: "l5", title: "The 'infer' Keyword", duration: "22:15", completed: false },
            { id: "l6", title: "Mapped Types & Conditionals", duration: "18:00", completed: false },
          ]
        }
      ]
    }
  ] as Course[];
};

export default function LMSApp() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    mockSanityFetch().then((data) => {
      setCourses(data);
      if (data.length > 0) {
        setActiveCourse(data[0]);
        // Set first uncompleted lesson as active
        const firstMod = data[0].modules[1];
        if (firstMod) setActiveLesson(firstMod.lessons[0]);
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const markComplete = () => {
    if (!activeCourse || !activeLesson) return;

    const updatedCourse = { ...activeCourse };
    updatedCourse.modules.forEach(m => {
      m.lessons.forEach(l => {
        if (l.id === activeLesson.id) {
          l.completed = true;
        }
      });
    });

    // Recalculate progress
    let total = 0;
    let comp = 0;
    updatedCourse.modules.forEach(m => {
      m.lessons.forEach(l => {
        total++;
        if (l.completed) comp++;
      });
    });
    updatedCourse.progress = Math.round((comp / total) * 100);

    setActiveCourse(updatedCourse);
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    showToast(`Completed: ${activeLesson.title} 🎉`);
    
    // Auto-advance
    let foundCurrent = false;
    let nextFound = false;
    for (const m of updatedCourse.modules) {
      for (const l of m.lessons) {
        if (foundCurrent && !l.completed) {
          setActiveLesson(l);
          nextFound = true;
          break;
        }
        if (l.id === activeLesson.id) {
          foundCurrent = true;
        }
      }
      if (nextFound) break;
    }
  };

  if (!activeCourse || !activeLesson) return <div className="p-10 text-center font-bold text-slate-500">Loading Course...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Topbar */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            LMS Platform
          </div>
          <div className="h-4 w-px bg-slate-700"></div>
          <h1 className="text-sm font-semibold text-slate-300">{activeCourse.title}</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-48">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Course Progress</span>
              <span className="font-bold text-purple-400">{activeCourse.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${activeCourse.progress}%` }} 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm">
            DP
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        
        {/* Video Player Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="bg-black w-full aspect-video flex-shrink-0 flex items-center justify-center relative group">
            {/* Fake Video Player */}
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center flex-col">
              <span className="text-6xl mb-4 text-purple-500/80">▶️</span>
              <p className="font-bold text-slate-400">Simulated Video Player</p>
              <p className="text-sm text-slate-500 mt-2">"{activeLesson.title}"</p>
            </div>
            
            {/* Fake Controls */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center gap-4">
              <button className="text-white hover:text-purple-400">▶</button>
              <div className="h-1 flex-1 bg-slate-600 rounded cursor-pointer relative">
                <div className="absolute left-0 top-0 h-full bg-purple-500 rounded" style={{ width: "30%" }}></div>
              </div>
              <span className="text-xs font-mono">03:45 / {activeLesson.duration}</span>
              <button className="text-white hover:text-purple-400">⚙</button>
              <button className="text-white hover:text-purple-400">⛶</button>
            </div>
          </div>

          <div className="p-8 max-w-4xl w-full mx-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{activeLesson.title}</h2>
                <p className="text-slate-400 font-medium">Instructor: {activeCourse.instructor}</p>
              </div>
              
              {!activeLesson.completed && (
                <button 
                  onClick={markComplete}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-purple-900/40 transition transform active:scale-95 flex items-center gap-2"
                >
                  Mark as Complete <span className="bg-white/20 p-1 rounded">✓</span>
                </button>
              )}
              {activeLesson.completed && (
                <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-6 py-2.5 rounded-lg font-bold flex items-center gap-2">
                  Completed ✓
                </div>
              )}
            </div>

            <div className="prose prose-invert prose-purple max-w-none">
              <h3 className="text-xl font-bold text-white mb-4">Lesson Notes</h3>
              <p className="text-slate-300 leading-relaxed">
                In this lesson, we will cover the core principles of the topic. Ensure you have the exercise files downloaded before proceeding. If you have any questions, use the community forum.
              </p>
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mt-6">
                <code className="text-pink-400">const example = "Use the interactive editor for practice.";</code>
              </div>
            </div>
          </div>
        </div>

        {/* Course Syllabus Sidebar */}
        <aside className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-5 font-bold uppercase tracking-wider text-xs text-slate-500 border-b border-slate-800">
            Course Content
          </div>
          <div className="divide-y divide-slate-800/50">
            {activeCourse.modules.map((mod, modIdx) => (
              <div key={mod.id}>
                <div className="bg-slate-900 px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-slate-800 transition">
                  <h3 className="font-bold text-sm text-slate-200">
                    <span className="text-purple-400 mr-2">Section {modIdx + 1}:</span>
                    {mod.title}
                  </h3>
                </div>
                <div>
                  {mod.lessons.map(lesson => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full text-left px-5 py-3 flex gap-4 transition group ${
                        activeLesson.id === lesson.id 
                          ? "bg-purple-900/20 border-l-2 border-purple-500" 
                          : "border-l-2 border-transparent hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1 mt-0.5">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          lesson.completed 
                            ? "bg-emerald-500 border-emerald-500" 
                            : activeLesson.id === lesson.id 
                              ? "border-purple-500" 
                              : "border-slate-600"
                        }`}>
                          {lesson.completed && <span className="text-[10px] text-white absolute">✓</span>}
                        </div>
                      </div>
                      <div>
                        <div className={`text-sm font-medium mb-1 ${
                          activeLesson.id === lesson.id ? "text-purple-300" : "text-slate-300 group-hover:text-white"
                        }`}>
                          {lesson.title}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <span>⏱️ {lesson.duration}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 mx-auto inset-x-0 w-fit bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-full shadow-2xl shadow-black font-bold flex items-center gap-2 z-50"
          >
             {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
