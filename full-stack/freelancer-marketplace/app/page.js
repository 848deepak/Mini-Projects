"use client";
import { useState, useEffect } from "react";

const FREELANCERS = [
  {id:1,name:"Aarav Sharma",skill:"Full Stack Developer",color:"#4f46e5",rating:4.8,jobs:42,gigs:[
    {id:1,title:"Build a responsive React web app",desc:"I will create a modern, responsive web application using React.js, Next.js, and Tailwind CSS. Includes state management, API integration, and deployment.",price:15000,delivery:"7 days",category:"Web Development"},
    {id:2,title:"Fix bugs in your JavaScript code",desc:"I will debug and fix issues in your JavaScript, React, or Node.js application. Quick turnaround.",price:3000,delivery:"2 days",category:"Web Development"},
  ]},
  {id:2,name:"Diya Patel",skill:"UI/UX Designer",color:"#dc2626",rating:4.9,jobs:67,gigs:[
    {id:3,title:"Design a modern mobile app UI",desc:"Professional mobile app UI design in Figma with interactive prototypes, design system, and handoff-ready specs.",price:12000,delivery:"5 days",category:"Design"},
    {id:4,title:"Create a brand identity package",desc:"Logo design, color palette, typography, and brand guidelines document for your business.",price:8000,delivery:"4 days",category:"Design"},
  ]},
  {id:3,name:"Vivaan Reddy",skill:"Data Scientist",color:"#0f766e",rating:4.6,jobs:28,gigs:[
    {id:5,title:"Build a ML prediction model",desc:"Custom machine learning model for classification, regression, or NLP tasks. Includes data preprocessing and model evaluation.",price:20000,delivery:"10 days",category:"Data Science"},
    {id:6,title:"Dashboard with data visualization",desc:"Interactive analytics dashboard with charts, graphs, and real-time data updates using Python or JavaScript.",price:10000,delivery:"5 days",category:"Data Science"},
  ]},
  {id:4,name:"Ananya Gupta",skill:"Content Writer",color:"#7c3aed",rating:4.7,jobs:85,gigs:[
    {id:7,title:"Write SEO-optimized blog posts",desc:"Engaging, well-researched blog articles optimized for search engines. Includes keyword research and meta descriptions.",price:2000,delivery:"3 days",category:"Writing"},
    {id:8,title:"Technical documentation",desc:"Clear, comprehensive API documentation, README files, and developer guides for your software project.",price:5000,delivery:"4 days",category:"Writing"},
  ]},
  {id:5,name:"Ishaan Kumar",skill:"Mobile Developer",color:"#ea580c",rating:4.5,jobs:31,gigs:[
    {id:9,title:"Build a React Native mobile app",desc:"Cross-platform mobile app for iOS and Android using React Native. Includes navigation, API calls, and app store deployment.",price:25000,delivery:"14 days",category:"Mobile"},
    {id:10,title:"Add features to existing app",desc:"I will add new features, screens, or integrations to your existing React Native or Flutter application.",price:8000,delivery:"5 days",category:"Mobile"},
  ]},
];

const CATEGORIES = ["All","Web Development","Design","Data Science","Writing","Mobile"];

function getLS(k,fb){if(typeof window==="undefined")return fb;const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}
function setLS(k,v){localStorage.setItem(k,JSON.stringify(v));}

export default function FreelancerApp() {
  const [page,setPage]=useState("browse");const [search,setSearch]=useState("");const [catFilter,setCatFilter]=useState("All");const [orders,setOrders]=useState([]);const [modal,setModal]=useState(null);const [toast,setToast]=useState("");

  useEffect(()=>{setOrders(getLS("fl_orders",[])); },[page]);
  function showT(m){setToast(m);setTimeout(()=>setToast(""),2500);}

  function placeOrder(gig, freelancer) {
    const o = getLS("fl_orders",[]);
    o.push({gigId:gig.id,gigTitle:gig.title,freelancer:freelancer.name,price:gig.price,delivery:gig.delivery,status:"In Progress",date:new Date().toISOString().split("T")[0]});
    setLS("fl_orders",o);setOrders(o);setModal(null);showT("Order placed!");
  }

  const allGigs = FREELANCERS.flatMap(f => f.gigs.map(g => ({...g, freelancer: f})));
  const filtered = allGigs.filter(g => {
    if (catFilter !== "All" && g.category !== catFilter) return false;
    if (search && !g.title.toLowerCase().includes(search.toLowerCase()) && !g.freelancer.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <nav className="navbar"><span className="logo">💼 Freelance<span>Hub</span></span>
        <div className="nav-links">
          <button className={`nav-btn ${page==="browse"?"active":""}`} onClick={()=>setPage("browse")}>Browse Gigs</button>
          <button className={`nav-btn ${page==="freelancers"?"active":""}`} onClick={()=>setPage("freelancers")}>Freelancers</button>
          <button className={`nav-btn ${page==="orders"?"active":""}`} onClick={()=>setPage("orders")}>My Orders</button>
        </div>
      </nav>
      <div className="container">
        {page==="browse"&&(<>
          <div className="hero"><h1>Find Expert Freelancers</h1><p>Browse services from top-rated professionals</p></div>
          <div className="search-bar"><input className="input" placeholder="Search gigs or freelancers..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
          <div className="filter-row" style={{marginTop:16}}>
            {CATEGORIES.map(c=><button key={c} className={`btn ${catFilter===c?"btn-primary":"btn-outline"} btn-sm`} onClick={()=>setCatFilter(c)}>{c}</button>)}
          </div>
          <div className="gig-grid">
            {filtered.map(g=>(
              <div key={g.id} className="gig-card" onClick={()=>setModal(g)}>
                <div className="gig-top">
                  <div className="gig-avatar" style={{background:g.freelancer.color}}>{g.freelancer.name[0]}</div>
                  <div><div className="gig-name">{g.freelancer.name}</div><div className="gig-skill">{g.freelancer.skill}</div></div>
                </div>
                <div className="gig-title">{g.title}</div>
                <div className="gig-desc">{g.desc.substring(0,100)}...</div>
                <div className="gig-meta">
                  <span className="badge badge-green">{g.category}</span>
                  <span className="badge badge-amber">📦 {g.delivery}</span>
                </div>
                <div className="gig-footer">
                  <span className="gig-price">₹{g.price.toLocaleString()}</span>
                  <span className="gig-rating">★ {g.freelancer.rating} ({g.freelancer.jobs})</span>
                </div>
              </div>
            ))}
          </div>
        </>)}
        {page==="freelancers"&&(<>
          <h2 style={{fontSize:18,fontWeight:700,marginBottom:16}}>Top Freelancers</h2>
          <div className="gig-grid">
            {FREELANCERS.map(f=>(
              <div key={f.id} className="gig-card">
                <div className="gig-top"><div className="gig-avatar" style={{background:f.color}}>{f.name[0]}</div><div><div className="gig-name">{f.name}</div><div className="gig-skill">{f.skill}</div></div></div>
                <div className="gig-meta"><span className="badge badge-green">★ {f.rating}</span><span className="badge badge-blue">{f.jobs} projects</span></div>
                <p style={{fontSize:12,color:"var(--text-sec)",marginTop:8}}>{f.gigs.length} services available</p>
              </div>
            ))}
          </div>
        </>)}
        {page==="orders"&&(<>
          <h2 style={{fontSize:18,fontWeight:700,marginBottom:16}}>My Orders</h2>
          <div className="card">
            {orders.length===0?<div className="empty-state">No orders yet</div>:
            <table><thead><tr><th>Gig</th><th>Freelancer</th><th>Price</th><th>Delivery</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>{orders.map((o,i)=>(
              <tr key={i}><td><strong>{o.gigTitle}</strong></td><td>{o.freelancer}</td><td>₹{o.price.toLocaleString()}</td><td>{o.delivery}</td>
              <td><span className="badge badge-amber">{o.status}</span></td><td>{o.date}</td></tr>
            ))}</tbody></table>}
          </div>
        </>)}
      </div>
      {modal&&(
        <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
          <div className="modal">
            <h3>{modal.title}</h3>
            <div className="gig-top" style={{marginBottom:12}}><div className="gig-avatar" style={{background:modal.freelancer.color}}>{modal.freelancer.name[0]}</div><div><div className="gig-name">{modal.freelancer.name}</div><div className="gig-skill">{modal.freelancer.skill} · ★ {modal.freelancer.rating}</div></div></div>
            <p style={{fontSize:13,color:"var(--text-sec)",lineHeight:1.6,marginBottom:12}}>{modal.desc}</p>
            <div style={{display:"flex",gap:12,marginBottom:12}}><span className="badge badge-green">{modal.category}</span><span className="badge badge-amber">📦 {modal.delivery}</span></div>
            <p style={{fontSize:20,fontWeight:700,color:"var(--accent)"}}>₹{modal.price.toLocaleString()}</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>placeOrder(modal,modal.freelancer)}>Place Order →</button>
            </div>
          </div>
        </div>
      )}
      <div className={`toast ${toast?"show":""}`}>{toast}</div>
    </div>
  );
}
