import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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

const NAV = [
  { l: "Home", id: "/", isRoute: true },
  { l: "About", id: "/#about", isRoute: true },
  { l: "Services", id: "/#services", isRoute: true },
  { l: "Prices", id: "/#prices", isRoute: true },
  { l: "Team", id: "/#team", isRoute: true },
  { l: "Tutorial", id: "/#tutorial", isRoute: true },
  { l: "Testimoni", id: "/#testimonials", isRoute: true },
  // Gallery is handled explicitly with dropdown
];

const PHOTOS = [
  "/gallery_haircut.png",
  "/gallery_coloring.png",
  "/gallery_perm.png",
  "/gallery_shaving.png",
  "/gallery_haircut.png", // reusing for demo
  "/gallery_coloring.png", // reusing for demo
];

const VIDEOS = [
  "https://www.youtube.com/embed/-elZgzPc8u4",
  "https://www.youtube.com/embed/-elZgzPc8u4",
  "https://www.youtube.com/embed/-elZgzPc8u4",
  "https://www.youtube.com/embed/-elZgzPc8u4",
];


export function GalleryPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    document.title = "Pointcut Hairstudio - Gallery";
    window.scrollTo(0, 0);

    const id = "pc-f";
    if (!document.getElementById(id)) {
      const l = document.createElement("link");
      l.id = id;
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500&display=swap";
      document.head.appendChild(l);
    }

    const h = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", h);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", h);
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const go = (path: string, isHash: boolean = false) => {
    setMenu(false);
    if (isHash) {
      if (path.startsWith("/")) {
        navigate(path);
      } else {
        const el = document.getElementById(path);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    } else {
      navigate(path);
    }
  };

  const startBooking = () => {
    setMenu(false);
    navigate("/booking");
  };

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
        body{font-family:'DM Sans',sans-serif;background:#0d0d0d;color:rgba(255,255,255,0.88);overflow-x:hidden}
        img{max-width:100%;display:block}button{cursor:pointer;font-family:inherit}
        .font-serif{font-family:'Playfair Display',serif}
        .font-oswald{font-family:'Oswald',sans-serif}
        .font-dm{font-family:'DM Sans',sans-serif}
        .btn-gold{background:#c8a96e;color:#0d0d0d;font-family:'Oswald',sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:13px 30px;border:none;transition:.25s;cursor:pointer;border-radius:1px}
        .btn-gold:hover{background:#e6c98a;color:#0d0d0d}
        .nav-link{background:none;border:none;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;padding:4px 0;transition:.2s;cursor:pointer;letter-spacing:0.3px}
        .nav-link:hover{color:#c8a96e}
        .nav-link-inactive{color:rgba(255,255,255,0.75);border-bottom:1px solid transparent}
        .mnl{background:none;border:none;color:rgba(255,255,255,0.85);font-family:'DM Sans',sans-serif;font-size:16px;font-weight:500;padding:14px 0;text-align:left;border-bottom:1px solid rgba(255,255,255,.06);width:100%;transition:.2s;cursor:pointer}
        .mnl:hover{color:#c8a96e}
        
        .g-img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:2px;transition:.4s}
        .g-img:hover{transform:scale(1.02);box-shadow:0 8px 24px rgba(0,0,0,.5)}
        
        .yt-short-wrapper {
          position: relative;
          width: 100%;
          max-width: 260px;
          margin: 0 auto;
          aspect-ratio: 9 / 16;
          border-radius: 8px;
          overflow: hidden;
          background-color: #111;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          transition: transform 0.3s ease;
        }
        .yt-short-wrapper:hover {
           transform: translateY(-4px);
        }
        .yt-short-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: #1f1f1f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px;
          padding: 8px 0;
          min-width: 140px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }
        .dropdown-item {
          display: block;
          padding: 10px 20px;
          color: rgba(255,255,255,0.8);
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          transition: color 0.2s, background 0.2s;
        }
        .dropdown-item:hover {
          color: #c8a96e;
          background: rgba(255,255,255,0.03);
        }
        
        .m-dropdown-wrap {
           margin-top: 8px;
           margin-bottom: 8px;
           padding-left: 16px;
           border-left: 2px solid rgba(200, 169, 110, 0.3);
           display: flex;
           flex-direction: column;
           gap: 8px;
        }

        @media(max-width:768px){
          .nav-links{display:none!important}
          .nav-cta{display:none!important}
          .m-btn{display:block!important}
          .photo-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .video-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media(max-width:500px){
          .photo-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          .video-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          .yt-short-wrapper { max-width: 100% !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-[999] flex items-center justify-between transition-all duration-300"
        style={{
          height: "68px",
          padding: "0 5%",
          background: scrolled ? C.dark : "rgba(13, 13, 13, 0.95)",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,.4)" : "none",
          borderBottom: scrolled ? "none" : "1px solid rgba(255,255,255,0.05)"
        }}
      >
        <img
          src="/logopointcut.png"
          alt="Point Cut"
          style={{ height: "44px", cursor: "pointer" }}
          onClick={() => go("/")}
        />
        <ul
          className="nav-links flex gap-7 list-none items-center"
          style={{ display: "flex", margin: 0 }}
        >
          {NAV.map((n) => (
            <li key={n.id}>
              <button
                className="nav-link nav-link-inactive"
                onClick={() => go(n.id, n.isRoute)}
              >
                {n.l}
              </button>
            </li>
          ))}
          
          <li className="relative" ref={dropdownRef}>
            <button
               className="nav-link nav-link-inactive flex items-center gap-1"
               onClick={() => setDropdownOpen(!dropdownOpen)}
            >
               Gallery
               <svg style={{width:'10px', height:'10px', marginLeft:'2px', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
               <button className="dropdown-item" onClick={() => { setDropdownOpen(false); go('video-section', true); }}>Videos</button>
               <button className="dropdown-item" onClick={() => { setDropdownOpen(false); go('photo-section', true); }}>Photos</button>
            </div>
          </li>
        </ul>
        
        <div className="nav-cta" style={{ display: "block" }}>
          <button className="btn-gold" onClick={startBooking}>
            RESERVASI
          </button>
        </div>
        
        <button
          className="m-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "26px",
          }}
          onClick={() => setMenu((o) => !o)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className="fixed inset-0 z-[1000] transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,.55)",
          opacity: menu ? 1 : 0,
          pointerEvents: menu ? "all" : "none",
        }}
        onClick={() => setMenu(false)}
      />
      <div
        className="fixed top-0 right-0 bottom-0 z-[1001] flex flex-col overflow-y-auto transition-transform duration-300"
        style={{
          width: "280px",
          background: C.dark,
          transform: menu ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div
          className="flex items-center justify-between border-b"
          style={{ padding: "20px 24px", borderColor: "rgba(255,255,255,.08)" }}
        >
           <img
             src="/logopointcut.png"
             alt="Point Cut"
             style={{ height: "36px" }}
           />
           <button
             style={{
               background: "none",
               border: "none",
               color: "#fff",
               fontSize: "26px",
               cursor: "pointer",
               opacity: 0.7,
             }}
             onClick={() => setMenu(false)}
           >
             ×
           </button>
        </div>
        <div
          className="flex flex-col flex-1"
          style={{ padding: "16px 24px", gap: "4px" }}
        >
           {NAV.map((n) => (
             <button
               key={n.id}
               className="mnl"
               onClick={() => go(n.id, n.isRoute)}
             >
               {n.l}
             </button>
           ))}
           
           <div className="mnl" style={{borderBottom: 'none'}}>Gallery</div>
           <div className="m-dropdown-wrap">
             <button className="nav-link nav-link-inactive" style={{textAlign: 'left'}} onClick={() => go('photo-section', true)}>Photo Gallery</button>
             <button className="nav-link nav-link-inactive" style={{textAlign: 'left'}} onClick={() => go('video-section', true)}>Video Shorts</button>
           </div>
           
           <div style={{ marginTop: "20px" }}>
             <button
               className="btn-gold w-full"
               style={{ width: "100%" }}
               onClick={startBooking}
             >
               RESERVASI SEKARANG
             </button>
           </div>
        </div>
      </div>

      <div style={{ paddingTop: "100px", paddingBottom: "80px" }}>
        
        {/* Header Title */}
        <section className="text-center px-4" style={{ marginBottom: "60px" }}>
          <p className="font-dm uppercase" style={{ fontSize: "11px", letterSpacing: "4px", color: C.gold, marginBottom: "12px" }}>
            Our Portfolio
          </p>
          <h1 className="font-serif capitalize" style={{ fontSize: "clamp(36px, 5vw, 56px)", marginBottom: "16px", lineHeight: 1.1 }}>
            Barbershop Gallery
          </h1>
          <p style={{ color: C.muted, maxWidth: "600px", margin: "0 auto", fontSize: "15px" }}>
            See our finest works, haircuts, and transformations. Browse through our photos and video shorts.
          </p>
        </section>

        {/* Video Gallery Section */}
        <section id="video-section" style={{ padding: "0 5%", marginBottom: "80px" }}>
          <div className="flex justify-between items-end" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "16px", marginBottom: "40px" }}>
            <div>
              <h2 className="font-oswald uppercase" style={{ fontSize: "28px", letterSpacing: "1px" }}>Video Shorts</h2>
              <p style={{ color: C.muted, fontSize: "14px", marginTop: "4px" }}>Transformations and hair styling satisfying videos.</p>
            </div>
          </div>
          
          <div className="video-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 260px))",
            justifyContent: "center",
            gap: "16px",
          }}>
            {VIDEOS.map((src, idx) => (
              <div key={idx} className="yt-short-wrapper">
                <iframe 
                  src={src} 
                  title={`YouTube Short ${idx}`} 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </section>

        {/* Photo Gallery Section */}
        <section id="photo-section" style={{ padding: "0 5%" }}>
          <div className="flex justify-between items-end" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "16px", marginBottom: "40px" }}>
            <div>
              <h2 className="font-oswald uppercase" style={{ fontSize: "28px", letterSpacing: "1px" }}>Photo Gallery</h2>
              <p style={{ color: C.muted, fontSize: "14px", marginTop: "4px" }}>Perfect fades, clean shaves, and classic cuts.</p>
            </div>
          </div>

          <div className="photo-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}>
            {PHOTOS.map((src, idx) => (
              <div key={idx} style={{ overflow: 'hidden', borderRadius: '4px' }}>
                <img 
                   src={src} 
                   alt={`Gallery Photo ${idx}`} 
                   className="g-img" 
                   onError={(e) => { (e.target as HTMLImageElement).src = '/gallery_haircut.png' }}
                />
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
