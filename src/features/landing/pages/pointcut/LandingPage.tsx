import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Storage } from "@/services/storage";

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
  { l: "Home", id: "home" },
  { l: "About", id: "about" },
  { l: "Services", id: "services" },
  { l: "Prices", id: "prices" },
  { l: "Team", id: "team" },
  { l: "Tutorial", id: "tutorial" },
  { l: "Testimoni", id: "testimonials" },
];
const HOURS = [
  ["SENIN", "13:30 – 21:00"],
  ["SELASA", "13:30 – 21:00"],
  ["RABU", "13:30 – 21:00"],
  ["KAMIS", "13:30 – 21:00"],
  ["JUMAT", "13:30 – 21:00"],
  ["SABTU", "13:30 – 21:00"],
  ["MINGGU", "13:30 – 21:00"],
];
const CLASSIC = [
  {
    img: "/gallery_haircut.png",
    name: "Haircut",
    items: [
      "Senior Haircut",
      "Premium Haircut",
      "Fade & Taper",
      "Line Up & Clean Up",
    ],
  },
  {
    img: "/gallery_coloring.png",
    name: "Coloring",
    items: [
      "Basic Coloring",
      "Highlight Bleaching",
      "Highlight Fashion",
      "Fashion Coloring Full",
    ],
  },
  {
    img: "/gallery_perm.png",
    name: "Perm & Waves",
    items: ["Curly Perm", "Wavy Perm", "Design Perm", "Down Perm", "Root Lift"],
  },
  {
    img: "/gallery_shaving.png",
    name: "Shaving & Extra",
    items: [
      "Classic Shaving",
      "Hair Tato",
      "Scalp Treatment",
      "Penataan Rambut",
    ],
  },
];
const MENU_ACC = [
  {
    title: "Haircut",
    items: [
      { n: "Senior Haircut", p: "Rp 35k" },
      { n: "Premium Senior Haircut", p: "Rp 30k" },
    ],
  },
  {
    title: "Coloring",
    items: [
      { n: "Basic Coloring", p: "Rp 70k" },
      { n: "Highlight Bleaching", p: "Rp 120k" },
      { n: "Highlight Fashion", p: "Rp 150k" },
      { n: "Fashion Coloring Full", p: "Rp 200k" },
    ],
  },
  {
    title: "Perm & Waves",
    items: [
      { n: "Curly Perm", p: "Rp 200k" },
      { n: "Wavy Perm", p: "Rp 200k" },
      { n: "Design Perm", p: "Rp 300k" },
      { n: "Root Lift", p: "Rp 65k" },
      { n: "Down Perm", p: "Rp 100k" },
    ],
  },
  {
    title: "Shaving & Extra",
    items: [
      { n: "Classic Shaving", p: "Rp 20k" },
      { n: "Hair Tato", p: "Rp 10k" },
    ],
  },
  {
    title: "Reservasi Online",
    items: [{ n: "Booking Online (Senior Capster)", p: "Rp 50k" }],
  },
];
const TESTI = [
  {
    t: "Hasilnya keren banget, kapster ramah dan profesional!",
    n: "Budi S.",
    r: 5,
  },
  {
    t: "Tempatnya bersih, nyaman, worth it banget. Sudah jadi langganan!",
    n: "Andi P.",
    r: 5,
  },
  {
    t: "Satu-satunya barbershop yang bisa bikin gue puas total.",
    n: "Fajar R.",
    r: 5,
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [capsters, setCapsters] = useState<any[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("home");
  const [acc, setAcc] = useState<number | null>(null);
  const [howTab, setHowTab] = useState<"online" | "offline">("online");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    document.title = "Pointcut Hairstudio";
    const link: any = document.querySelector("link[rel~='icon']");
    if (link) link.href = "/logopointcut.png";

    setIsLogged(!!localStorage.getItem("customer_token"));

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
      for (let i = NAV.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV[i].id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight / 3) {
          setActive(NAV[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", h);
    h();

    try {
      setCapsters(Storage.get<any[]>("capsters", []));
    } catch {}

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", h);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
    setActive(id);
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
        .nav-link-active{color:#c8a96e;border-bottom:1px solid #c8a96e}
        .nav-link-inactive{color:rgba(255,255,255,0.75);border-bottom:1px solid transparent}
        .mnl{background:none;border:none;color:rgba(255,255,255,0.85);font-family:'DM Sans',sans-serif;font-size:16px;font-weight:500;padding:14px 0;text-align:left;border-bottom:1px solid rgba(255,255,255,.06);width:100%;transition:.2s;cursor:pointer}
        .mnl:hover{color:#c8a96e}
        .mnl-active{color:#c8a96e}
        .acc-btn{width:100%;text-align:left;background:none;border:none;padding:18px 0;display:flex;justify-content:space-between;align-items:center;font-family:'Playfair Display',serif;font-size:16px;color:rgba(255,255,255,0.88);transition:.2s;cursor:pointer}
        .acc-btn:hover{color:#c8a96e}
        .how-tab{background:transparent;font-family:'Oswald',sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;padding:10px 32px;border:1px solid;transition:.25s;cursor:pointer}
        .how-tab:hover{background:rgba(200,169,110,0.1);color:#c8a96e;border-color:#c8a96e}
        .how-tab-active{background:rgba(200,169,110,0.15);color:#c8a96e;border-color:#c8a96e}
        .how-tab-inactive{background:transparent;color:rgba(255,255,255,0.5);border-color:rgba(255,255,255,0.15)}
        .g-img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:2px;transition:.4s}
        .g-img:hover{transform:scale(1.02);box-shadow:0 8px 24px rgba(0,0,0,.5)}
        .bsoc-btn{background:#c8a96e;color:#0d0d0d;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:12px;text-decoration:none;transition:.2s;font-weight:700}
        .bsoc-btn:hover{background:#e6c98a}
        
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
          .story-wrap{grid-template-columns:1fr!important}
          .menu-wrap{grid-template-columns:1fr!important}
          .how-desktop{display:none!important}
          .how-mobile{display:flex!important}
          .barber-grid{grid-template-columns:repeat(auto-fit,minmax(220px,300px))!important}
          .testi-grid{grid-template-columns:1fr!important}
          .foot-grid{grid-template-columns:1fr!important}
        }
        @media(max-width:900px){.classic-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:500px){.classic-grid{grid-template-columns:1fr!important}}
      `}</style>

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-[999] flex items-center justify-between transition-all duration-300"
        style={{
          height: "68px",
          padding: "0 5%",
          background: scrolled ? C.dark : "transparent",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,.4)" : "none",
        }}
      >
        <img
          src="/logopointcut.png"
          alt="Point Cut"
          style={{ height: "44px", cursor: "pointer" }}
          onClick={() => go("home")}
        />
        <ul
          className="nav-links flex gap-7 list-none"
          style={{ display: "flex" }}
        >
          {NAV.map((n) => (
            <li key={n.id}>
              <button
                className={`nav-link ${active === n.id ? "nav-link-active" : "nav-link-inactive"}`}
                onClick={() => go(n.id)}
              >
                {n.l}
              </button>
            </li>
          ))}
          
          <li className="relative" ref={dropdownRef} style={{position: 'relative'}}>
            <button
               className="nav-link nav-link-inactive flex items-center gap-1"
               style={{ display: "flex", alignItems: "center", gap: "4px" }}
               onClick={() => setDropdownOpen(!dropdownOpen)}
            >
               Gallery
               <svg style={{width:'10px', height:'10px', marginLeft:'2px', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
               <button className="dropdown-item" onClick={() => navigate('/gallery#video-section')}>Videos</button>
               <button className="dropdown-item" onClick={() => navigate('/gallery#photo-section')}>Photos</button>
            </div>
          </li>
        </ul>
        <div className="nav-cta" style={{ display: "flex", gap: "12px" }}>
          {isLogged && (
             <button className="btn-gold" onClick={() => navigate('/user/profile')} style={{background: 'transparent', color: '#c8a96e', border: '1px solid #c8a96e'}}>
               PROFILE
             </button>
          )}
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

      {/* Mobile Overlay */}
      <div
        className="fixed inset-0 z-[1000] transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,.55)",
          opacity: menu ? 1 : 0,
          pointerEvents: menu ? "all" : "none",
        }}
        onClick={() => setMenu(false)}
      />
      {/* Mobile Menu */}
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
              className={`mnl ${active === n.id ? "mnl-active" : ""}`}
              onClick={() => go(n.id)}
            >
              {n.l}
            </button>
          ))}
          
          <div className="mnl" style={{borderBottom: 'none', cursor: 'default'}}>Gallery</div>
          <div className="m-dropdown-wrap">
             <button className="nav-link nav-link-inactive" style={{textAlign: 'left'}} onClick={() => navigate('/gallery#photo-section')}>Photo Gallery</button>
             <button className="nav-link nav-link-inactive" style={{textAlign: 'left'}} onClick={() => navigate('/gallery#video-section')}>Video Shorts</button>
          </div>

          <div style={{ marginTop: "20px" }}>
            {isLogged && (
               <button
                 className="btn-gold w-full"
                 style={{ width: "100%", marginBottom: "12px", background: 'transparent', color: '#c8a96e', border: '1px solid #c8a96e' }}
                 onClick={() => navigate('/user/profile')}
               >
                 PROFILE & HISTORY
               </button>
            )}
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

      {/* Hero */}
      <section
        id="home"
        className="relative flex items-end"
        style={{
          height: "100vh",
          minHeight: "600px",
          padding: "0 6% 80px",
          background:
            "linear-gradient(to right,rgba(0,0,0,.72) 0%,rgba(0,0,0,.45) 60%,rgba(0,0,0,.3) 100%),url('/hero_bg.png') center/cover no-repeat",
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <p
            style={{
              color: C.gold,
              fontSize: "11px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            ✦ POINTCUT HAIR STUDIO ✦
          </p>
          <h1
            className="font-serif"
            style={{
              fontSize: "clamp(48px,7vw,86px)",
              color: "#fff",
              lineHeight: 1.05,
              marginBottom: "14px",
            }}
          >
            We Know
            <br />
            Your Style
            <br />
            Better
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,.7)",
              fontSize: "15px",
              marginBottom: "28px",
            }}
          >
            Pengalaman grooming premium dengan kapster profesional berpengalaman
          </p>
        </div>
      </section>

      {/* Story 3-col */}
      <div id="about">
        <div
          className="story-wrap"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr 1fr",
            minHeight: "340px",
          }}
        >
          {/* Left */}
          <div
            className="flex flex-col justify-center"
            style={{ background: C.dark2, padding: "48px 40px" }}
          >
            <p
              className="font-serif"
              style={{ fontSize: "52px", color: C.gold, lineHeight: 1 }}
            >
              20%
            </p>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.6)",
                marginBottom: "12px",
              }}
            >
              Dapatkan Potongan Harga 20% Untuk Reservasi Pertama Anda
            </p>
            <p
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#fff",
                margin: "8px 0 24px",
              }}
            >
            Dari Rp 65.000, kamu hanya bayar Rp 50.000 aja!
            </p>
            <button className="btn-gold" onClick={startBooking}>
              RESERVASI SEKARANG
            </button>
          </div>
          {/* Mid */}
          <div
            className="flex flex-col justify-center text-center"
            style={{ background: C.beige, padding: "48px 40px" }}
          >
            <p
              className="font-dm"
              style={{
                fontSize: "11px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: "10px",
              }}
            >
              Our Story
            </p>
            <div
              style={{
                textAlign: "center",
                fontSize: "20px",
                margin: "8px 0 20px",
                opacity: 0.5,
              }}
            >
              ✂
            </div>
            <h2
              className="font-serif"
              style={{ fontSize: "32px", marginBottom: "6px" }}
            >
              Pointcut Hair Studio
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: C.muted,
                lineHeight: 1.8,
                marginTop: "12px",
              }}
            >
              Pointcut Hair Studio lahir dari passion mendalam terhadap seni
              grooming pria. Kami percaya setiap potongan adalah cerminan
              karakter dan kepercayaan diri. Dengan kapster berpengalaman dan
              suasana yang nyaman, kami hadir memberikan pengalaman terbaik.
            </p>
          </div>
          {/* Right */}
          <div
            style={{ background: C.beige, padding: "48px 40px", color: "#fff" }}
          >
            <h3
              className="font-oswald"
              style={{
                fontSize: "16px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#fff",
                marginBottom: "20px",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(255,255,255,.15)",
              }}
            >
              JAM BUKA
            </h3>
            {HOURS.map(([day, h]) => (
              <div
                key={day}
                className="flex justify-between"
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,.15)",
                  fontSize: "13px",
                  color: h === "TUTUP" ? C.gold : "rgba(255,255,255,.7)",
                }}
              >
                <span>{day}</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Classic Services */}
      <section
        id="services"
        style={{ background: C.dark, padding: "70px 5% 60px" }}
      >
        <h2
          className="font-serif"
          style={{
            fontStyle: "italic",
            fontSize: "clamp(32px,4vw,52px)",
            color: "#fff",
            marginBottom: "40px",
          }}
        >
          Our Full Service Menu
        </h2>
        <div
          className="classic-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "2px",
          }}
        >
          {CLASSIC.map((c) => (
            <div key={c.name} style={{ background: "#111" }}>
              <img
                src={c.img}
                alt={c.name}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  objectPosition: "top",
                }}
              />
              <div style={{ padding: "20px" }}>
                <h3
                  className="font-oswald"
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "#fff",
                    marginBottom: "12px",
                  }}
                >
                  {c.name}
                </h3>
                <ul style={{ listStyle: "none", marginBottom: "16px" }}>
                  {c.items.map((i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,.55)",
                        padding: "3px 0",
                      }}
                    >
                      <span style={{ color: C.gold }}>• </span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Menu Accordion */}
      <div
        id="prices"
        className="menu-wrap"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
      >
        <div
          style={{
            background: "url('/gallery_haircut.png') center/cover no-repeat",
            minHeight: "480px",
          }}
        />
        <div style={{ background: C.cream, padding: "60px 48px" }}>
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(24px,3vw,38px)", marginBottom: "32px" }}
          >
            Our Full Service Price
          </h2>
          {MENU_ACC.map((m, i) => (
            <div
              key={m.title}
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <button
                className="acc-btn"
                onClick={() => setAcc(acc === i ? null : i)}
                style={{ color: acc === i ? C.gold : C.text }}
              >
                {m.title}
                <span
                  style={{
                    color: acc === i ? C.gold : C.muted,
                    fontSize: "18px",
                  }}
                >
                  {acc === i ? "−" : "+"}
                </span>
              </button>
              <div
                style={{
                  overflow: "hidden",
                  maxHeight: acc === i ? "400px" : "0",
                  opacity: acc === i ? 1 : 0,
                  paddingBottom: acc === i ? "16px" : "0",
                  transition:
                    "max-height .45s cubic-bezier(.4,0,.2,1),opacity .3s ease,padding .35s ease",
                }}
              >
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {m.items.map((item) => (
                    <li
                      key={item.n}
                      className="flex justify-between items-center"
                      style={{
                        padding: "9px 0",
                        borderBottom: `1px solid ${C.border}`,
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ color: C.text }}>{item.n}</span>
                      <span
                        className="font-oswald"
                        style={{
                          fontWeight: 600,
                          color: C.gold,
                          fontSize: "13px",
                        }}
                      >
                        {item.p}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barbers */}
      <section id="team" style={{ background: C.beige, padding: "70px 5%" }}>
        <p
          className="font-dm"
          style={{
            fontSize: "11px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          Our Team
        </p>
        <div
          style={{
            textAlign: "center",
            fontSize: "20px",
            margin: "8px 0 20px",
            opacity: 0.5,
          }}
        >
          ✂
        </div>
        <h2
          className="font-serif text-center"
          style={{ fontSize: "clamp(28px,4vw,42px)" }}
        >
          OUR KAPSTER
        </h2>
        <p
          className="text-center"
          style={{ color: C.muted, fontSize: "13px", marginTop: "8px" }}
        >
          Kapster profesional kami siap memberikan tampilan terbaik Anda
        </p>
        <div
          className="barber-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,300px))",
            justifyContent: "center",
            gap: "20px",
            marginTop: "36px",
          }}
        >
          {capsters.map((c) => (
            <div key={c.id} className="relative overflow-hidden">
              <img
                src={c.avatar || "/default-avatar.png"}
                alt={c.name}
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                  objectPosition: "top",
                }}
              />
              <div className="absolute top-3 left-0 flex flex-col">
                <a
                  className="bsoc-btn"
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
                <a
                  className="bsoc-btn"
                  href="https://instagram.com/pointcut.studio"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
              <div
                style={{
                  background: "rgba(26,26,24,.9)",
                  padding: "18px 16px",
                  textAlign: "center",
                }}
              >
                <p
                  className="font-oswald"
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "#fff",
                    letterSpacing: "1px",
                  }}
                >
                  {c.name}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: C.gold,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    marginTop: "4px",
                  }}
                >
                  — Senior Capster —
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="tutorial"
        className="relative"
        style={{ background: C.cream, padding: "70px 5%" }}
      >
        <p
          className="font-dm"
          style={{
            fontSize: "11px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          How to Booking
        </p>
        <div
          style={{
            textAlign: "center",
            fontSize: "20px",
            margin: "8px 0 20px",
            opacity: 0.5,
          }}
        >
          ✂
        </div>
        <h2
          className="font-serif text-center"
          style={{ fontSize: "clamp(26px,4vw,40px)", marginBottom: "8px" }}
        >
          Proses Mudah &amp; Transparan
        </h2>
        <p
          className="text-center"
          style={{ color: C.muted, fontSize: "14px", marginBottom: "36px" }}
        >
          Pilih cara reservasi yang paling nyaman untuk Anda
        </p>

        {/* Tabs */}
        <div className="flex justify-center mb-12" style={{ gap: "16px" }}>
          <button
            className={`how-tab ${howTab === "online" ? "how-tab-active" : "how-tab-inactive"}`}
            style={{ borderRadius: "4px" }}
            onClick={() => setHowTab("online")}
          >
            Online
          </button>
          <button
            className={`how-tab ${howTab === "offline" ? "how-tab-active" : "how-tab-inactive"}`}
            style={{ borderRadius: "4px" }}
            onClick={() => setHowTab("offline")}
          >
            Offline
          </button>
        </div>

        {howTab === "online" &&
          (() => {
            const steps = [
              {
                n: 1,
                label: "Pilih Layanan",
                sub: "Senior / Premium + tambahan",
              },
              { n: 2, label: "Lihat Antrian", sub: "Seat tersedia kapster" },
              { n: 3, label: "Pilih Nomor", sub: "Klik slot yang kosong" },
              { n: 4, label: "Bayar QRIS", sub: "Rp 50.000 reservasi" },
              {
                n: 5,
                label: "Nomor Antrian",
                sub: "Datang sesuai giliran",
                last: true,
              },
            ];
            const stepsMobile = [
              {
                n: 1,
                label: "Pilih Layanan",
                sub: "Pilih Senior Capster, tambah layanan optional",
              },
              {
                n: 2,
                label: "Lihat Antrian Kapster",
                sub: "Lihat slot antrian real-time tiap kapster",
              },
              {
                n: 3,
                label: "Pilih Nomor Antrian",
                sub: "Klik slot kosong yang tersedia",
              },
              {
                n: 4,
                label: "Pembayaran QRIS",
                sub: "Bayar Rp 50.000 sebagai biaya reservasi via QRIS",
              },
              {
                n: 5,
                label: "Nomor Antrian Diterima",
                sub: "Datang ke studio sesuai nomor antrian Anda",
                last: true,
              },
            ];
            return (
              <>
                {/* Desktop */}
                <div
                  className="how-desktop flex items-start justify-center relative"
                  style={{ padding: "20px 0" }}
                >
                  {steps.map((s) => (
                    <div
                      key={s.n}
                      className="flex flex-col items-center relative z-10"
                      style={{
                        flex: 1,
                        gap: "10px",
                        padding: "0 8px",
                        maxWidth: "160px",
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <div
                          className="flex items-center justify-center font-oswald font-bold text-white rounded-full flex-shrink-0"
                          style={{
                            width: "52px",
                            height: "52px",
                            background: C.gold,
                            fontSize: "18px",
                            boxShadow: "0 4px 12px rgba(0,0,0,.18)",
                          }}
                        >
                          {s.n}
                        </div>
                        {!(s as any).last && (
                          <div
                            style={{
                              position: "absolute",
                              top: "26px",
                              left: "52px",
                              width: "100%",
                              height: "1px",
                              background: "rgba(200,169,110,0.3)",
                              zIndex: -1,
                            }}
                          />
                        )}
                      </div>
                      <p
                        className="font-oswald text-center"
                        style={{
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "1.5px",
                          color: C.text,
                          lineHeight: 1.4,
                          marginTop: "12px",
                        }}
                      >
                        {s.label}
                      </p>
                      <p
                        className="text-center"
                        style={{
                          fontSize: "10px",
                          color: C.muted,
                          lineHeight: 1.5,
                          marginTop: "2px",
                        }}
                      >
                        {s.sub}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Mobile */}
                <div
                  className="how-mobile flex-col"
                  style={{ display: "none", gap: "0", padding: "0 8px" }}
                >
                  {stepsMobile.map((s, idx) => (
                    <div
                      key={s.n}
                      className="flex relative"
                      style={{
                        gap: "16px",
                        alignItems: "flex-start",
                        paddingBottom:
                          idx < stepsMobile.length - 1 ? "32px" : "0",
                      }}
                    >
                      {idx < stepsMobile.length - 1 && (
                        <div
                          style={{
                            position: "absolute",
                            left: "22px",
                            top: "44px",
                            bottom: 0,
                            width: "2px",
                            background: C.border,
                            zIndex: 0,
                          }}
                        />
                      )}
                      <div
                        className="flex items-center justify-center font-oswald font-bold text-white rounded-full flex-shrink-0 relative z-10"
                        style={{
                          width: "44px",
                          height: "44px",
                          background: C.gold,
                          fontSize: "16px",
                        }}
                      >
                        {s.n}
                      </div>
                      <div style={{ paddingTop: "8px" }}>
                        <p
                          className="font-oswald"
                          style={{
                            fontSize: "13px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            color: C.text,
                            fontWeight: 600,
                          }}
                        >
                          {s.label}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: C.muted,
                            lineHeight: 1.6,
                            marginTop: "3px",
                          }}
                        >
                          {s.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    background: "rgba(200,169,110,.1)",
                    borderLeft: `3px solid ${C.gold}`,
                    padding: "8px 14px",
                    marginTop: "20px",
                    maxWidth: "600px",
                    margin: "20px auto 0",
                    fontSize: "11px",
                    color: C.text,
                    borderRadius: "0 4px 4px 0",
                  }}
                >
                  💡 <strong>Batas antrian:</strong> Maks. 15
                  customer/kapster/hari.
                </div>
              </>
            );
          })()}

        {howTab === "offline" &&
          (() => {
            const steps = [
              { n: 1, label: "Datang ke Studio", sub: "Walk-in langsung" },
              { n: 2, label: "Pesan ke Kapster", sub: "Pilih kapster favorit" },
              {
                n: 3,
                label: "Input Pemesanan",
                sub: "Kapster input layanan & harga",
              },
              { n: 4, label: "Nomor Antrian", sub: "Dapat nomor urut offline" },
              { n: 5, label: "Cukur", sub: "Antri & nikmati layanan" },
              { n: 6, label: "Payment", sub: "Bayar di kasir", last: true },
            ];
            const stepsMobile = [
              {
                n: 1,
                label: "Datang ke Studio",
                sub: "Walk-in langsung tanpa perlu booking online",
              },
              {
                n: 2,
                label: "Pesan ke Kapster",
                sub: "Pilih kapster dan sampaikan layanan yang diinginkan",
              },
              {
                n: 3,
                label: "Kapster Input Pemesanan",
                sub: "Kapster akan menginput layanan & harga untuk Anda",
              },
              {
                n: 4,
                label: "Nomor Antrian",
                sub: "Sistem akan otomatis assign nomor antrian offline (A1, A2, dst)",
              },
              {
                n: 5,
                label: "Cukur",
                sub: "Tunggu giliran dan nikmati layanan premium",
              },
              {
                n: 6,
                label: "Payment",
                sub: "Bayar di kasir setelah selesai",
                last: true,
              },
            ];
            return (
              <>
                <div
                  className="how-desktop flex items-start justify-center relative"
                  style={{ padding: "20px 0" }}
                >
                  {steps.map((s) => (
                    <div
                      key={s.n}
                      className="flex flex-col items-center relative z-10"
                      style={{
                        flex: 1,
                        gap: "10px",
                        padding: "0 8px",
                        maxWidth: "160px",
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <div
                          className="flex items-center justify-center font-oswald font-bold text-white rounded-full flex-shrink-0"
                          style={{
                            width: "52px",
                            height: "52px",
                            background: C.gold,
                            fontSize: "18px",
                            boxShadow: "0 4px 12px rgba(0,0,0,.18)",
                          }}
                        >
                          {s.n}
                        </div>
                        {!(s as any).last && (
                          <div
                            style={{
                              position: "absolute",
                              top: "26px",
                              left: "52px",
                              width: "100%",
                              height: "1px",
                              background: "rgba(200,169,110,0.3)",
                              zIndex: -1,
                            }}
                          />
                        )}
                      </div>
                      <p
                        className="font-oswald text-center"
                        style={{
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "1.5px",
                          color: C.text,
                          lineHeight: 1.4,
                          marginTop: "12px",
                        }}
                      >
                        {s.label}
                      </p>
                      <p
                        className="text-center"
                        style={{
                          fontSize: "10px",
                          color: C.muted,
                          lineHeight: 1.5,
                          marginTop: "2px",
                        }}
                      >
                        {s.sub}
                      </p>
                    </div>
                  ))}
                </div>
                <div
                  className="how-mobile flex-col"
                  style={{ display: "none", gap: "0", padding: "0 8px" }}
                >
                  {stepsMobile.map((s, idx) => (
                    <div
                      key={s.n}
                      className="flex relative"
                      style={{
                        gap: "16px",
                        alignItems: "flex-start",
                        paddingBottom:
                          idx < stepsMobile.length - 1 ? "32px" : "0",
                      }}
                    >
                      {idx < stepsMobile.length - 1 && (
                        <div
                          style={{
                            position: "absolute",
                            left: "22px",
                            top: "44px",
                            bottom: 0,
                            width: "2px",
                            background: C.border,
                            zIndex: 0,
                          }}
                        />
                      )}
                      <div
                        className="flex items-center justify-center font-oswald font-bold text-white rounded-full flex-shrink-0 relative z-10"
                        style={{
                          width: "44px",
                          height: "44px",
                          background: C.gold,
                          fontSize: "16px",
                        }}
                      >
                        {s.n}
                      </div>
                      <div style={{ paddingTop: "8px" }}>
                        <p
                          className="font-oswald"
                          style={{
                            fontSize: "13px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            color: C.text,
                            fontWeight: 600,
                          }}
                        >
                          {s.label}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: C.muted,
                            lineHeight: 1.6,
                            marginTop: "3px",
                          }}
                        >
                          {s.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    background: "rgba(200,169,110,.1)",
                    borderLeft: `3px solid ${C.gold}`,
                    padding: "8px 14px",
                    marginTop: "20px",
                    maxWidth: "600px",
                    margin: "20px auto 0",
                    fontSize: "11px",
                    color: C.text,
                    borderRadius: "0 4px 4px 0",
                  }}
                >
                  💡 <strong>Offline:</strong> Nomor antrian offline akan
                  otomatis terintegrasi dengan sistem.
                </div>
              </>
            );
          })()}
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ background: C.dark, padding: "70px 5%" }}>
        <p
          className="font-dm"
          style={{
            fontSize: "11px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          Testimoni
        </p>
        <h2
          className="font-serif text-center"
          style={{
            fontSize: "clamp(26px,4vw,38px)",
            color: "#fff",
            marginBottom: "0",
          }}
        >
          APA KATA MEREKA
        </h2>
        <div
          className="testi-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "20px",
            marginTop: "36px",
          }}
        >
          {TESTI.map((t, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,.03)",
                border: `1px solid ${C.border}`,
                padding: "28px",
                borderRadius: "2px",
                transition: ".2s",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  lineHeight: ".6",
                  color: C.gold,
                  fontFamily: "Georgia,serif",
                  marginBottom: "12px",
                }}
              >
                "
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: C.muted,
                  fontStyle: "italic",
                  lineHeight: 1.8,
                  marginBottom: "14px",
                }}
              >
                {t.t}
              </p>
              <p
                className="font-oswald"
                style={{
                  fontSize: "13px",
                  textTransform: "uppercase",
                  color: C.text,
                  letterSpacing: "1px",
                }}
              >
                {t.n}
              </p>
              <div
                style={{ color: C.gold, fontSize: "12px", marginTop: "4px" }}
              >
                {"★".repeat(t.r)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" style={{ background: "#080808", padding: "56px 5% 0" }}>
        <div
          className="foot-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "36px",
            paddingBottom: "36px",
          }}
        >
          <div>
            <img
              src="/logopointcut.png"
              alt="Point Cut"
              style={{ height: "48px", marginBottom: "12px" }}
            />
            <p
              className="font-serif"
              style={{
                fontStyle: "italic",
                color: "rgba(255,255,255,.5)",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Stay Sharp, Look Fresh
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,.45)",
                lineHeight: 2,
              }}
            >
              Studio grooming premium di kota Anda.
              <br />
              Kami hadir untuk tampilan terbaik Anda setiap hari.
            </p>
          </div>
          <div>
            <p
              className="font-oswald"
              style={{
                fontSize: "11px",
                color: C.gold,
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              Lokasi Kami
            </p>
            <div
              style={{
                width: "100%",
                height: "140px",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: "12px",
              }}
            >
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://maps.google.com/maps?q=Jl.%20Gajah%20Mada%20No.113,%20Bogoran,%20Kauman,%20Kec.%20Batang,%20Kabupaten%20Batang,%20Jawa%20Tengah%2051216&t=&z=15&ie=UTF8&iwloc=&output=embed"
                title="Google Maps"
              />
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,.45)",
                lineHeight: 2,
              }}
            >
              Jl. Gajah Mada No.113, RW.03, Bogoran, Kauman, Kec. Batang,
              Kabupaten Batang, Jawa Tengah 51216
            </p>
          </div>
          <div>
            <p
              className="font-oswald"
              style={{
                fontSize: "11px",
                color: C.gold,
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              Hubungi Kami
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,.45)",
                lineHeight: 2,
              }}
            >
              📞 +62 812-3456-7890
              <br />
              📧 hello@studiopointcut.com
              <br />
              📸 @pointcut.studio
            </p>
          </div>
        </div>
        <div style={{ height: "1px", background: "rgba(255,255,255,.08)" }} />
        <div
          className="flex justify-between flex-wrap"
          style={{
            padding: "18px 0",
            fontSize: "11px",
            color: "rgba(255,255,255,.25)",
            gap: "6px",
          }}
        >
          <span>© 2026 Studio Pointcut. All rights reserved.</span>
        </div>
      </footer>

      {/* WA Float */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noreferrer"
        className="fixed flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
        style={{
          bottom: "28px",
          right: "28px",
          zIndex: 998,
          width: "52px",
          height: "52px",
          background: "#25D366",
          boxShadow: "0 4px 16px rgba(0,0,0,.3)",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}
