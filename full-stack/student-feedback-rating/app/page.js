"use client";
import { useState, useEffect } from "react";

const FACULTY = [
  { id: 1, name: "Prof. Anita Sharma", dept: "Computer Science", courses: ["Data Structures", "DBMS"], color: "#4f46e5" },
  { id: 2, name: "Prof. Vikram Singh", dept: "Computer Science", courses: ["OS", "Networks"], color: "#0f766e" },
  { id: 3, name: "Prof. Meera Patel", dept: "Electronics", courses: ["Digital Electronics"], color: "#dc2626" },
  { id: 4, name: "Prof. Suresh Rao", dept: "Mechanical", courses: ["Thermodynamics"], color: "#ea580c" },
  { id: 5, name: "Prof. Priya Nair", dept: "Civil", courses: ["Structures"], color: "#7c3aed" },
  { id: 6, name: "Dr. Rajesh Kumar", dept: "Computer Science", courses: ["AI/ML"], color: "#0284c7" },
];

function getLS(k,fb){if(typeof window==="undefined")return fb;const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}
function setLS(k,v){localStorage.setItem(k,JSON.stringify(v));}

export default function FeedbackApp() {
  const [page, setPage] = useState("rate");
  const [feedback, setFeedback] = useState([]);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("sfr_init")) {
      setLS("sfr_feedback", [
        { facultyId: 1, rating: 5, comment: "Excellent teaching style, makes complex topics simple!", student: "Aarav", date: "2026-04-01" },
        { facultyId: 1, rating: 4, comment: "Great lectures, could improve lab sessions.", student: "Diya", date: "2026-04-02" },
        { facultyId: 2, rating: 4, comment: "Very knowledgeable, explains networks brilliantly.", student: "Vivaan", date: "2026-04-03" },
        { facultyId: 3, rating: 5, comment: "Best electronics professor!", student: "Ananya", date: "2026-04-04" },
        { facultyId: 4, rating: 3, comment: "Good content but needs better pace.", student: "Ishaan", date: "2026-04-05" },
        { facultyId: 6, rating: 5, comment: "AI/ML concepts explained with real-world examples.", student: "Saanvi", date: "2026-04-06" },
      ]);
      localStorage.setItem("sfr_init", "true");
    }
    setFeedback(getLS("sfr_feedback", []));
  }, [page]);

  function getAvgRating(facultyId) {
    const fb = feedback.filter(f => f.facultyId === facultyId);
    if (fb.length === 0) return { avg: 0, count: 0 };
    return { avg: (fb.reduce((s, f) => s + f.rating, 0) / fb.length).toFixed(1), count: fb.length };
  }

  function submitFeedback(facultyId, rating, comment, student) {
    const all = getLS("sfr_feedback", []);
    all.push({ facultyId, rating, comment, student, date: new Date().toISOString().split("T")[0] });
    setLS("sfr_feedback", all);
    setFeedback(all);
    setModal(null);
    setToast("Feedback submitted!"); setTimeout(() => setToast(""), 2500);
  }

  const Stars = ({ rating, size = 20, interactive = false, onChange }) => (
    <div className="star-display">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star ${i <= rating ? "filled" : ""}`} style={{fontSize:size}} onClick={() => interactive && onChange(i)}>★</span>
      ))}
    </div>
  );

  const overallAvg = feedback.length > 0 ? (feedback.reduce((s,f) => s + f.rating, 0) / feedback.length).toFixed(1) : 0;
  const topFaculty = FACULTY.map(f => ({...f, ...getAvgRating(f.id)})).sort((a,b) => b.avg - a.avg);

  return (
    <div>
      <nav style={{background:"var(--surface)",borderBottom:"1px solid var(--border)",position:"sticky",top:0,zIndex:50}}>
        <div className="navbar">
          <span className="logo">⭐ Student<span>Feedback</span></span>
          <div className="nav-links">
            <button className={`nav-link ${page === "rate" ? "active" : ""}`} onClick={() => setPage("rate")}>Rate Faculty</button>
            <button className={`nav-link ${page === "rankings" ? "active" : ""}`} onClick={() => setPage("rankings")}>Rankings</button>
            <button className={`nav-link ${page === "reviews" ? "active" : ""}`} onClick={() => setPage("reviews")}>All Reviews</button>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="stats-row">
          <div className="stat-card"><div className="stat-value">{FACULTY.length}</div><div className="stat-label">Faculty Members</div></div>
          <div className="stat-card"><div className="stat-value">{feedback.length}</div><div className="stat-label">Total Feedbacks</div></div>
          <div className="stat-card"><div className="stat-value" style={{color:"var(--accent)"}}>{overallAvg} ★</div><div className="stat-label">Avg Rating</div></div>
          <div className="stat-card"><div className="stat-value">{FACULTY.map(f => f.courses).flat().length}</div><div className="stat-label">Courses</div></div>
        </div>

        {page === "rate" && (
          <>
            <h2 style={{fontSize:18,fontWeight:700,marginBottom:16}}>Rate Your Faculty</h2>
            <div className="faculty-grid">
              {FACULTY.map(f => {
                const { avg, count } = getAvgRating(f.id);
                return (
                  <div key={f.id} className="faculty-card" onClick={() => setModal(f)}>
                    <div className="faculty-top">
                      <div className="faculty-avatar" style={{background:f.color}}>{f.name.split(" ").pop()[0]}</div>
                      <div><div className="faculty-name">{f.name}</div><div className="faculty-dept">{f.dept}</div></div>
                    </div>
                    <Stars rating={Math.round(avg)} />
                    <span className="rating-value">{avg}</span><span className="rating-count">({count} reviews)</span>
                    <div style={{marginTop:8}}>{f.courses.map(c => <span key={c} className="badge badge-amber" style={{marginRight:4}}>{c}</span>)}</div>
                    <button className="btn btn-primary btn-sm btn-block" style={{marginTop:12}}>Give Feedback →</button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {page === "rankings" && (
          <div className="card">
            <h2>🏅 Faculty Rankings</h2>
            <table>
              <thead><tr><th>#</th><th>Faculty</th><th>Department</th><th>Avg Rating</th><th>Reviews</th></tr></thead>
              <tbody>
                {topFaculty.map((f, i) => (
                  <tr key={f.id}><td style={{fontWeight:700}}>{i+1}</td><td><strong>{f.name}</strong></td><td>{f.dept}</td><td><span style={{color:"var(--accent)",fontWeight:700}}>{f.avg} ★</span></td><td>{f.count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {page === "reviews" && (
          <div className="card">
            <h2>All Reviews ({feedback.length})</h2>
            {feedback.sort((a,b) => new Date(b.date) - new Date(a.date)).map((f, i) => {
              const fac = FACULTY.find(ff => ff.id === f.facultyId);
              return (
                <div key={i} className="feedback-item">
                  <strong>{fac?.name}</strong>
                  <Stars rating={f.rating} size={14} />
                  <div className="comment">{f.comment}</div>
                  <div className="meta">By {f.student} · {f.date}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modal && <FeedbackModal faculty={modal} onSubmit={submitFeedback} onClose={() => setModal(null)} Stars={Stars} />}
      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}

function FeedbackModal({ faculty, onSubmit, onClose, Stars }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [student, setStudent] = useState("");

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h3>Rate {faculty.name}</h3>
        <div className="form-group"><label>Your Name</label><input className="input" value={student} onChange={e => setStudent(e.target.value)} placeholder="Enter your name" /></div>
        <div className="form-group"><label>Rating</label><Stars rating={rating} size={28} interactive onChange={setRating} /></div>
        <div className="form-group"><label>Comment</label><textarea className="textarea" value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." /></div>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { if (!student || !rating) return; onSubmit(faculty.id, rating, comment, student); }}>Submit Feedback</button>
        </div>
      </div>
    </div>
  );
}
