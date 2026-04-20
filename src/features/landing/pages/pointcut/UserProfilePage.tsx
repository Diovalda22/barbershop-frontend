import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  fS: "'Playfair Display',serif",
  fB: "'DM Sans',sans-serif",
  fO: "'Oswald',sans-serif",
};

export function UserProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    document.title = "User Profile - Pointcut";
    const token = localStorage.getItem("customer_token");
    if (!token) {
      navigate("/user/login");
      return;
    }
    const storedName = localStorage.getItem("customer_name") || "Pelanggan";
    setName(storedName);

    const id = "pc-f";
    if (!document.getElementById(id)) {
      const l = document.createElement("link");
      l.id = id;
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500&display=swap";
      document.head.appendChild(l);
    }
  }, [navigate]);

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    localStorage.setItem("customer_name", name);
    setMessage("Nama berhasil diperbarui!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    if (password !== confirmPassword) {
      setMessage("Password dan konfirmasi tidak cocok!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    // Simulation
    setMessage("Password berhasil diperbarui!");
    setPassword("");
    setConfirmPassword("");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'DM Sans',sans-serif;background:#0d0d0d;color:rgba(255,255,255,0.88);overflow-x:hidden}
        .font-serif{font-family:'Playfair Display',serif}
        .font-oswald{font-family:'Oswald',sans-serif}
        .btn-gold{background:#c8a96e;color:#0d0d0d;font-family:'Oswald',sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:13px 30px;border:none;transition:.25s;cursor:pointer;border-radius:1px}
        .btn-gold:hover{background:#e6c98a;color:#0d0d0d}
        .btn-outline{background:transparent;border:1px solid rgba(255,255,255,0.2);color:#fff;font-family:'Oswald',sans-serif;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:12px 28px;transition:.2s;cursor:pointer;}
        .btn-outline:hover{border-color:#c8a96e;color:#c8a96e}
        .input-dark{width:100%;background:#161616;border:1px solid rgba(255,255,255,0.08);color:#fff;padding:14px 18px;font-family:'DM Sans',sans-serif;font-size:14px;border-radius:4px;transition:.2s;outline:none;}
        .input-dark:focus{border-color:#c8a96e;}
        .form-group{margin-bottom:20px;}
        .form-label{display:block;font-family:'Oswald',sans-serif;font-size:12px;letter-spacing:1px;color:#c8a96e;text-transform:uppercase;margin-bottom:8px;}
        .nav-head{height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 5%;border-bottom:1px solid rgba(255,255,255,0.08);background:#0d0d0d;}
      `}</style>

      {/* Navbar */}
      <nav className="nav-head">
        <Link to="/"><img src="/logopointcut.png" alt="Point Cut" style={{height:"40px"}} /></Link>
        <div style={{display:'flex', gap:'16px'}}>
          <Link to="/user/history" className="btn-outline" style={{textDecoration:'none', padding:'10px 20px'}}>HISTORY</Link>
          <button className="btn-outline" onClick={handleLogout} style={{padding:'10px 20px', borderColor:'rgba(255,50,50,0.3)', color:'#ff6b6b'}}>LOGOUT</button>
        </div>
      </nav>

      <div style={{padding:"60px 5%", minHeight:"calc(100vh - 72px)", display:'flex', justifyContent:'center'}}>
        <div style={{maxWidth:"600px", width:"100%"}}>
          <div style={{textAlign:'center', marginBottom:'40px'}}>
             <div style={{fontSize:'24px', color:C.gold, marginBottom:'12px', opacity:0.8}}>✂</div>
             <h1 className="font-serif" style={{fontSize:'42px', fontWeight:700}}>Profile Settings</h1>
             <p style={{color:C.muted, fontSize:'14px', marginTop:'8px'}}>Kelola detail akun dan preferensi keamanan Anda.</p>
          </div>

          {message && (
            <div style={{background:'rgba(200,169,110,0.1)', border:'1px solid #c8a96e', color:'#c8a96e', padding:'14px 20px', borderRadius:'4px', marginBottom:'24px', fontSize:'14px', textAlign:'center'}}>
              {message}
            </div>
          )}

          <div style={{background:C.dark2, padding:'40px', borderRadius:'8px', border:`1px solid ${C.border}`, marginBottom:'32px'}}>
             <h2 className="font-oswald" style={{fontSize:'18px', color:'#fff', letterSpacing:'2px', marginBottom:'24px', paddingBottom:'12px', borderBottom:`1px solid ${C.border}`}}>DETAIL AKUN</h2>
             <form onSubmit={handleUpdateName}>
               <div className="form-group">
                 <label className="form-label">Nama Lengkap</label>
                 <input type="text" className="input-dark" value={name} onChange={e=>setName(e.target.value)} required />
               </div>
               <button type="submit" className="btn-gold" style={{width:'100%'}}>SIMPAN NAMA</button>
             </form>
          </div>

          <div style={{background:C.dark2, padding:'40px', borderRadius:'8px', border:`1px solid ${C.border}`}}>
             <h2 className="font-oswald" style={{fontSize:'18px', color:'#fff', letterSpacing:'2px', marginBottom:'24px', paddingBottom:'12px', borderBottom:`1px solid ${C.border}`}}>GANTI PASSWORD</h2>
             <form onSubmit={handleUpdatePassword}>
               <div className="form-group">
                 <label className="form-label">Password Baru</label>
                 <input type="password" className="input-dark" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
               </div>
               <div className="form-group">
                 <label className="form-label">Konfirmasi Password Baru</label>
                 <input type="password" className="input-dark" placeholder="••••••••" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required />
               </div>
               <button type="submit" className="btn-gold" style={{width:'100%'}}>UPDATE PASSWORD</button>
             </form>
          </div>

        </div>
      </div>
    </>
  );
}
