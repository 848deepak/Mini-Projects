"use client";
import { useState, useEffect } from "react";

const VENDORS = ["TechBazaar","FashionHub","HomeDecor","BookCorner","FitZone"];
const CATEGORIES = ["All","Electronics","Fashion","Home","Books","Fitness"];

const PRODUCTS = [
  {id:1,name:"Wireless Earbuds Pro",category:"Electronics",vendor:"TechBazaar",price:1499,mrp:2999,rating:4.3,emoji:"🎧"},
  {id:2,name:"Smart Watch Lite",category:"Electronics",vendor:"TechBazaar",price:2999,mrp:5999,rating:4.1,emoji:"⌚"},
  {id:3,name:"USB-C Charger 65W",category:"Electronics",vendor:"TechBazaar",price:899,mrp:1499,rating:4.5,emoji:"🔌"},
  {id:4,name:"Laptop Stand Aluminum",category:"Electronics",vendor:"TechBazaar",price:1299,mrp:1999,rating:4.4,emoji:"💻"},
  {id:5,name:"Casual Cotton Shirt",category:"Fashion",vendor:"FashionHub",price:699,mrp:1299,rating:4.0,emoji:"👕"},
  {id:6,name:"Slim Fit Chinos",category:"Fashion",vendor:"FashionHub",price:999,mrp:1799,rating:4.2,emoji:"👖"},
  {id:7,name:"Running Sneakers",category:"Fashion",vendor:"FashionHub",price:1999,mrp:3499,rating:4.6,emoji:"👟"},
  {id:8,name:"Sunglasses UV400",category:"Fashion",vendor:"FashionHub",price:499,mrp:999,rating:3.9,emoji:"🕶️"},
  {id:9,name:"LED Desk Lamp",category:"Home",vendor:"HomeDecor",price:799,mrp:1299,rating:4.3,emoji:"💡"},
  {id:10,name:"Wall Clock Minimal",category:"Home",vendor:"HomeDecor",price:599,mrp:999,rating:4.1,emoji:"🕐"},
  {id:11,name:"Canvas Art Print",category:"Home",vendor:"HomeDecor",price:1499,mrp:2499,rating:4.7,emoji:"🖼️"},
  {id:12,name:"Scented Candle Set",category:"Home",vendor:"HomeDecor",price:399,mrp:699,rating:4.4,emoji:"🕯️"},
  {id:13,name:"Clean Code (Book)",category:"Books",vendor:"BookCorner",price:399,mrp:599,rating:4.8,emoji:"📘"},
  {id:14,name:"Atomic Habits",category:"Books",vendor:"BookCorner",price:349,mrp:499,rating:4.9,emoji:"📕"},
  {id:15,name:"System Design",category:"Books",vendor:"BookCorner",price:449,mrp:699,rating:4.5,emoji:"📗"},
  {id:16,name:"Yoga Mat Premium",category:"Fitness",vendor:"FitZone",price:799,mrp:1299,rating:4.2,emoji:"🧘"},
  {id:17,name:"Resistance Bands",category:"Fitness",vendor:"FitZone",price:499,mrp:899,rating:4.0,emoji:"💪"},
  {id:18,name:"Protein Shaker",category:"Fitness",vendor:"FitZone",price:299,mrp:499,rating:4.3,emoji:"🥤"},
];

function getLS(k,fb){if(typeof window==="undefined")return fb;const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}
function setLS(k,v){localStorage.setItem(k,JSON.stringify(v));}

export default function EcommerceApp() {
  const [search,setSearch]=useState("");const [cat,setCat]=useState("All");const [cart,setCart]=useState([]);const [cartOpen,setCartOpen]=useState(false);const [toast,setToast]=useState("");

  useEffect(()=>{setCart(getLS("ecom_cart",[]));},[]);
  useEffect(()=>{setLS("ecom_cart",cart);},[cart]);

  function showT(m){setToast(m);setTimeout(()=>setToast(""),2500);}

  function addToCart(p){
    setCart(c=>{const ex=c.find(i=>i.id===p.id);if(ex)return c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i);return[...c,{...p,qty:1}];});
    showT(`${p.name} added!`);
  }
  function updateQty(id,d){setCart(c=>c.map(i=>i.id===id?{...i,qty:Math.max(0,i.qty+d)}:i).filter(i=>i.qty>0));}

  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const count=cart.reduce((s,i)=>s+i.qty,0);

  const filtered=PRODUCTS.filter(p=>{
    if(cat!=="All"&&p.category!==cat)return false;
    if(search&&!p.name.toLowerCase().includes(search.toLowerCase())&&!p.vendor.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });

  return (
    <div>
      <nav className="navbar">
        <span className="logo">🛒 Shop<span>Hub</span></span>
        <div className="nav-right">
          <button className="cart-btn" onClick={()=>setCartOpen(true)}>🛒{count>0&&<span className="cart-count">{count}</span>}</button>
        </div>
      </nav>
      <div className="container">
        <div className="hero-banner">
          <h1>Multi-Vendor Marketplace</h1><p>{VENDORS.length} vendors · {PRODUCTS.length} products · Best prices guaranteed</p>
          <div className="search-bar"><input className="input" style={{border:"none"}} placeholder="Search products or vendors..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
        </div>
        <div className="cat-tabs">{CATEGORIES.map(c=><button key={c} className={`cat-tab ${cat===c?"active":""}`} onClick={()=>setCat(c)}>{c}</button>)}</div>
        <div className="products-grid">
          {filtered.map(p=>{
            const off=Math.round(((p.mrp-p.price)/p.mrp)*100);
            return(
              <div key={p.id} className="product-card">
                <div className="product-img">{p.emoji}</div>
                <div className="product-body">
                  <div className="product-name">{p.name}</div>
                  <div className="product-vendor"><span className="badge badge-blue">{p.vendor}</span></div>
                  <div className="product-price">₹{p.price}<span className="mrp">₹{p.mrp}</span><span className="off">{off}% off</span></div>
                  <div className="product-rating">{"★".repeat(Math.round(p.rating))}{"☆".repeat(5-Math.round(p.rating))} {p.rating}</div>
                  <button className="btn btn-primary btn-sm btn-block" style={{marginTop:8}} onClick={()=>addToCart(p)}>Add to Cart</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`overlay ${cartOpen?"active":""}`} onClick={()=>setCartOpen(false)}/>
      <div className={`cart-drawer ${cartOpen?"open":""}`}>
        <div className="cart-header"><h2>🛒 Cart ({count})</h2><button className="btn btn-outline btn-sm" onClick={()=>setCartOpen(false)}>✕</button></div>
        <div className="cart-items">
          {cart.length===0?<div className="empty-state">Cart is empty</div>:
          cart.map(i=>(
            <div key={i.id} className="cart-item">
              <div className="cart-item-info"><h4>{i.emoji} {i.name}</h4><p>₹{i.price} × {i.qty} = ₹{i.price*i.qty}</p></div>
              <div className="qty-ctrl"><button className="qty-btn" onClick={()=>updateQty(i.id,-1)}>−</button><span style={{fontWeight:700}}>{i.qty}</span><button className="qty-btn" onClick={()=>updateQty(i.id,1)}>+</button></div>
            </div>
          ))}
        </div>
        {cart.length>0&&<div className="cart-footer"><div className="cart-total"><span>Total</span><span>₹{total}</span></div><button className="btn btn-primary btn-lg btn-block" onClick={()=>{setCart([]);setCartOpen(false);showT("Order placed!");}}>Checkout →</button></div>}
      </div>
      <div className={`toast ${toast?"show":""}`}>{toast}</div>
    </div>
  );
}
