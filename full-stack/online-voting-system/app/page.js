"use client";
import { useState, useEffect } from "react";

const ELECTIONS = [
  { id: 1, title: "Student Council President 2026", status: "active", candidates: [
    { id: 1, name: "Aarav Sharma", party: "Innovation Alliance", color: "#2563eb", manifesto: "Digital campus, better labs, 24/7 library" },
    { id: 2, name: "Diya Patel", party: "Student First", color: "#16a34a", manifesto: "Mental health support, flexible deadlines, sports upgrades" },
    { id: 3, name: "Vivaan Reddy", party: "Progress Front", color: "#dc2626", manifesto: "Industry partnerships, placement focus, startup incubator" },
  ]},
  { id: 2, title: "Tech Club Secretary", status: "active", candidates: [
    { id: 4, name: "Ananya Gupta", party: "CodeCraft", color: "#7c3aed", manifesto: "Weekly hackathons, open-source contributions" },
    { id: 5, name: "Ishaan Kumar", party: "TechVision", color: "#ea580c", manifesto: "AI/ML workshops, cloud computing bootcamps" },
  ]},
  { id: 3, title: "Sports Captain", status: "closed", candidates: [
    { id: 6, name: "Arjun Mehta", party: "Champions", color: "#0f766e", manifesto: "New gym, inter-college tournaments" },
    { id: 7, name: "Kavya Singh", party: "Fitness First", color: "#db2777", manifesto: "Yoga sessions, swimming pool, athletics track" },
  ]},
];

function getLS(k,fb){if(typeof window==="undefined")return fb;const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}
function setLS(k,v){localStorage.setItem(k,JSON.stringify(v));}

export default function VotingApp() {
  const [page, setPage] = useState("vote"); // vote, results, admin
  const [votes, setVotes] = useState({});
  const [voters, setVoters] = useState([]);
  const [voterId, setVoterId] = useState("");
  const [verified, setVerified] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeElection, setActiveElection] = useState(null);
  const [voted, setVoted] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if(typeof window==="undefined")return;
    if (!localStorage.getItem("vote_init")) {
      const seedVotes = {};
      ELECTIONS.forEach(e => { seedVotes[e.id] = {}; e.candidates.forEach(c => { seedVotes[e.id][c.id] = 0; }); });
      // Pre-populate election 3 (closed) with results
      seedVotes[3] = { 6: 145, 7: 132 };
      // Pre-populate some votes for active elections
      seedVotes[1] = { 1: 78, 2: 92, 3: 65 };
      seedVotes[2] = { 4: 45, 5: 38 };
      setLS("vote_data", seedVotes);
      setLS("vote_voters", ["VTR001","VTR002","VTR003"]);
      localStorage.setItem("vote_init", "true");
    }
    setVotes(getLS("vote_data", {})); setVoters(getLS("vote_voters", []));
  }, [page, voted]);

  function showT(m){setToast(m);setTimeout(()=>setToast(""),2500);}

  function verifyVoter() {
    if (!voterId.trim()) { showT("Enter voter ID"); return; }
    if (voters.includes(voterId)) { showT("You have already voted!"); return; }
    setVerified(true);
  }

  function castVote(electionId) {
    if (!selectedCandidate) { showT("Select a candidate!"); return; }
    const vd = getLS("vote_data", {});
    vd[electionId][selectedCandidate] = (vd[electionId][selectedCandidate] || 0) + 1;
    setLS("vote_data", vd);
    const vl = getLS("vote_voters", []); vl.push(voterId); setLS("vote_voters", vl);
    setVoted(true); setSelectedCandidate(null);
    showT("Vote cast successfully!");
  }

  function getTotalVotes(electionId) {
    const ev = votes[electionId] || {};
    return Object.values(ev).reduce((s,v) => s+v, 0);
  }

  return (
    <div className="container">
      <div className="hero"><h1>🗳️ CU Election Portal</h1><p>Secure Online Voting System</p></div>
      <div className="nav-bar">
        <button className={`btn ${page==="vote"?"btn-primary":"btn-outline"}`} onClick={()=>{setPage("vote");setVerified(false);setVoted(false);setVoterId("");}}>🗳️ Vote</button>
        <button className={`btn ${page==="results"?"btn-primary":"btn-outline"}`} onClick={()=>setPage("results")}>📊 Results</button>
      </div>

      {page === "vote" && !verified && !voted && (
        <div className="card" style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}>
          <h2 style={{justifyContent:"center"}}>Voter Verification</h2>
          <p style={{color:"var(--text-sec)",fontSize:13,marginBottom:16}}>Enter your voter ID to proceed</p>
          <div className="voter-id-input">
            <input className="input" value={voterId} onChange={e=>setVoterId(e.target.value.toUpperCase())} placeholder="e.g. VTR100" />
            <button className="btn btn-primary" onClick={verifyVoter}>Verify</button>
          </div>
          <div style={{fontSize:12,color:"var(--text-sec)"}}>Try any ID except VTR001, VTR002, VTR003 (already voted)</div>
        </div>
      )}

      {page === "vote" && verified && !voted && (
        <>
          <div className="stats-row">
            <div className="stat-card"><div className="stat-value" style={{color:"var(--accent)"}}>✓</div><div className="stat-label">Verified: {voterId}</div></div>
            <div className="stat-card"><div className="stat-value">{ELECTIONS.filter(e=>e.status==="active").length}</div><div className="stat-label">Active Elections</div></div>
            <div className="stat-card"><div className="stat-value">{voters.length}</div><div className="stat-label">Votes Cast</div></div>
          </div>
          {!activeElection ? (
            <>
              <h2 style={{fontSize:16,fontWeight:600,marginBottom:12}}>Active Elections</h2>
              {ELECTIONS.filter(e=>e.status==="active").map(e => (
                <div key={e.id} className="election-card" style={{cursor:"pointer"}} onClick={()=>setActiveElection(e)}>
                  <h3>{e.title}</h3><p>{e.candidates.length} candidates · {getTotalVotes(e.id)} votes so far</p>
                  <span className="badge badge-green">Active</span>
                </div>
              ))}
            </>
          ) : (
            <div className="card">
              <h2>{activeElection.title} <button className="btn btn-outline btn-sm" onClick={()=>{setActiveElection(null);setSelectedCandidate(null);}}>← Back</button></h2>
              <p style={{fontSize:13,color:"var(--text-sec)",marginBottom:16}}>Select your candidate and cast your vote</p>
              <div className="candidates">
                {activeElection.candidates.map(c => (
                  <div key={c.id} className={`candidate-card ${selectedCandidate===c.id?"selected":""}`} onClick={()=>setSelectedCandidate(c.id)}>
                    <div className="candidate-avatar" style={{background:c.color}}>{c.name[0]}</div>
                    <div className="candidate-name">{c.name}</div>
                    <div className="candidate-party">{c.party}</div>
                    <p style={{fontSize:11,color:"var(--text-sec)",marginTop:6}}>{c.manifesto}</p>
                  </div>
                ))}
              </div>
              <div style={{textAlign:"center",marginTop:20}}>
                <button className="btn btn-success btn-lg" disabled={!selectedCandidate} onClick={()=>castVote(activeElection.id)}>Cast Vote ✓</button>
              </div>
            </div>
          )}
        </>
      )}

      {page === "vote" && voted && (
        <div className="success-msg"><h2>✅ Vote Cast!</h2><p>Thank you for participating in the democratic process.</p>
          <button className="btn btn-outline" style={{marginTop:16}} onClick={()=>setPage("results")}>View Results →</button>
        </div>
      )}

      {page === "results" && (
        <>
          {ELECTIONS.map(e => {
            const total = getTotalVotes(e.id);
            const ev = votes[e.id] || {};
            const maxVotes = Math.max(...Object.values(ev), 1);
            return (
              <div key={e.id} className="card">
                <h2>{e.title} <span className={`badge ${e.status==="active"?"badge-green":"badge-red"}`}>{e.status}</span></h2>
                <p style={{fontSize:13,color:"var(--text-sec)",marginBottom:14}}>Total votes: {total}</p>
                {e.candidates.map(c => {
                  const v = ev[c.id] || 0;
                  const pct = total > 0 ? Math.round((v/total)*100) : 0;
                  const isWinner = v === maxVotes && e.status === "closed";
                  return (
                    <div key={c.id} className="result-bar" style={{marginBottom:12}}>
                      <div className="bar-label"><span>{c.name} ({c.party}) {isWinner ? "🏆" : ""}</span><span>{pct}% ({v} votes)</span></div>
                      <div className="bar-bg"><div className="bar-fill" style={{width:`${pct}%`,background:c.color}}></div></div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </>
      )}
      <div className={`toast ${toast?"show":""}`}>{toast}</div>
    </div>
  );
}
