"use client";
import { useState, useEffect } from "react";

const DESTINATIONS = [
  {id:1,name:"Goa Beach Retreat",location:"Goa, India",type:"Beach",emoji:"🏖️",price:8999,duration:"3 nights",rating:4.5,color:"#0ea5e9",
    itinerary:[{day:"Day 1",desc:"Arrive in Goa. Check-in at beach resort. Evening at Baga Beach, sunset cruise."},{day:"Day 2",desc:"Water sports at Calangute. Lunch at beachside shack. Visit Fort Aguada. Night market."},{day:"Day 3",desc:"Old Goa churches tour. Spice plantation visit. Farewell dinner."}]},
  {id:2,name:"Manali Adventure Camp",location:"Himachal Pradesh",type:"Mountain",emoji:"🏔️",price:12999,duration:"4 nights",rating:4.7,color:"#16a34a",
    itinerary:[{day:"Day 1",desc:"Arrive in Manali. Check-in at camp. Evening bonfire and stargazing."},{day:"Day 2",desc:"Rohtang Pass trip. Snow activities and photography."},{day:"Day 3",desc:"River rafting in Beas. Paragliding at Solang Valley."},{day:"Day 4",desc:"Old Manali exploration. Mall Road shopping. Departure."}]},
  {id:3,name:"Jaipur Heritage Tour",location:"Rajasthan",type:"Heritage",emoji:"🏰",price:6999,duration:"2 nights",rating:4.3,color:"#ea580c",
    itinerary:[{day:"Day 1",desc:"Arrive in Jaipur. Visit Hawa Mahal and City Palace. Traditional Rajasthani dinner."},{day:"Day 2",desc:"Amber Fort morning tour. Nahargarh Fort sunset. Local bazaar shopping."}]},
  {id:4,name:"Kerala Backwaters",location:"Kerala",type:"Nature",emoji:"🌴",price:15999,duration:"4 nights",rating:4.8,color:"#0f766e",
    itinerary:[{day:"Day 1",desc:"Arrive in Kochi. Fort Kochi walk. Chinese fishing nets. Kathakali show."},{day:"Day 2",desc:"Drive to Munnar. Tea plantation visit. Eravikulam National Park."},{day:"Day 3",desc:"Alleppey houseboat cruise. Backwater exploration."},{day:"Day 4",desc:"Kovalam beach. Light house. Departure."}]},
  {id:5,name:"Andaman Island Escape",location:"Andaman Islands",type:"Beach",emoji:"🏝️",price:22999,duration:"5 nights",rating:4.6,color:"#7c3aed",
    itinerary:[{day:"Day 1",desc:"Arrive in Port Blair. Cellular Jail visit and light & sound show."},{day:"Day 2",desc:"Ferry to Havelock Island. Radhanagar Beach."},{day:"Day 3",desc:"Scuba diving at Elephant Beach. Snorkeling."},{day:"Day 4",desc:"Neil Island day trip. Natural bridge. Coral reefs."},{day:"Day 5",desc:"Ross Island tour. Water sports. Departure."}]},
  {id:6,name:"Varanasi Spiritual Journey",location:"Uttar Pradesh",type:"Heritage",emoji:"🕉️",price:5499,duration:"2 nights",rating:4.2,color:"#b45309",
    itinerary:[{day:"Day 1",desc:"Arrive in Varanasi. Evening Ganga Aarti at Dashashwamedh Ghat."},{day:"Day 2",desc:"Morning boat ride on Ganges. Kashi Vishwanath Temple. Sarnath excursion."}]},
];

const TYPES = ["All","Beach","Mountain","Heritage","Nature"];

function getLS(k,fb){if(typeof window==="undefined")return fb;const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}
function setLS(k,v){localStorage.setItem(k,JSON.stringify(v));}

export default function TravelApp(){
  const [page,setPage]=useState("explore");const [search,setSearch]=useState("");const [typeFilter,setTypeFilter]=useState("All");const [active,setActive]=useState(null);const [bookings,setBookings]=useState([]);const [modal,setModal]=useState(false);const [toast,setToast]=useState("");

  useEffect(()=>{setBookings(getLS("travel_bookings",[]));},[page]);
  function showT(m){setToast(m);setTimeout(()=>setToast(""),2500);}

  function bookTrip(dest,name,date,travelers){
    const b=getLS("travel_bookings",[]);
    b.push({id:Date.now(),destination:dest.name,location:dest.location,traveler:name,date,travelers:+travelers,price:dest.price*(+travelers),status:"Confirmed",bookedAt:new Date().toISOString().split("T")[0]});
    setLS("travel_bookings",b);setBookings(b);setModal(false);showT("Trip booked!");
  }

  const filtered=DESTINATIONS.filter(d=>{if(typeFilter!=="All"&&d.type!==typeFilter)return false;if(search&&!d.name.toLowerCase().includes(search.toLowerCase())&&!d.location.toLowerCase().includes(search.toLowerCase()))return false;return true;});

  if(active){
    return(
      <div><nav className="navbar"><span className="logo">✈️ Travel<span>Ease</span></span></nav>
      <div className="container">
        <button className="back-btn" onClick={()=>setActive(null)}>← Back</button>
        <div className="hero" style={{background:`linear-gradient(135deg,${active.color},${active.color}99)`}}><h1>{active.emoji} {active.name}</h1><p>{active.location} · {active.duration} · ★ {active.rating}</p></div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginTop:20}}>
          <div><div className="card"><h2>Itinerary</h2>{active.itinerary.map((d,i)=>(<div key={i} className="itinerary-day"><h4>{d.day}</h4><p>{d.desc}</p></div>))}</div></div>
          <div className="card" style={{height:"fit-content"}}><h2>Book This Trip</h2>
            <p style={{fontSize:24,fontWeight:700,color:"var(--accent)",marginBottom:4}}>₹{active.price.toLocaleString()}<span style={{fontSize:12,color:"var(--text-sec)",fontWeight:400}}> / person</span></p>
            <div style={{fontSize:13,color:"var(--text-sec)",marginBottom:16}}>{active.duration} · {active.type}</div>
            <button className="btn btn-primary btn-block btn-lg" onClick={()=>setModal(true)}>Book Now →</button>
          </div>
        </div>
      </div>
      {modal&&<BookingModal dest={active} onBook={bookTrip} onClose={()=>setModal(false)}/>}
      <div className={`toast ${toast?"show":""}`}>{toast}</div></div>
    );
  }

  return(
    <div><nav className="navbar"><span className="logo">✈️ Travel<span>Ease</span></span>
      <div className="nav-links"><button className={`nav-btn ${page==="explore"?"active":""}`} onClick={()=>setPage("explore")}>Explore</button><button className={`nav-btn ${page==="bookings"?"active":""}`} onClick={()=>setPage("bookings")}>My Bookings</button></div>
    </nav>
    <div className="container">
      {page==="explore"&&(<>
        <div className="hero"><h1>Explore India</h1><p>Discover amazing destinations and book your next adventure</p>
          <div className="search-row"><input placeholder="Where to?" value={search} onChange={e=>setSearch(e.target.value)} style={{borderRadius:8}}/><select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} style={{borderRadius:8}}>{TYPES.map(t=><option key={t}>{t}</option>)}</select><button className="btn" style={{background:"white",color:"var(--accent)",fontWeight:700}}>Search</button></div>
        </div>
        <div className="dest-grid">{filtered.map(d=>(
          <div key={d.id} className="dest-card" onClick={()=>setActive(d)}>
            <div className="dest-img" style={{background:`linear-gradient(135deg,${d.color}33,${d.color}11)`}}>{d.emoji}</div>
            <div className="dest-body"><div className="dest-name">{d.name}</div><div className="dest-loc">📍 {d.location}</div>
              <div className="dest-meta"><span className="badge badge-blue">{d.type}</span><span className="badge badge-green">{d.duration}</span><span className="badge badge-amber">★ {d.rating}</span></div>
              <div className="dest-price">₹{d.price.toLocaleString()} <span>/ person</span></div>
            </div>
          </div>
        ))}</div>
      </>)}
      {page==="bookings"&&(<div className="card"><h2>My Bookings</h2>
        {bookings.length===0?<div className="empty-state">No bookings yet. Explore destinations!</div>:
        <table><thead><tr><th>Destination</th><th>Traveler</th><th>Date</th><th>Travelers</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>{bookings.map(b=>(<tr key={b.id}><td><strong>{b.destination}</strong><br/><span style={{fontSize:11,color:"var(--text-sec)"}}>{b.location}</span></td><td>{b.traveler}</td><td>{b.date}</td><td>{b.travelers}</td><td style={{fontWeight:700,color:"var(--accent)"}}>₹{b.price.toLocaleString()}</td><td><span className="badge badge-green">{b.status}</span></td></tr>))}</tbody></table>}
      </div>)}
    </div>
    <div className={`toast ${toast?"show":""}`}>{toast}</div></div>
  );
}

function BookingModal({dest,onBook,onClose}){
  const[name,setName]=useState("");const[date,setDate]=useState("");const[travelers,setTravelers]=useState(1);
  return(
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal"><h3>Book: {dest.name}</h3>
        <div className="form-group"><label>Name</label><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/></div>
        <div className="form-row"><div className="form-group"><label>Travel Date</label><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
        <div className="form-group"><label>Travelers</label><input className="input" type="number" min="1" max="10" value={travelers} onChange={e=>setTravelers(e.target.value)}/></div></div>
        <p style={{fontSize:16,fontWeight:700,color:"var(--accent)",marginTop:8}}>Total: ₹{(dest.price*travelers).toLocaleString()}</p>
        <div className="modal-actions"><button className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={()=>{if(!name||!date)return;onBook(dest,name,date,travelers);}}>Confirm Booking</button></div>
      </div>
    </div>
  );
}
