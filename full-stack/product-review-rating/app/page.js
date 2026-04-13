"use client";
import { useState, useEffect } from "react";

const PRODUCTS = [
  {id:1,name:"Sony WH-1000XM5",brand:"Sony",category:"Electronics",emoji:"🎧",price:24990,reviews:[
    {user:"Aarav",rating:5,text:"Best noise cancellation I've ever experienced. Battery lasts 30+ hours.",date:"Apr 10"},
    {user:"Diya",rating:4,text:"Great sound quality but a bit tight on larger heads.",date:"Apr 8"},
    {user:"Vivaan",rating:5,text:"Worth every penny. The ANC is incredible for flights.",date:"Apr 5"},
  ]},
  {id:2,name:"MacBook Air M3",brand:"Apple",category:"Electronics",emoji:"💻",price:114900,reviews:[
    {user:"Ananya",rating:5,text:"Blazing fast for development. Fan-less design is amazing.",date:"Apr 9"},
    {user:"Ishaan",rating:4,text:"Great laptop but wish it had more ports.",date:"Apr 7"},
  ]},
  {id:3,name:"Kindle Paperwhite",brand:"Amazon",category:"Electronics",emoji:"📱",price:13999,reviews:[
    {user:"Saanvi",rating:5,text:"Perfect for reading. The warm light is easy on eyes.",date:"Apr 6"},
    {user:"Arjun",rating:5,text:"Battery lasts weeks. Best investment for book lovers.",date:"Apr 3"},
    {user:"Kavya",rating:4,text:"Love it but page turn animation could be smoother.",date:"Apr 1"},
  ]},
  {id:4,name:"Nike Air Zoom Pegasus",brand:"Nike",category:"Shoes",emoji:"👟",price:8995,reviews:[
    {user:"Reyansh",rating:4,text:"Comfortable for daily runs. Good cushioning.",date:"Apr 4"},
    {user:"Prisha",rating:5,text:"My go-to running shoes. 10th pair!",date:"Mar 30"},
  ]},
  {id:5,name:"Atomic Habits",brand:"James Clear",category:"Books",emoji:"📕",price:499,reviews:[
    {user:"Aarav",rating:5,text:"Life-changing book. Simple yet powerful ideas.",date:"Apr 2"},
    {user:"Diya",rating:5,text:"Must read for anyone wanting to build good habits.",date:"Mar 28"},
    {user:"Vivaan",rating:4,text:"Great concepts but a bit repetitive in places.",date:"Mar 25"},
    {user:"Ananya",rating:5,text:"Re-read it every year. Always find new insights.",date:"Mar 20"},
  ]},
  {id:6,name:'LG C3 OLED 55"',brand:"LG",category:"Electronics",emoji:"📺",price:119990,reviews:[
    {user:"Ishaan",rating:5,text:"Best TV for gaming and movies. OLED blacks are stunning.",date:"Mar 29"},
    {user:"Saanvi",rating:4,text:"Amazing picture quality but the stand is wobbly.",date:"Mar 26"},
  ]},
];

const CATEGORIES = ["All","Electronics","Shoes","Books"];

function getLS(k,fb){if(typeof window==="undefined")return fb;const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}
function setLS(k,v){localStorage.setItem(k,JSON.stringify(v));}

export default function ReviewApp(){
  const [products,setProducts]=useState([]);const [search,setSearch]=useState("");const [cat,setCat]=useState("All");const [active,setActive]=useState(null);const [modal,setModal]=useState(false);const [toast,setToast]=useState("");

  useEffect(()=>{
    if(typeof window!=="undefined"&&!localStorage.getItem("pr_init")){setLS("pr_products",PRODUCTS);localStorage.setItem("pr_init","true");}
    setProducts(getLS("pr_products",PRODUCTS));
  },[]);

  function showT(m){setToast(m);setTimeout(()=>setToast(""),2500);}

  function submitReview(productId,rating,text,user){
    const all=getLS("pr_products",PRODUCTS);const p=all.find(pp=>pp.id===productId);
    if(p){p.reviews.push({user,rating,text,date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})});setLS("pr_products",all);setProducts([...all]);}
    setModal(false);showT("Review submitted!");
  }

  function getAvg(reviews){return reviews.length?+(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1):0;}
  function getRatingDist(reviews){const d={5:0,4:0,3:0,2:0,1:0};reviews.forEach(r=>{d[r.rating]=(d[r.rating]||0)+1;});return d;}

  const Stars=({rating,size=16,interactive=false,onChange})=>(
    <div className="stars">{[1,2,3,4,5].map(i=><span key={i} className={`star ${i<=rating?"filled":""}`} style={{fontSize:size}} onClick={()=>interactive&&onChange(i)}>★</span>)}</div>
  );

  const filtered=products.filter(p=>{if(cat!=="All"&&p.category!==cat)return false;if(search&&!p.name.toLowerCase().includes(search.toLowerCase()))return false;return true;});

  if(active){
    const p=active;const avg=getAvg(p.reviews);const dist=getRatingDist(p.reviews);
    return(
      <div><nav className="navbar"><span className="logo">⭐ Review<span>Hub</span></span></nav>
      <div className="container">
        <button className="back-btn" onClick={()=>setActive(null)}>← Back</button>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <div className="card" style={{textAlign:"center"}}><div style={{fontSize:60,marginBottom:12}}>{p.emoji}</div><h2 style={{fontSize:20}}>{p.name}</h2><p style={{color:"var(--text-sec)",fontSize:13}}>{p.brand}</p><p style={{fontSize:20,fontWeight:700,color:"var(--accent)",marginTop:8}}>₹{p.price.toLocaleString()}</p></div>
          <div className="card">
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <div><div className="rating-big">{avg}</div><Stars rating={Math.round(avg)} size={20}/><div className="rating-count">{p.reviews.length} reviews</div></div>
              <div className="rating-bars" style={{flex:1}}>{[5,4,3,2,1].map(n=>(
                <div key={n} className="bar-row"><span className="bar-label">{n}</span><div className="bar-bg"><div className="bar-fill" style={{width:`${p.reviews.length?(dist[n]/p.reviews.length)*100:0}%`}}></div></div><span className="bar-count">{dist[n]}</span></div>
              ))}</div>
            </div>
            <button className="btn btn-primary btn-block" style={{marginTop:12}} onClick={()=>setModal(true)}>Write a Review</button>
          </div>
        </div>
        <div className="card"><h2 style={{fontSize:15,fontWeight:600,marginBottom:14}}>Reviews ({p.reviews.length})</h2>
          <div className="review-list">{p.reviews.map((r,i)=>(
            <div key={i} className="review"><div className="review-top"><strong className="review-name">{r.user}</strong><Stars rating={r.rating} size={12}/><span className="review-date">{r.date}</span></div><div className="review-text">{r.text}</div></div>
          ))}</div>
        </div>
      </div>
      {modal&&<ReviewModal product={p} onSubmit={submitReview} onClose={()=>setModal(false)} Stars={Stars}/>}
      <div className={`toast ${toast?"show":""}`}>{toast}</div></div>
    );
  }

  return(
    <div><nav className="navbar"><span className="logo">⭐ Review<span>Hub</span></span></nav>
    <div className="container">
      <div className="hero"><h1>Product Reviews</h1><p>Real reviews from real people</p></div>
      <div className="search-bar"><input className="input" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div className="cat-tabs">{CATEGORIES.map(c=><button key={c} className={`cat-tab ${cat===c?"active":""}`} onClick={()=>setCat(c)}>{c}</button>)}</div>
      <div className="product-grid">{filtered.map(p=>{const avg=getAvg(p.reviews);return(
        <div key={p.id} className="product-card" onClick={()=>setActive(p)}>
          <div className="product-img">{p.emoji}</div>
          <div className="product-body"><div className="product-name">{p.name}</div><div className="product-brand">{p.brand}</div>
            <Stars rating={Math.round(avg)} size={14}/><span style={{fontSize:12,color:"var(--accent)",fontWeight:700}}>{avg} ★</span><span style={{fontSize:11,color:"var(--text-sec)"}}> ({p.reviews.length})</span>
            <p style={{fontSize:16,fontWeight:700,color:"var(--accent)",marginTop:6}}>₹{p.price.toLocaleString()}</p>
          </div>
        </div>
      );})}</div>
    </div>
    <div className={`toast ${toast?"show":""}`}>{toast}</div></div>
  );
}

function ReviewModal({product,onSubmit,onClose,Stars}){
  const[rating,setRating]=useState(0);const[text,setText]=useState("");const[user,setUser]=useState("");
  return(
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal"><h3>Review {product.name}</h3>
        <div className="form-group"><label>Name</label><input className="input" value={user} onChange={e=>setUser(e.target.value)} placeholder="Your name"/></div>
        <div className="form-group"><label>Rating</label><Stars rating={rating} size={28} interactive onChange={setRating}/></div>
        <div className="form-group"><label>Review</label><textarea className="textarea" value={text} onChange={e=>setText(e.target.value)} placeholder="Write your review..."/></div>
        <div className="modal-actions"><button className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={()=>{if(!user||!rating)return;onSubmit(product.id,rating,text,user);}}>Submit</button></div>
      </div>
    </div>
  );
}
