"use client";
import { useState, useEffect } from "react";

const RESTAURANTS = [
  { id:1, name:"Spice Garden", cuisine:"North Indian", rating:4.3, deliveryTime:"30-40 min", emoji:"🍛", menu:[
    {id:1,name:"Butter Chicken",price:280,desc:"Creamy tomato-based curry",veg:false,emoji:"🍗"},
    {id:2,name:"Dal Makhani",price:220,desc:"Slow-cooked black lentils",veg:true,emoji:"🥘"},
    {id:3,name:"Garlic Naan",price:60,desc:"Clay oven baked bread",veg:true,emoji:"🫓"},
    {id:4,name:"Biryani",price:250,desc:"Aromatic rice with spices",veg:false,emoji:"🍚"},
    {id:5,name:"Paneer Tikka",price:200,desc:"Grilled cottage cheese",veg:true,emoji:"🧀"},
  ]},
  { id:2, name:"Pizza Paradise", cuisine:"Italian", rating:4.5, deliveryTime:"25-35 min", emoji:"🍕", menu:[
    {id:6,name:"Margherita",price:299,desc:"Classic tomato & mozzarella",veg:true,emoji:"🍕"},
    {id:7,name:"Pepperoni",price:399,desc:"Loaded pepperoni slices",veg:false,emoji:"🍕"},
    {id:8,name:"Garlic Bread",price:149,desc:"Cheesy garlic bread sticks",veg:true,emoji:"🧄"},
    {id:9,name:"Pasta Alfredo",price:249,desc:"Creamy white sauce pasta",veg:true,emoji:"🍝"},
    {id:10,name:"Tiramisu",price:199,desc:"Italian coffee dessert",veg:true,emoji:"🍰"},
  ]},
  { id:3, name:"Dragon Wok", cuisine:"Chinese", rating:4.1, deliveryTime:"35-45 min", emoji:"🥡", menu:[
    {id:11,name:"Fried Rice",price:180,desc:"Wok-tossed with vegetables",veg:true,emoji:"🍚"},
    {id:12,name:"Manchurian",price:200,desc:"Crispy veg in spicy sauce",veg:true,emoji:"🥟"},
    {id:13,name:"Chow Mein",price:170,desc:"Stir-fried noodles",veg:true,emoji:"🍜"},
    {id:14,name:"Chicken 65",price:240,desc:"Spicy fried chicken bites",veg:false,emoji:"🍗"},
    {id:15,name:"Spring Rolls",price:150,desc:"Crispy vegetable rolls",veg:true,emoji:"🌯"},
  ]},
  { id:4, name:"South Express", cuisine:"South Indian", rating:4.6, deliveryTime:"20-30 min", emoji:"🥞", menu:[
    {id:16,name:"Masala Dosa",price:120,desc:"Crispy crepe with potato",veg:true,emoji:"🥞"},
    {id:17,name:"Idli Sambar",price:80,desc:"Steamed rice cakes",veg:true,emoji:"🫓"},
    {id:18,name:"Vada",price:70,desc:"Crispy lentil fritters",veg:true,emoji:"🍩"},
    {id:19,name:"Filter Coffee",price:50,desc:"Traditional South Indian coffee",veg:true,emoji:"☕"},
    {id:20,name:"Uttapam",price:130,desc:"Thick pancake with toppings",veg:true,emoji:"🥞"},
  ]},
];

const CATS = ["All","North Indian","Italian","Chinese","South Indian"];

function getLS(k,fb){if(typeof window==="undefined")return fb;const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}
function setLS(k,v){localStorage.setItem(k,JSON.stringify(v));}

export default function FoodApp() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [selRest, setSelRest] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { setCart(getLS("food_cart", [])); }, []);
  useEffect(() => { setLS("food_cart", cart); }, [cart]);

  function showT(m) { setToast(m); setTimeout(() => setToast(""), 2500); }

  function addToCart(item, restName) {
    setCart(c => {
      const existing = c.find(ci => ci.id === item.id);
      if (existing) return c.map(ci => ci.id === item.id ? {...ci, qty: ci.qty + 1} : ci);
      return [...c, {...item, qty: 1, restaurant: restName}];
    });
    showT(`${item.name} added!`);
  }

  function updateQty(id, delta) {
    setCart(c => c.map(ci => ci.id === id ? {...ci, qty: Math.max(0, ci.qty + delta)} : ci).filter(ci => ci.qty > 0));
  }

  const cartTotal = cart.reduce((s, ci) => s + ci.price * ci.qty, 0);
  const cartCount = cart.reduce((s, ci) => s + ci.qty, 0);

  function placeOrder() {
    const orders = getLS("food_orders", []);
    orders.push({ items: cart, total: cartTotal, date: new Date().toISOString(), status: "Preparing" });
    setLS("food_orders", orders);
    setCart([]); setCartOpen(false); setOrdered(true); showT("Order placed!");
  }

  const filteredRests = RESTAURANTS.filter(r => {
    if (cat !== "All" && r.cuisine !== cat) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.cuisine.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (ordered) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f0fdf4"}}>
      <div className="order-success">
        <h2>🎉 Order Placed!</h2>
        <p>Your food is being prepared. Estimated delivery: 30-40 min.</p>
        <button className="btn btn-accent btn-lg" style={{marginTop:20}} onClick={() => setOrdered(false)}>Order More →</button>
      </div>
    </div>
  );

  return (
    <div>
      <nav className="navbar">
        <span className="logo">🍽️ Food<span>Express</span></span>
        <div className="nav-right">
          <button className="cart-btn" onClick={() => setCartOpen(true)}>🛒 {cartCount > 0 && <span className="cart-count">{cartCount}</span>}</button>
        </div>
      </nav>
      <div className="container">
        {!selRest ? (
          <>
            <div className="hero"><h1>Hungry? We got you!</h1><p>Order from the best restaurants near you</p></div>
            <div className="search-bar"><input className="input" placeholder="Search restaurants or cuisines..." value={search} onChange={e => setSearch(e.target.value)} /></div>
            <div className="cat-tabs" style={{marginTop:16}}>
              {CATS.map(c => <button key={c} className={`cat-tab ${cat===c?"active":""}`} onClick={() => setCat(c)}>{c}</button>)}
            </div>
            <div className="rest-grid">
              {filteredRests.map(r => (
                <div key={r.id} className="rest-card" onClick={() => setSelRest(r)}>
                  <div className="rest-banner">{r.emoji}</div>
                  <div className="rest-body">
                    <div className="rest-name">{r.name}</div>
                    <div className="rest-cuisine">{r.cuisine}</div>
                    <div className="rest-meta"><span className="rating">★ {r.rating}</span><span>·</span><span>{r.deliveryTime}</span><span>·</span><span>{r.menu.length} items</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <button className="back-link" onClick={() => setSelRest(null)}>← Back to restaurants</button>
            <h2 style={{fontSize:22,fontWeight:700,marginBottom:4}}>{selRest.emoji} {selRest.name}</h2>
            <p style={{color:"var(--text-sec)",fontSize:13,marginBottom:16}}>{selRest.cuisine} · ★ {selRest.rating} · {selRest.deliveryTime}</p>
            <div className="menu-grid">
              {selRest.menu.map(item => {
                const inCart = cart.find(c => c.id === item.id);
                return (
                  <div key={item.id} className="menu-item">
                    <div className="menu-img">{item.emoji}</div>
                    <div className="menu-info">
                      <div className="menu-name">{item.name}</div>
                      <span className={`veg-badge ${item.veg ? "veg" : "non-veg"}`}>{item.veg ? "VEG" : "NON-VEG"}</span>
                      <div className="menu-desc">{item.desc}</div>
                      <div className="menu-bottom">
                        <span className="menu-price">₹{item.price}</span>
                        {inCart ? (
                          <div className="qty-ctrl">
                            <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                            <span style={{fontWeight:700}}>{inCart.qty}</span>
                            <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                          </div>
                        ) : (
                          <button className="btn btn-accent btn-sm" onClick={() => addToCart(item, selRest.name)}>Add +</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Cart Drawer */}
      <div className={`overlay ${cartOpen ? "active" : ""}`} onClick={() => setCartOpen(false)} />
      <div className={`cart-drawer ${cartOpen ? "open" : ""}`}>
        <div className="cart-header"><h2>🛒 Cart</h2><button className="btn btn-outline btn-sm" onClick={() => setCartOpen(false)}>✕</button></div>
        <div className="cart-items">
          {cart.length === 0 ? <div className="empty-state">Cart is empty</div> :
          cart.map(ci => (
            <div key={ci.id} className="cart-item">
              <div className="cart-item-info"><h4>{ci.name}</h4><p>{ci.restaurant} · ₹{ci.price}</p></div>
              <div className="qty-ctrl">
                <button className="qty-btn" onClick={() => updateQty(ci.id, -1)}>−</button>
                <span style={{fontWeight:700}}>{ci.qty}</span>
                <button className="qty-btn" onClick={() => updateQty(ci.id, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total"><span>Total</span><span>₹{cartTotal}</span></div>
            <button className="btn btn-accent btn-lg btn-block" onClick={placeOrder}>Place Order →</button>
          </div>
        )}
      </div>
      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}
