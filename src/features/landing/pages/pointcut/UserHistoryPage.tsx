import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Storage } from "@/services/storage";
import { useAuth } from "@/hooks/useAuth";

const C = {
  dark: "#0d0d0d",
  dark2: "#161616",
  cream: "#0d0d0d",
  beige: "#161616",
  gold: "#c8a96e",
  goldLight: "#e6c98a",
  white: "#fff",
  muted: "rgba(255,255,255,0.5)",
  text: "rgba(255,255,255,0.88)",
  border: "rgba(255,255,255,0.08)",
  surface: "#1f1f1f",
};

export function UserHistoryPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [tab, setTab] = useState<"reservasi" | "pembayaran">("reservasi");
  const [history, setHistory] = useState<any[]>([]);
  
  useEffect(() => {
    document.title = "History - Pointcut";
    const token = localStorage.getItem("customer_token");
    if (!token) {
      navigate("/user/login");
      return;
    }
    const customerName = localStorage.getItem("customer_name") || "Pelanggan";
    
    // Fetch user reservations
    try {
      const allRes = Storage.get<any[]>("reservations", []);
      const userRes = allRes.filter(r => r.customer_name === customerName);
      setHistory(userRes);
    } catch {}

    const id = "pc-f";
    if (!document.getElementById(id)) {
      const l = document.createElement("link");
      l.id = id;
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500&display=swap";
      document.head.appendChild(l);
    }
  }, [navigate]);

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'DM Sans',sans-serif;background:#0d0d0d;color:rgba(255,255,255,0.88);overflow-x:hidden}
        .font-serif{font-family:'Playfair Display',serif}
        .font-oswald{font-family:'Oswald',sans-serif}
        .btn-outline{background:transparent;border:1px solid rgba(255,255,255,0.2);color:#fff;font-family:'Oswald',sans-serif;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:12px 28px;transition:.2s;cursor:pointer;}
        .btn-outline:hover{border-color:#c8a96e;color:#c8a96e}
        .nav-head{height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 5%;border-bottom:1px solid rgba(255,255,255,0.08);background:#0d0d0d;}
        
        .tab-btn{background:transparent;font-family:'Oswald',sans-serif;font-size:14px;letter-spacing:2px;text-transform:uppercase;padding:14px 32px;border:none;border-bottom:2px solid transparent;color:rgba(255,255,255,0.5);transition:.25s;cursor:pointer;}
        .tab-btn:hover{color:#c8a96e;}
        .tab-active{color:#c8a96e;border-color:#c8a96e;}
        
        .card-item{background:#161616;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:24px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;transition:.2s}
        .card-item:hover{border-color:rgba(200,169,110,0.3)}
        
        @media(max-width:600px){
           .card-item{flex-direction:column;align-items:flex-start;gap:16px;}
        }
      `}</style>

      {/* Navbar */}
      <nav className="nav-head">
        <Link to="/"><img src="/logopointcut.png" alt="Point Cut" style={{height:"40px"}} /></Link>
        <div style={{display:'flex', gap:'16px'}}>
          <Link to="/user/profile" className="btn-outline" style={{textDecoration:'none', padding:'10px 20px'}}>PROFILE</Link>
          <button className="btn-outline" onClick={async () => { await logout(); navigate('/'); }} style={{padding:'10px 20px', borderColor:'rgba(255,50,50,0.3)', color:'#ff6b6b'}}>LOGOUT</button>
        </div>
      </nav>

      <div style={{padding:"60px 5%", minHeight:"calc(100vh - 72px)", maxWidth:"900px", margin:"0 auto"}}>
        <div style={{textAlign:'center', marginBottom:'40px'}}>
             <div style={{fontSize:'24px', color:C.gold, marginBottom:'12px', opacity:0.8}}>✂</div>
             <h1 className="font-serif" style={{fontSize:'42px', fontWeight:700}}>Riwayat Aktivitas</h1>
             <p style={{color:C.muted, fontSize:'14px', marginTop:'8px'}}>Lihat daftar reservasi dan transaksi pembayaran Anda.</p>
        </div>

        <div style={{display:'flex', justifyContent:'center', borderBottom:`1px solid ${C.border}`, marginBottom:'32px'}}>
          <button className={`tab-btn ${tab === 'reservasi' ? 'tab-active' : ''}`} onClick={()=>setTab('reservasi')}>Reservasi Saya</button>
          <button className={`tab-btn ${tab === 'pembayaran' ? 'tab-active' : ''}`} onClick={()=>setTab('pembayaran')}>History Pembayaran</button>
        </div>

        <div>
          {history.length === 0 ? (
             <div style={{textAlign:'center', padding:'60px 20px', background:C.dark2, borderRadius:'8px', border:`1px solid ${C.border}`}}>
                <p style={{color:C.muted, fontSize:'15px'}}>Tidak ada data ditemukan.</p>
                <Link to="/booking" className="btn-outline" style={{display:'inline-block', marginTop:'20px', textDecoration:'none', borderColor:C.gold, color:C.gold}}>BUAT RESERVASI</Link>
             </div>
          ) : (
             tab === 'reservasi' ? (
                history.map((h, i) => (
                  <div key={i} className="card-item">
                     <div>
                        <div style={{display:'flex', gap:'12px', alignItems:'center', marginBottom:'12px'}}>
                          <span className="font-oswald" style={{background:'rgba(200,169,110,0.1)', color:C.gold, padding:'4px 10px', fontSize:'12px', letterSpacing:'1px', borderRadius:'4px'}}>
                            {h.queue_number || 'N/A'}
                          </span>
                          <span style={{color:C.muted, fontSize:'13px'}}>{h.booking_date} | {h.start_time}</span>
                        </div>
                        <h3 className="font-serif" style={{fontSize:'22px', marginBottom:'4px'}}>{h.service?.name || 'Haircut'}</h3>
                        <p style={{fontSize:'14px', color:C.muted}}>Kapster: {h.capster?.name}</p>
                     </div>
                     <div style={{textAlign:'right'}}>
                        <div className="font-oswald" style={{fontSize:'13px', background:h.queue?.status === 'waiting' ? 'rgba(59,130,246,0.1)' : h.queue?.status === 'done' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color:h.queue?.status === 'waiting' ? '#3B82F6' : h.queue?.status === 'done' ? '#10B981' : '#EF4444', padding:'6px 12px', borderRadius:'4px', display:'inline-block', letterSpacing:'1px', textTransform:'uppercase'}}>
                          {h.queue?.status === 'waiting' ? 'Menunggu' : h.queue?.status === 'done' ? 'Selesai' : h.queue?.status === 'cancelled' ? 'Dibatalkan' : 'Menunggu'}
                        </div>
                     </div>
                  </div>
                ))
             ) : (
                history.map((h, i) => (
                  <div key={i} className="card-item">
                     <div>
                        <div style={{color:C.muted, fontSize:'13px', marginBottom:'8px'}}>{h.booking_date}</div>
                        <h3 className="font-serif" style={{fontSize:'20px', marginBottom:'4px'}}>Pembayaran {h.service?.name || 'Layanan'}</h3>
                        <p style={{fontSize:'13px', color:C.muted}}>Metode: {h.payment?.method?.toUpperCase().replace('_', ' ') || 'CASH'}</p>
                     </div>
                     <div style={{textAlign:'right'}}>
                        <div className="font-oswald" style={{fontSize:'20px', color:C.gold, marginBottom:'8px'}}>Rp {h.payment?.amount?.toLocaleString('id-ID') || '50.000'}</div>
                        <div className="font-oswald" style={{fontSize:'12px', background:h.payment?.status === 'paid' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color:h.payment?.status === 'paid' ? '#10B981' : '#F59E0B', padding:'4px 10px', borderRadius:'4px', display:'inline-block', letterSpacing:'1px', textTransform:'uppercase'}}>
                          {h.payment?.status === 'paid' ? 'BERHASIL' : 'PENDING'}
                        </div>
                     </div>
                  </div>
                ))
             )
          )}
        </div>
      </div>
    </>
  );
}
