"use client";
import { useState, useEffect } from "react";

const ARTICLES = [
  {id:1,title:"Understanding React Server Components",author:"Aarav Sharma",color:"#4f46e5",category:"Programming",premium:false,readTime:"5 min",date:"Apr 10",excerpt:"Server Components bring a new paradigm to React development. They render on the server and send HTML to the client...",body:"Server Components bring a new paradigm to React development. They render on the server and send HTML to the client, reducing the JavaScript bundle size significantly.\n\nUnlike traditional client components, Server Components can directly access databases, file systems, and other server-side resources. This makes data fetching much simpler and more efficient.\n\nThe key benefit is performance. By moving rendering to the server, you eliminate unnecessary JavaScript from being shipped to browsers. Users get faster page loads and a better experience.\n\nServer Components also enable powerful patterns like streaming, where parts of the page can be rendered and sent to the client as they become ready, rather than waiting for everything to load."},
  {id:2,title:"System Design: Building Scalable APIs",author:"Diya Patel",color:"#dc2626",category:"Architecture",premium:true,readTime:"8 min",date:"Apr 8",excerpt:"Learn the fundamentals of designing APIs that can handle millions of requests per second...",body:"Scalable API design starts with understanding your traffic patterns. Are reads dominant? Writes? Mixed workloads? Each pattern demands different optimizations.\n\nRate limiting is your first line of defense. Implement token bucket or sliding window algorithms to prevent abuse while allowing burst traffic from legitimate users.\n\nCaching strategies make or break your API performance. Use Redis for hot data, CDN for static responses, and HTTP cache headers for client-side caching.\n\nLoad balancing distributes traffic across multiple servers. Round-robin works for homogeneous servers, but weighted algorithms handle heterogeneous infrastructure better."},
  {id:3,title:"The Art of Clean Code",author:"Vivaan Reddy",color:"#0f766e",category:"Best Practices",premium:false,readTime:"6 min",date:"Apr 5",excerpt:"Writing clean, maintainable code is a skill that separates junior developers from senior engineers...",body:"Clean code reads like well-written prose. Each function tells a story, each variable has a meaningful name, and each module has a clear purpose.\n\nThe Single Responsibility Principle is your best friend. A function should do one thing, and do it well. If you can't describe what a function does without using 'and', it's doing too much.\n\nNaming is the hardest problem in computer science, and also the most important. Use intention-revealing names. Don't abbreviate unless the abbreviation is universally understood.\n\nTests are documentation that never goes stale. Write them first (TDD) or write them alongside your code, but always write them."},
  {id:4,title:"Mastering Database Indexing",author:"Ananya Gupta",color:"#7c3aed",category:"Database",premium:true,readTime:"10 min",date:"Apr 3",excerpt:"Database indexes can make or break your application's performance. Learn when and how to use them effectively...",body:"Indexes are data structures that speed up data retrieval at the cost of additional storage and slower writes. Understanding this trade-off is crucial.\n\nB-tree indexes are the default and most versatile. They support equality and range queries efficiently. Most of your indexes should be B-tree.\n\nComposite indexes follow the leftmost prefix rule. An index on (a, b, c) can serve queries on (a), (a, b), and (a, b, c), but not on (b) or (c) alone.\n\nCovering indexes include all columns needed by a query, eliminating the need to access the actual table data. This can dramatically speed up read-heavy workloads."},
  {id:5,title:"CSS Grid vs Flexbox: When to Use What",author:"Ishaan Kumar",color:"#ea580c",category:"Frontend",premium:false,readTime:"4 min",date:"Apr 1",excerpt:"Both CSS Grid and Flexbox are powerful layout tools, but they excel in different scenarios...",body:"Flexbox is one-dimensional — it works along a single axis (row or column). It's perfect for navigation bars, card layouts that wrap, and centering content.\n\nCSS Grid is two-dimensional — it handles both rows and columns simultaneously. Use it for page layouts, complex card grids with specific sizing, and any layout where you need precise control over placement.\n\nThe key insight: use Flexbox for components, use Grid for page layout. This isn't a hard rule, but it covers 90% of use cases correctly.\n\nModern CSS also gives us subgrid, container queries, and :has() — tools that make layout even more powerful and expressive."},
  {id:6,title:"Microservices: Lessons Learned at Scale",author:"Saanvi Nair",color:"#0284c7",category:"Architecture",premium:true,readTime:"12 min",date:"Mar 28",excerpt:"After running microservices in production for 3 years, here are the hard-won lessons we learned...",body:"Start with a monolith. Seriously. Microservices add complexity that only becomes worthwhile at scale. If your team is under 20 engineers, a monolith is probably the right choice.\n\nService boundaries should follow business domains, not technical layers. Don't create a 'database service' — create an 'order service' that owns its data.\n\nDistributed systems are harder than you think. Network calls fail. Services go down. Data becomes eventually consistent. Design for failure from day one.\n\nObservability is not optional. You need distributed tracing, structured logging, and metrics from day one. Without them, debugging production issues becomes impossible."},
];

function getLS(k,fb){if(typeof window==="undefined")return fb;const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}
function setLS(k,v){localStorage.setItem(k,JSON.stringify(v));}

export default function ContentApp() {
  const [page,setPage]=useState("feed");const [activeArticle,setActiveArticle]=useState(null);const [subscribed,setSubscribed]=useState(false);const [toast,setToast]=useState("");

  useEffect(()=>{if(typeof window!=="undefined")setSubscribed(localStorage.getItem("cp_subscribed")==="true");},[]);
  function showT(m){setToast(m);setTimeout(()=>setToast(""),2500);}

  function subscribe(plan){
    localStorage.setItem("cp_subscribed","true");setSubscribed(true);showT(`Subscribed to ${plan} plan!`);setPage("feed");
  }

  if(activeArticle){
    const a=activeArticle;const canRead=!a.premium||subscribed;
    return(
      <div><nav className="navbar"><span className="logo">📝 Content<span>Hub</span></span></nav>
      <div className="container">
        <button className="back-btn" onClick={()=>setActiveArticle(null)}>← Back to feed</button>
        <div className="article-full">
          <div className="article-top"><div className="author-avatar" style={{background:a.color}}>{a.author[0]}</div><span>{a.author}</span><span>·</span><span>{a.date}</span><span>·</span><span>{a.readTime}</span>
            {a.premium&&<span className="badge badge-premium">★ Premium</span>}
          </div>
          <h1>{a.title}</h1>
          <div className="article-body">
            {canRead?a.body.split("\n\n").map((p,i)=><p key={i}>{p}</p>):(
              <>{a.body.split("\n\n").slice(0,1).map((p,i)=><p key={i}>{p}</p>)}
              <div className="paywall">
                <div className="paywall-card">
                  <h3>🔒 Premium Content</h3>
                  <p>Subscribe to read this article and unlock all premium content</p>
                  <button className="btn btn-accent btn-block" onClick={()=>setPage("subscribe")}>Subscribe Now →</button>
                </div>
              </div></>
            )}
          </div>
        </div>
      </div></div>
    );
  }

  return(
    <div><nav className="navbar"><span className="logo">📝 Content<span>Hub</span></span>
      <div className="nav-links">
        <button className={`nav-btn ${page==="feed"?"active":""}`} onClick={()=>setPage("feed")}>Feed</button>
        <button className={`nav-btn ${page==="subscribe"?"active":""}`} onClick={()=>setPage("subscribe")}>Subscribe</button>
        {subscribed&&<span className="badge badge-premium" style={{padding:"6px 12px"}}>★ Pro</span>}
      </div>
    </nav>
    <div className="container">
      {page==="feed"&&(<>
        <div className="hero"><h1>ContentHub</h1><p>Curated tech articles from industry experts</p></div>
        {ARTICLES.map(a=>(
          <div key={a.id} className="article-card" onClick={()=>setActiveArticle(a)}>
            <div className="article-top"><div className="author-avatar" style={{background:a.color}}>{a.author[0]}</div><span>{a.author}</span><span>·</span><span>{a.date}</span></div>
            <div className="article-title">{a.title}</div>
            <div className="article-excerpt">{a.excerpt}</div>
            <div className="article-meta"><span>{a.readTime}</span><span>·</span><span className="badge badge-premium" style={a.premium?{}:{background:"#f5f5f4",color:"#78716c"}}>{a.premium?"★ Premium":"Free"}</span><span>·</span><span>{a.category}</span></div>
          </div>
        ))}
      </>)}
      {page==="subscribe"&&(<>
        <div className="hero"><h1>Go Premium ★</h1><p>Unlock all articles and support creators</p></div>
        <div className="sub-plans">
          <div className="plan-card" onClick={()=>subscribe("Monthly")}>
            <h3>Monthly</h3><div className="plan-price">₹199</div><div className="plan-period">per month</div>
            <ul style={{textAlign:"left",fontSize:13,color:"var(--text-sec)",marginTop:12,listStyle:"none"}}><li>✓ All premium articles</li><li>✓ Early access to new content</li><li>✓ Cancel anytime</li></ul>
            <button className="btn btn-outline btn-block" style={{marginTop:12}}>Choose Monthly</button>
          </div>
          <div className="plan-card featured" onClick={()=>subscribe("Annual")}>
            <span className="badge badge-premium">Best Value</span>
            <h3>Annual</h3><div className="plan-price">₹1499</div><div className="plan-period">per year (₹125/mo)</div>
            <ul style={{textAlign:"left",fontSize:13,color:"var(--text-sec)",marginTop:12,listStyle:"none"}}><li>✓ All premium articles</li><li>✓ Early access</li><li>✓ Save 37%</li><li>✓ Exclusive newsletters</li></ul>
            <button className="btn btn-accent btn-block" style={{marginTop:12}}>Choose Annual</button>
          </div>
        </div>
      </>)}
    </div>
    <div className={`toast ${toast?"show":""}`}>{toast}</div></div>
  );
}
