"use client";
import { useState, useEffect } from "react";

const COURSES = [
  { id:1, title:"Full Stack Web Development", instructor:"Prof. Sharma", category:"Programming", lessons:["HTML & CSS Basics","JavaScript Fundamentals","React.js Introduction","Node.js & Express","MongoDB & REST APIs","Deployment & DevOps"], color:"#4f46e5", emoji:"💻", duration:"6 weeks" },
  { id:2, title:"Data Structures & Algorithms", instructor:"Dr. Kumar", category:"CS Core", lessons:["Arrays & Strings","Linked Lists","Stacks & Queues","Trees & Graphs","Dynamic Programming","Sorting & Searching"], color:"#0f766e", emoji:"🧠", duration:"8 weeks" },
  { id:3, title:"Machine Learning Fundamentals", instructor:"Prof. Nair", category:"AI/ML", lessons:["Linear Regression","Classification","Decision Trees","Neural Networks","NLP Basics","Model Deployment"], color:"#dc2626", emoji:"🤖", duration:"10 weeks" },
  { id:4, title:"UI/UX Design Principles", instructor:"Ms. Patel", category:"Design", lessons:["Design Thinking","Wireframing","Figma Basics","Color Theory","Typography","Prototyping"], color:"#ea580c", emoji:"🎨", duration:"4 weeks" },
  { id:5, title:"Database Management Systems", instructor:"Prof. Rao", category:"CS Core", lessons:["ER Diagrams","Normalization","SQL Queries","Joins & Subqueries","Transactions","NoSQL Intro"], color:"#7c3aed", emoji:"🗄️", duration:"6 weeks" },
  { id:6, title:"Cloud Computing with AWS", instructor:"Dr. Singh", category:"DevOps", lessons:["Cloud Basics","EC2 & S3","Lambda Functions","RDS & DynamoDB","IAM & Security","CI/CD Pipeline"], color:"#0284c7", emoji:"☁️", duration:"8 weeks" },
];

function getLS(k,fb){if(typeof window==="undefined")return fb;const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}
function setLS(k,v){localStorage.setItem(k,JSON.stringify(v));}

export default function CourseApp() {
  const [page,setPage]=useState("browse");const [activeCourse,setActiveCourse]=useState(null);const [progress,setProgress]=useState({});const [certs,setCerts]=useState([]);const [toast,setToast]=useState("");

  useEffect(()=>{
    if(typeof window!=="undefined"&&!localStorage.getItem("cp_init")){
      setLS("cp_progress",{1:[0,1],2:[0]}); // Some pre-started courses
      setLS("cp_certs",[]);
      localStorage.setItem("cp_init","true");
    }
    setProgress(getLS("cp_progress",{}));setCerts(getLS("cp_certs",[]));
  },[page]);

  function showT(m){setToast(m);setTimeout(()=>setToast(""),2500);}

  function enrollCourse(id){
    const p=getLS("cp_progress",{});if(!p[id])p[id]=[];setLS("cp_progress",p);setProgress({...p});showT("Enrolled!");
  }

  function completeLesson(courseId,lessonIdx){
    const p=getLS("cp_progress",{});if(!p[courseId])p[courseId]=[];
    if(!p[courseId].includes(lessonIdx)){p[courseId].push(lessonIdx);setLS("cp_progress",p);setProgress({...p});}
    const course=COURSES.find(c=>c.id===courseId);
    if(p[courseId].length===course.lessons.length){
      const c=getLS("cp_certs",[]);
      if(!c.find(cc=>cc.courseId===courseId)){
        c.push({courseId,title:course.title,date:new Date().toISOString().split("T")[0]});setLS("cp_certs",c);setCerts(c);
        showT("🎉 Certificate earned!");
      }
    } else {showT("Lesson completed!");}
  }

  function getProgress(id){const p=progress[id];const course=COURSES.find(c=>c.id===id);if(!p||!course)return 0;return Math.round((p.length/course.lessons.length)*100);}

  if(activeCourse){
    const c=activeCourse;const done=progress[c.id]||[];const pct=getProgress(c.id);const hasCert=certs.some(cc=>cc.courseId===c.id);
    return(
      <div><nav className="navbar"><span className="logo">🎓 Course<span>Hub</span></span></nav>
      <div className="container">
        <button className="back-btn" onClick={()=>setActiveCourse(null)}>← Back to courses</button>
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
          <div>
            <h1 style={{fontSize:22,marginBottom:4}}>{c.emoji} {c.title}</h1>
            <p style={{color:"var(--text-sec)",fontSize:13,marginBottom:16}}>by {c.instructor} · {c.duration} · {c.lessons.length} lessons</p>
            <div className="progress-bar" style={{marginBottom:4}}><div className="progress-fill" style={{width:`${pct}%`,background:c.color}}></div></div>
            <div className="progress-label">{pct}% completed ({done.length}/{c.lessons.length})</div>
            <div className="card" style={{marginTop:16}}><h2>Lessons</h2>
              <div className="lesson-list">
                {c.lessons.map((l,i)=>{
                  const isComplete=done.includes(i);
                  return(<div key={i} className={`lesson ${isComplete?"completed":""}`} onClick={()=>!isComplete&&completeLesson(c.id,i)}>
                    <div className="lesson-icon">{isComplete?"✓":i+1}</div><span>{l}</span>
                    {isComplete&&<span style={{marginLeft:"auto",fontSize:11,color:"var(--success)"}}>✓ Done</span>}
                  </div>);
                })}
              </div>
            </div>
          </div>
          <div>
            {hasCert&&<div className="cert-card"><h2>🏆 Certificate</h2><p>{c.title}</p><p style={{fontSize:12}}>Completed on {certs.find(cc=>cc.courseId===c.id)?.date}</p><button className="btn btn-outline" style={{color:"white",borderColor:"rgba(255,255,255,.3)"}}>Download PDF</button></div>}
          </div>
        </div>
      </div></div>
    );
  }

  return(
    <div><nav className="navbar"><span className="logo">🎓 Course<span>Hub</span></span>
      <div className="nav-links">
        <button className={`nav-btn ${page==="browse"?"active":""}`} onClick={()=>setPage("browse")}>Browse</button>
        <button className={`nav-btn ${page==="my"?"active":""}`} onClick={()=>setPage("my")}>My Courses</button>
        <button className={`nav-btn ${page==="certs"?"active":""}`} onClick={()=>setPage("certs")}>Certificates</button>
      </div>
    </nav>
    <div className="container">
      {page==="browse"&&(<>
        <div className="hero"><h1>Learn. Build. Certify.</h1><p>Complete courses to earn certificates</p></div>
        <div className="course-grid">
          {COURSES.map(c=>{const pct=getProgress(c.id);const enrolled=progress[c.id]!==undefined;return(
            <div key={c.id} className="course-card" onClick={()=>{if(enrolled)setActiveCourse(c);}}>
              <div className="course-banner" style={{background:`linear-gradient(135deg,${c.color},${c.color}99)`}}>{c.emoji}</div>
              <div className="course-body">
                <div className="course-title">{c.title}</div><div className="course-instructor">by {c.instructor}</div>
                <div className="course-meta"><span className="badge badge-purple">{c.category}</span><span className="badge badge-amber">{c.duration}</span><span className="badge badge-green">{c.lessons.length} lessons</span></div>
                {enrolled?(<><div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`,background:c.color}}></div></div><div className="progress-label">{pct}%</div></>)
                :<button className="btn btn-primary btn-sm btn-block" style={{marginTop:8}} onClick={e=>{e.stopPropagation();enrollCourse(c.id);}}>Enroll Free</button>}
              </div>
            </div>
          );})}
        </div>
      </>)}
      {page==="my"&&(<>
        <h2 style={{fontSize:18,fontWeight:700,marginBottom:16}}>My Courses</h2>
        {Object.keys(progress).length===0?<div className="empty-state">No enrolled courses</div>:
        <div className="course-grid">
          {COURSES.filter(c=>progress[c.id]).map(c=>{const pct=getProgress(c.id);return(
            <div key={c.id} className="course-card" onClick={()=>setActiveCourse(c)}>
              <div className="course-banner" style={{background:`linear-gradient(135deg,${c.color},${c.color}99)`}}>{c.emoji}</div>
              <div className="course-body"><div className="course-title">{c.title}</div><div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`,background:c.color}}></div></div><div className="progress-label">{pct}% · {c.lessons.length} lessons</div>
              <button className="btn btn-primary btn-sm btn-block" style={{marginTop:8}}>Continue →</button></div>
            </div>
          );})}
        </div>}
      </>)}
      {page==="certs"&&(<>
        <h2 style={{fontSize:18,fontWeight:700,marginBottom:16}}>🏆 My Certificates</h2>
        {certs.length===0?<div className="empty-state">Complete a course to earn a certificate!</div>:
        <div className="course-grid">{certs.map((c,i)=>(<div key={i} className="cert-card"><h2>🏆</h2><p style={{fontSize:16,fontWeight:600}}>{c.title}</p><p style={{fontSize:12}}>Earned on {c.date}</p></div>))}</div>}
      </>)}
    </div>
    <div className={`toast ${toast?"show":""}`}>{toast}</div></div>
  );
}
