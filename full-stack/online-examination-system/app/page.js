"use client";
import { useState, useEffect, useCallback, useRef } from "react";

// ─── Seed Data ───
const CREDENTIALS = {
  admin: { id: "admin", password: "admin123", name: "Prof. Sharma", role: "admin" },
  student: { id: "stu001", password: "pass", name: "Deepak Pandey", role: "student" },
};

const QUESTION_BANK = [
  // DSA
  { id: 1, subject: "Data Structures", text: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1, marks: 2 },
  { id: 2, subject: "Data Structures", text: "Which data structure uses LIFO order?", options: ["Queue", "Stack", "Linked List", "Tree"], correct: 1, marks: 2 },
  { id: 3, subject: "Data Structures", text: "What is the worst-case time complexity of quicksort?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], correct: 2, marks: 2 },
  { id: 4, subject: "Data Structures", text: "A binary tree with n nodes has ___ null links.", options: ["n-1", "n+1", "2n", "n/2"], correct: 1, marks: 2 },
  { id: 5, subject: "Data Structures", text: "Which traversal of BST gives sorted order?", options: ["Preorder", "Postorder", "Inorder", "Level-order"], correct: 2, marks: 2 },
  // DBMS
  { id: 6, subject: "DBMS", text: "Which normal form removes partial dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], correct: 1, marks: 2 },
  { id: 7, subject: "DBMS", text: "What does ACID stand for in database transactions?", options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Consistency, Isolation, Data", "Atomicity, Clarity, Isolation, Durability", "All Correct In Database"], correct: 0, marks: 2 },
  { id: 8, subject: "DBMS", text: "Which SQL command removes a table from the database?", options: ["DELETE TABLE", "REMOVE TABLE", "DROP TABLE", "DESTROY TABLE"], correct: 2, marks: 2 },
  { id: 9, subject: "DBMS", text: "A foreign key references:", options: ["The same table", "A primary key of another table", "Any column", "An index"], correct: 1, marks: 2 },
  { id: 10, subject: "DBMS", text: "Which join returns all rows from both tables?", options: ["INNER JOIN", "LEFT JOIN", "FULL OUTER JOIN", "CROSS JOIN"], correct: 2, marks: 2 },
  // OS
  { id: 11, subject: "Operating Systems", text: "Which scheduling algorithm is non-preemptive?", options: ["Round Robin", "SJF", "FCFS", "Priority (preemptive)"], correct: 2, marks: 2 },
  { id: 12, subject: "Operating Systems", text: "Deadlock requires how many necessary conditions?", options: ["2", "3", "4", "5"], correct: 2, marks: 2 },
  { id: 13, subject: "Operating Systems", text: "What does a semaphore value of 0 mean?", options: ["Resource is free", "No process waiting", "Resource is occupied", "Error state"], correct: 2, marks: 2 },
  { id: 14, subject: "Operating Systems", text: "Which page replacement algorithm is optimal?", options: ["FIFO", "LRU", "Optimal", "Clock"], correct: 2, marks: 2 },
  { id: 15, subject: "Operating Systems", text: "Thrashing occurs when:", options: ["CPU is idle", "Too many page faults", "Memory is full", "Disk fails"], correct: 1, marks: 2 },
  // Networks
  { id: 16, subject: "Networks", text: "HTTP operates at which OSI layer?", options: ["Transport", "Network", "Application", "Session"], correct: 2, marks: 2 },
  { id: 17, subject: "Networks", text: "What protocol resolves IP to MAC addresses?", options: ["DNS", "ARP", "DHCP", "ICMP"], correct: 1, marks: 2 },
  { id: 18, subject: "Networks", text: "TCP is a ___ protocol.", options: ["Connectionless", "Connection-oriented", "Stateless", "Broadcast"], correct: 1, marks: 2 },
  { id: 19, subject: "Networks", text: "Subnet mask 255.255.255.0 means ___ host bits.", options: ["8", "16", "24", "32"], correct: 0, marks: 2 },
  { id: 20, subject: "Networks", text: "Which protocol uses port 443?", options: ["HTTP", "FTP", "HTTPS", "SSH"], correct: 2, marks: 2 },
];

const SEED_EXAMS = [
  { id: 1, title: "DSA Mid-Term", subject: "Data Structures", duration: 15, questions: [1,2,3,4,5], totalMarks: 10, status: "published" },
  { id: 2, title: "DBMS Quiz 1", subject: "DBMS", duration: 10, questions: [6,7,8,9,10], totalMarks: 10, status: "published" },
  { id: 3, title: "OS Final Exam", subject: "Operating Systems", duration: 20, questions: [11,12,13,14,15], totalMarks: 10, status: "draft" },
  { id: 4, title: "Networks Assessment", subject: "Networks", duration: 10, questions: [16,17,18,19,20], totalMarks: 10, status: "published" },
];

// ─── Helpers ───
function getLS(k, fb) { if (typeof window === "undefined") return fb; const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; }
function setLS(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function initData() { if (typeof window === "undefined") return; if (!localStorage.getItem("oes_init")) { setLS("oes_exams", SEED_EXAMS); setLS("oes_results", []); localStorage.setItem("oes_init", "true"); } }

// ─── Main App ───
export default function ExamApp() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => { initData(); setReady(true); const s = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("oes_session") || "null") : null; setSession(s); }, []);

  function login(role, id, pass) {
    const cred = CREDENTIALS[role];
    if (id === cred.id && pass === cred.password) { const s = { ...cred }; sessionStorage.setItem("oes_session", JSON.stringify(s)); setSession(s); return true; }
    return false;
  }

  function logout() { sessionStorage.removeItem("oes_session"); setSession(null); }

  if (!ready) return null;
  if (!session) return <LoginPage onLogin={login} />;
  if (session.role === "admin") return <AdminDashboard session={session} onLogout={logout} />;
  return <StudentDashboard session={session} onLogout={logout} />;
}

// ─── Login ───
function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>📝 Online Exam</h1>
        <p>Secure Online Examination System</p>
        <div className="role-tabs">
          <button className={`role-tab ${role === "admin" ? "active" : ""}`} onClick={() => setRole("admin")}>Admin</button>
          <button className={`role-tab ${role === "student" ? "active" : ""}`} onClick={() => setRole("student")}>Student</button>
        </div>
        <div className="form-group"><label>ID</label><input className="input" value={id} onChange={e => setId(e.target.value)} placeholder={role === "admin" ? "admin" : "stu001"} /></div>
        <div className="form-group"><label>Password</label><input className="input" type="password" value={pass} onChange={e => setPass(e.target.value)} /></div>
        {err && <p style={{color:"var(--danger)",fontSize:13,marginBottom:8}}>{err}</p>}
        <button className="btn btn-primary btn-block" onClick={() => { if (!onLogin(role, id, pass)) setErr("Invalid credentials"); }}>Login as {role === "admin" ? "Admin" : "Student"}</button>
        <div className="hint">Admin: <code>admin / admin123</code> · Student: <code>stu001 / pass</code></div>
      </div>
    </div>
  );
}

// ─── Admin ───
function AdminDashboard({ session, onLogout }) {
  const [page, setPage] = useState("exams");
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => { setExams(getLS("oes_exams", [])); setResults(getLS("oes_results", [])); }, [page]);

  const NAV = [
    { id: "exams", icon: "📋", label: "Manage Exams" },
    { id: "results", icon: "📊", label: "Results" },
    { id: "questions", icon: "❓", label: "Question Bank" },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">📝 Exam<span>Portal</span></div>
        {NAV.map(n => <button key={n.id} className={`nav-btn ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>{n.icon} {n.label}</button>)}
        <div className="sidebar-footer"><button className="logout-btn" onClick={onLogout}>🚪 Logout</button></div>
      </aside>
      <main className="main">
        <div className="page-header"><h1>{page === "exams" ? "Manage Exams" : page === "results" ? "Results" : "Question Bank"}</h1></div>
        {page === "exams" && (
          <div className="card">
            <table>
              <thead><tr><th>Title</th><th>Subject</th><th>Duration</th><th>Questions</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {exams.map(e => (
                  <tr key={e.id}>
                    <td><strong>{e.title}</strong></td><td>{e.subject}</td><td>{e.duration} min</td><td>{e.questions.length}</td>
                    <td><span className={`badge ${e.status === "published" ? "badge-success" : "badge-warning"}`}>{e.status}</span></td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => { const ex = getLS("oes_exams", []); const i = ex.findIndex(x => x.id === e.id); ex[i].status = ex[i].status === "published" ? "draft" : "published"; setLS("oes_exams", ex); setExams([...ex]); }}>
                        {e.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {page === "results" && (
          <div className="card">
            {results.length === 0 ? <div className="empty-state">No results yet</div> :
            <table>
              <thead><tr><th>Student</th><th>Exam</th><th>Score</th><th>Percentage</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i}>
                    <td>{r.studentName}</td><td>{r.examTitle}</td>
                    <td><strong>{r.score}/{r.totalMarks}</strong></td>
                    <td>{r.percentage}%</td>
                    <td><span className={`badge ${r.percentage >= 40 ? "badge-success" : "badge-danger"}`}>{r.percentage >= 40 ? "Pass" : "Fail"}</span></td>
                    <td>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>}
          </div>
        )}
        {page === "questions" && (
          <div className="card">
            <table>
              <thead><tr><th>#</th><th>Subject</th><th>Question</th><th>Correct</th><th>Marks</th></tr></thead>
              <tbody>
                {QUESTION_BANK.map(q => (
                  <tr key={q.id}><td>{q.id}</td><td><span className="badge badge-info">{q.subject}</span></td><td>{q.text}</td><td>{q.options[q.correct]}</td><td>{q.marks}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Student ───
function StudentDashboard({ session, onLogout }) {
  const [page, setPage] = useState("exams");
  const [activeExam, setActiveExam] = useState(null);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => { setExams(getLS("oes_exams", []).filter(e => e.status === "published")); setResults(getLS("oes_results", []).filter(r => r.studentId === session.userId)); }, [page, session]);

  if (activeExam) return <ExamTaker exam={activeExam} session={session} onFinish={() => { setActiveExam(null); setPage("results"); }} />;

  const NAV = [
    { id: "exams", icon: "📝", label: "Available Exams" },
    { id: "results", icon: "📊", label: "My Results" },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">📝 Exam<span>Portal</span></div>
        {NAV.map(n => <button key={n.id} className={`nav-btn ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>{n.icon} {n.label}</button>)}
        <div className="sidebar-footer"><button className="logout-btn" onClick={onLogout}>🚪 Logout</button></div>
      </aside>
      <main className="main">
        {page === "exams" && (
          <>
            <div className="page-header"><h1>Available Exams</h1></div>
            <div className="exam-cards">
              {exams.map(e => {
                const taken = getLS("oes_results", []).some(r => r.examId === e.id && r.studentId === session.userId);
                return (
                  <div key={e.id} className="exam-tile" onClick={() => !taken && setActiveExam(e)}>
                    <h3>{e.title}</h3>
                    <p>{e.subject}</p>
                    <div className="meta">
                      <span className="badge badge-info">{e.duration} min</span>
                      <span className="badge badge-info">{e.questions.length} Q</span>
                      <span className="badge badge-info">{e.totalMarks} marks</span>
                    </div>
                    <div style={{marginTop:12}}>
                      {taken ? <span className="badge badge-success">✓ Completed</span> : <button className="btn btn-primary btn-sm">Start Exam →</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {page === "results" && (
          <>
            <div className="page-header"><h1>My Results</h1></div>
            <div className="card">
              {results.length === 0 ? <div className="empty-state">No exams taken yet</div> :
              <table>
                <thead><tr><th>Exam</th><th>Score</th><th>%</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i}><td>{r.examTitle}</td><td><strong>{r.score}/{r.totalMarks}</strong></td><td>{r.percentage}%</td>
                    <td><span className={`badge ${r.percentage >= 40 ? "badge-success" : "badge-danger"}`}>{r.percentage >= 40 ? "Pass" : "Fail"}</span></td>
                    <td>{r.date}</td></tr>
                  ))}
                </tbody>
              </table>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ─── Exam Taker (timed, anti-cheat) ───
function ExamTaker({ exam, session, onFinish }) {
  const questions = exam.questions.map(qid => QUESTION_BANK.find(q => q.id === qid)).filter(Boolean);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [violations, setViolations] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const timerRef = useRef();

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); submitExam(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Anti-cheat: tab switch detection
  useEffect(() => {
    function onBlur() { setViolations(v => v + 1); }
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  function selectOption(qid, optIdx) {
    setAnswers(a => ({ ...a, [qid]: optIdx }));
  }

  function submitExam() {
    clearInterval(timerRef.current);
    let score = 0;
    questions.forEach(q => { if (answers[q.id] === q.correct) score += q.marks; });
    const pct = Math.round((score / exam.totalMarks) * 100);
    const result = {
      examId: exam.id, examTitle: exam.title, studentId: session.userId || session.id, studentName: session.name,
      score, totalMarks: exam.totalMarks, percentage: pct, violations, date: new Date().toISOString().split("T")[0],
    };
    const results = getLS("oes_results", []);
    results.push(result);
    setLS("oes_results", results);
    setShowResult(result);
  }

  if (showResult) {
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:showResult.percentage >= 40 ? "#f0fdf4" : "#fef2f2"}}>
        <div className="result-card" style={{maxWidth:500,width:"90%"}}>
          <h2>{showResult.examTitle}</h2>
          <div className={`result-score ${showResult.percentage >= 40 ? "pass" : "fail"}`}>{showResult.percentage}%</div>
          <p style={{fontSize:18,marginBottom:8}}>Score: <strong>{showResult.score}/{showResult.totalMarks}</strong></p>
          <p style={{color:"var(--text-sec)"}}>
            {showResult.percentage >= 40 ? "🎉 Congratulations, you passed!" : "📚 Better luck next time!"}
          </p>
          {showResult.violations > 0 && <p style={{color:"var(--danger)",fontSize:13,marginTop:8}}>⚠️ Tab-switch violations: {showResult.violations}</p>}
          <button className="btn btn-primary btn-lg" style={{marginTop:20}} onClick={onFinish}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const mm = Math.floor(timeLeft / 60);
  const ss = String(timeLeft % 60).padStart(2, "0");

  return (
    <div style={{background:"#f8fafc",minHeight:"100vh",padding:20}}>
      <div className="exam-container">
        {violations > 0 && <div className="anti-cheat-warning">⚠️ Tab switch detected ({violations} time{violations > 1 ? "s" : ""}). This will be reported.</div>}
        <div className="exam-header">
          <div><strong>{exam.title}</strong><br/><span style={{fontSize:12,color:"var(--text-sec)"}}>Q {idx+1} of {questions.length}</span></div>
          <div className={`timer ${timeLeft < 60 ? "warn" : ""}`}>{mm}:{ss}</div>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{width:`${((idx+1)/questions.length)*100}%`}}></div></div>
        <div style={{marginTop:12}}>
          <div className="q-dots">
            {questions.map((qq, i) => (
              <div key={i} className={`q-dot ${answers[qq.id] !== undefined ? "answered" : ""} ${i === idx ? "current" : ""}`} onClick={() => setIdx(i)}>{i+1}</div>
            ))}
          </div>
        </div>
        <div className="question-card">
          <div className="q-number">Question {idx+1} · {q.marks} marks</div>
          <div className="q-text">{q.text}</div>
          <div className="options">
            {q.options.map((opt, oi) => (
              <div key={oi} className={`option ${answers[q.id] === oi ? "selected" : ""}`} onClick={() => selectOption(q.id, oi)}>
                <div className="option-letter">{String.fromCharCode(65 + oi)}</div>
                {opt}
              </div>
            ))}
          </div>
        </div>
        <div className="q-nav">
          <button className="btn btn-outline" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>← Previous</button>
          {idx < questions.length - 1
            ? <button className="btn btn-primary" onClick={() => setIdx(i => i + 1)}>Next →</button>
            : <button className="btn btn-success btn-lg" onClick={submitExam}>Submit Exam ✓</button>}
        </div>
      </div>
    </div>
  );
}
