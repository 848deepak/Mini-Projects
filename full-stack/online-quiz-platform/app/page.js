"use client";
import { useState, useEffect, useRef } from "react";

const QUIZZES = [
  { id: 1, title: "JavaScript Fundamentals", category: "Programming", difficulty: "Easy", timePerQ: 30, questions: [
    { text: "What is the output of typeof null?", options: ["null","undefined","object","number"], correct: 2 },
    { text: "Which method adds an element to the end of an array?", options: ["shift()","unshift()","push()","pop()"], correct: 2 },
    { text: "What does === check?", options: ["Value only","Type only","Value and type","Reference"], correct: 2 },
    { text: "Which is NOT a JavaScript data type?", options: ["Boolean","Float","String","Symbol"], correct: 1 },
    { text: "What does JSON.parse() do?", options: ["Converts object to string","Converts string to object","Validates JSON","Minifies JSON"], correct: 1 },
  ]},
  { id: 2, title: "Python Basics", category: "Programming", difficulty: "Easy", timePerQ: 25, questions: [
    { text: "How do you start a comment in Python?", options: ["//","#","/*","--"], correct: 1 },
    { text: "What is the output of len('hello')?", options: ["4","5","6","Error"], correct: 1 },
    { text: "Which keyword defines a function?", options: ["func","function","def","define"], correct: 2 },
    { text: "Python lists are:", options: ["Immutable","Ordered & mutable","Unordered","Fixed size"], correct: 1 },
    { text: "What does pip do?", options: ["Runs Python","Installs packages","Compiles code","Debugs"], correct: 1 },
  ]},
  { id: 3, title: "Database Concepts", category: "CS Theory", difficulty: "Medium", timePerQ: 35, questions: [
    { text: "SQL stands for:", options: ["Simple Query Language","Structured Query Language","Standard Query Logic","System Query Language"], correct: 1 },
    { text: "Which command retrieves data?", options: ["INSERT","UPDATE","SELECT","DELETE"], correct: 2 },
    { text: "A primary key must be:", options: ["Nullable","Unique","Foreign","Indexed only"], correct: 1 },
    { text: "NoSQL databases are:", options: ["Always relational","Schema-less","SQL-based","Row-oriented only"], correct: 1 },
    { text: "ACID stands for:", options: ["Atomicity, Consistency, Isolation, Durability","Always Connected In Database","Asynchronous, Concurrent, Isolated, Distributed","None"], correct: 0 },
  ]},
  { id: 4, title: "General Knowledge", category: "General", difficulty: "Easy", timePerQ: 20, questions: [
    { text: "What is the capital of Japan?", options: ["Seoul","Beijing","Tokyo","Bangkok"], correct: 2 },
    { text: "Who painted the Mona Lisa?", options: ["Picasso","Da Vinci","Michelangelo","Van Gogh"], correct: 1 },
    { text: "What is the largest planet?", options: ["Mars","Saturn","Jupiter","Neptune"], correct: 2 },
    { text: "H2O is the formula for:", options: ["Hydrogen peroxide","Heavy water","Water","Helium oxide"], correct: 2 },
    { text: "How many continents are there?", options: ["5","6","7","8"], correct: 2 },
  ]},
];

function getLS(k,fb){if(typeof window==="undefined")return fb;const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}
function setLS(k,v){localStorage.setItem(k,JSON.stringify(v));}

export default function QuizApp() {
  const [screen, setScreen] = useState("home"); // home, name, quiz, result
  const [playerName, setPlayerName] = useState("");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const timerRef = useRef();

  useEffect(() => { setLeaderboard(getLS("quiz_lb", [])); }, [screen]);

  function startQuiz(quiz) {
    setActiveQuiz(quiz); setQIdx(0); setAnswers({}); setTimeLeft(quiz.timePerQ * quiz.questions.length);
    if (playerName) { setScreen("quiz"); } else { setScreen("name"); }
  }

  function beginAfterName() { if (!playerName.trim()) return; setScreen("quiz"); }

  // Timer
  useEffect(() => {
    if (screen !== "quiz") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); finishQuiz(); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen]);

  function selectAnswer(qi, oi) { setAnswers(a => ({...a, [qi]: oi})); }

  function finishQuiz() {
    clearInterval(timerRef.current);
    let score = 0;
    activeQuiz.questions.forEach((q, i) => { if (answers[i] === q.correct) score++; });
    const pct = Math.round((score / activeQuiz.questions.length) * 100);
    const entry = { name: playerName, quiz: activeQuiz.title, score, total: activeQuiz.questions.length, pct, date: new Date().toISOString().split("T")[0] };
    const lb = getLS("quiz_lb", []);
    lb.push(entry); lb.sort((a,b) => b.pct - a.pct);
    setLS("quiz_lb", lb);
    setResult(entry); setScreen("result");
  }

  // ─── Screens ───
  if (screen === "name") return (
    <div className="result-page">
      <div className="result-card">
        <h2>🎮 Enter Your Name</h2>
        <div className="name-input" style={{marginTop:20}}>
          <input className="input" value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Your name" autoFocus />
        </div>
        <button className="btn btn-primary btn-lg" onClick={beginAfterName}>Start Quiz →</button>
      </div>
    </div>
  );

  if (screen === "quiz" && activeQuiz) {
    const q = activeQuiz.questions[qIdx];
    const mm = Math.floor(timeLeft / 60), ss = String(timeLeft % 60).padStart(2,"0");
    return (
      <div style={{background:"var(--bg)",minHeight:"100vh",padding:20}}>
        <div className="q-container">
          <div className="q-header">
            <div><strong>{activeQuiz.title}</strong><br/><span style={{fontSize:12,color:"var(--text-sec)"}}>Q {qIdx+1}/{activeQuiz.questions.length}</span></div>
            <div className={`timer ${timeLeft < 30 ? "warn" : ""}`}>{mm}:{ss}</div>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{width:`${((qIdx+1)/activeQuiz.questions.length)*100}%`}}></div></div>
          <div className="q-card" style={{marginTop:16}}>
            <div className="q-num">Question {qIdx+1}</div>
            <div className="q-text">{q.text}</div>
            <div className="options">
              {q.options.map((o,oi) => (
                <div key={oi} className={`option ${answers[qIdx] === oi ? "selected" : ""}`} onClick={() => selectAnswer(qIdx, oi)}>
                  <div className="opt-letter">{String.fromCharCode(65+oi)}</div>{o}
                </div>
              ))}
            </div>
          </div>
          <div className="q-nav">
            <button className="btn btn-outline" disabled={qIdx===0} onClick={() => setQIdx(i => i-1)}>← Prev</button>
            {qIdx < activeQuiz.questions.length - 1
              ? <button className="btn btn-primary" onClick={() => setQIdx(i=>i+1)}>Next →</button>
              : <button className="btn btn-success btn-lg" onClick={finishQuiz}>Submit ✓</button>}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "result" && result) return (
    <div className="result-page" style={{background: result.pct >= 60 ? "#f0fdf4" : "#fef2f2"}}>
      <div className="result-card">
        <h2>🏆 {result.quiz}</h2>
        <div className={`result-score ${result.pct >= 60 ? "pass" : "fail"}`}>{result.pct}%</div>
        <p style={{fontSize:18}}>{result.score}/{result.total} correct</p>
        <p style={{color:"var(--text-sec)",marginTop:8}}>{result.pct >= 80 ? "🌟 Excellent!" : result.pct >= 60 ? "👍 Good job!" : "📚 Keep practicing!"}</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:20}}>
          <button className="btn btn-outline" onClick={() => setScreen("home")}>← Home</button>
          <button className="btn btn-primary" onClick={() => startQuiz(activeQuiz)}>🔄 Retry</button>
        </div>
      </div>
    </div>
  );

  // ─── Home ───
  return (
    <div className="container">
      <div className="hero">
        <h1>🧠 QuizMaster</h1>
        <p>Test your knowledge across multiple categories</p>
      </div>
      <div className="quiz-grid">
        {QUIZZES.map(q => (
          <div key={q.id} className="quiz-card" onClick={() => startQuiz(q)}>
            <h3>{q.title}</h3>
            <p>{q.questions.length} questions · {q.timePerQ * q.questions.length}s</p>
            <div className="meta">
              <span className="badge badge-purple">{q.category}</span>
              <span className="badge badge-green">{q.difficulty}</span>
            </div>
            <button className="btn btn-primary btn-sm btn-block" style={{marginTop:14}}>Play →</button>
          </div>
        ))}
      </div>
      {/* Leaderboard */}
      <div className="lb-card" style={{marginTop:24}}>
        <h2>🏆 Leaderboard</h2>
        {leaderboard.length === 0 ? <div className="empty-state">No scores yet. Be the first!</div> :
        <table>
          <thead><tr><th>#</th><th>Player</th><th>Quiz</th><th>Score</th><th>Date</th></tr></thead>
          <tbody>
            {leaderboard.slice(0,10).map((e,i) => (
              <tr key={i}><td className={i<3?`rank-${i+1}`:""}>{i+1}</td><td><strong>{e.name}</strong></td><td>{e.quiz}</td><td><strong>{e.pct}%</strong> ({e.score}/{e.total})</td><td>{e.date}</td></tr>
            ))}
          </tbody>
        </table>}
      </div>
    </div>
  );
}
