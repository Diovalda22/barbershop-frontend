import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Storage } from "@/services/storage";
import { useAuth } from "@/hooks/useAuth";

const C = {
  dark: "#1a1a18",
  dark2: "#2a2520",
  cream: "#f4ede3",
  beige: "#f8f3eb",
  gold: "#c8a96e",
  white: "#fff",
  muted: "#888",
  text: "#1a1a18",
  border: "#e0d8ce",
  fS: "'Playfair Display',serif",
  fB: "'DM Sans',sans-serif",
  fO: "'Oswald',sans-serif",
};

const MAX_QUEUE = 15;
const RESERVASI_FEE = 50000;

const getDays = () => {
  const d = [];
  for (let i = 0; i < 7; i++) {
    const t = new Date();
    t.setDate(t.getDate() + i);
    d.push({
      val: t.toISOString().split("T")[0],
      d: t.toLocaleDateString("id-ID", { weekday: "short" }),
      n: t.getDate(),
      m: t.toLocaleDateString("id-ID", { month: "short" }),
    });
  }
  return d;
};
const DAYS = getDays();

const QR_SIZE = 28;
const QR_SEED = Array.from(
  { length: QR_SIZE * QR_SIZE },
  (_, i) =>
    (i * 13 + Math.floor(i / QR_SIZE) * 7 + Math.floor(i / 3) * 11) % 2 === 0,
);

export function ReservationPage() {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  const shopName = Storage.get("settings", {
    shopName: "Pointcut Barbershop",
  }).shopName;
  const [capsters, setCapsters] = useState<any[]>([]);
  const [addonsData, setAddonsData] = useState<any[]>([]);
  const [lockedSlots, setLockedSlots] = useState<any[]>([]);
  const [menu, setMenu] = useState(false);
  const [step, setStep] = useState(1);
  const [haircut, setHaircut] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addons, setAddons] = useState<string[]>([]);
  const [capster, setCapster] = useState<any>(null);
  const [queue, setQueue] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [bookingDate, setBookingDate] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string>("Pelanggan");

  useEffect(() => {
    const id = "pc-f";
    if (!document.getElementById(id)) {
      const l = document.createElement("link");
      l.id = id;
      l.rel = "stylesheet";
      l.href =
        "https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500&display=swap";
      document.head.appendChild(l);
    }
    const token = localStorage.getItem("customer_token");
    if (!token) {
      navigate("/user/login?redirect=/booking");
      return;
    }
    setCustomerName(localStorage.getItem("customer_name") || "Pelanggan");
    document.title = `Booking - ${shopName}`;
  }, [navigate, shopName]);

  useEffect(() => {
    try {
      const cRes = Storage.get<any[]>("capsters", []);
      const sRes = Storage.get<any[]>("services", []);
      const seniors = cRes.filter(
        (c: any) =>
          c.is_senior ||
          c.specialization?.toLowerCase().includes("senior") ||
          c.role?.toLowerCase().includes("senior"),
      );
      setCapsters(seniors.length > 0 ? seniors : cRes);
      setAddonsData(sRes);
    } catch {}
  }, []);

  useEffect(() => {
    if (bookingDate && capster) {
      try {
        const locks = Storage.get<any[]>("lockedSlots", []);
        setLockedSlots(
          locks.filter(
            (l: any) =>
              l.lock_date === bookingDate &&
              l.capster_id === capster.id.toString(),
          ),
        );
      } catch {}
    }
  }, [bookingDate, capster]);

  const goHome = () => navigate("/");
  const addonPrice = addons.reduce(
    (a, n) => a + (addonsData.find((x) => x.name === n)?.price || 0),
    0,
  );
  const total = RESERVASI_FEE + addonPrice;
  const toggleAddon = (n: string) =>
    setAddons((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  const logout = async () => {
    try {
      await authLogout();
    } catch (e) {
      console.log(e);
    }
    navigate("/");
  };

  const doPaymentSuccess = () => {
    if (!capster || selectedSeat === null || !bookingDate) return;
    const qNum = `${capster.queue_prefix || ""}${selectedSeat}`;
    try {
      const allRes = Storage.get<any[]>("reservations", []);
      const serviceDetail = addonsData.find((x) =>
        x.name.toLowerCase().includes("haircut"),
      ) ||
        addonsData[0] || { name: "Haircut", id: 1 };
      Storage.set("reservations", [
        ...allRes,
        {
          id: Date.now(),
          customer_name: customerName,
          type: "online",
          capster,
          service: serviceDetail,
          booking_date: bookingDate,
          start_time: "12:00",
          queue_number: qNum,
          payment: {
            id: Date.now() + 1,
            method: "qris_midtrans",
            amount: total,
            status: "paid",
          },
          queue: { id: Date.now() + 2, status: "waiting" },
          notes: `Addons: ${addons.join(", ")}`,
        },
      ]);
      setQueue(qNum);
      setStep(5);
    } catch {
      alert("Terjadi kesalahan saat membuat pesanan.");
    }
  };

  const downloadPDF = async () => {
    const el = document.getElementById("printable-ticket");
    if (!el) return;
    const orig = el.style.boxShadow;
    try {
      el.style.boxShadow = "none";
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const img = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 3 + 40, canvas.height / 3 + 40],
      });
      pdf.addImage(img, "PNG", 20, 20, canvas.width / 3, canvas.height / 3);
      pdf.save(`Resi-Pointcut-${queue}.pdf`);
    } catch {
    } finally {
      el.style.boxShadow = orig;
    }
  };

  const STEPS = ["Layanan", "Kapster", "Jadwal", "Payment", "Struk"];

  const QrisVisual = () => (
    <div
      style={{
        border: "3px solid #ed1b24",
        borderRadius: "12px",
        width: "260px",
        margin: "32px auto",
        background: "#fff",
        overflow: "hidden",
        boxShadow: "0 12px 30px rgba(237,27,36,.15)",
      }}
    >
      <div
        className="font-oswald flex items-center justify-center gap-2"
        style={{
          background: "#ed1b24",
          color: "#fff",
          fontSize: "24px",
          fontWeight: 700,
          padding: "14px 0",
          letterSpacing: "3px",
        }}
      >
        <span>QRIS</span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 10V4h6" />
          <path d="M20 10V4h-6" />
          <path d="M4 14v6h6" />
          <path d="M20 14v6h-6" />
        </svg>
      </div>
      <div style={{ padding: "24px", background: "#fff" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${QR_SIZE},1fr)`,
              width: "100%",
              height: "100%",
            }}
          >
            {QR_SEED.map((f, i) => (
              <div key={i} style={{ background: f ? "#000" : "#fff" }} />
            ))}
          </div>
          {[
            { top: "-2px", left: "-2px" },
            { top: "-2px", right: "-2px" },
            { bottom: "-2px", left: "-2px" },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                ...pos,
                width: "44px",
                height: "44px",
                background: "#fff",
                padding: "4px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  border: "5px solid #000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{ width: "14px", height: "14px", background: "#000" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="font-dm"
        style={{
          background: "#eee",
          textAlign: "center",
          padding: "12px",
          fontSize: "12px",
          color: "#555",
          fontWeight: 700,
        }}
      >
        GPN / PT POINT CUT STUDIO
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
        body{font-family:'DM Sans',sans-serif;background:#f4ede3;color:#1a1a18;overflow-x:hidden}
        img{max-width:100%;display:block}button{cursor:pointer;font-family:inherit}
        .font-serif{font-family:'Playfair Display',serif}
        .font-oswald{font-family:'Oswald',sans-serif}
        .font-dm{font-family:'DM Sans',sans-serif}
        .btn-gold{background:#c8a96e;color:#fff;font-family:'Oswald',sans-serif;font-size:14px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:14px 32px;border:none;border-radius:4px;transition:.2s;cursor:pointer}
        .btn-gold:hover:not(:disabled){background:#b09558}
        .btn-gold:disabled{opacity:0.5;cursor:not-allowed}
        .btn-outline{background:transparent;font-family:'Oswald',sans-serif;font-size:14px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:12px 30px;border:2px solid #c8a96e;color:#c8a96e;border-radius:4px;transition:.25s;cursor:pointer}
        .btn-outline:hover{background:#c8a96e;color:#fff}
        .btn-outline-light{border-color:#fff;color:#fff}
        .btn-outline-light:hover{background:rgba(255,255,255,.1);color:#fff;border-color:#fff}
        .l-radio{border:2px solid #e0d8ce;padding:20px;border-radius:8px;cursor:pointer;transition:.2s;background:#fff;display:flex;justify-content:space-between;align-items:center}
        .l-radio:hover,.l-radio-sel{border-color:#c8a96e}
        .l-radio-sel{background:rgba(200,169,110,.04)}
        .c-radio{border:2px solid #e0d8ce;padding:16px;border-radius:10px;cursor:pointer;transition:.2s;background:#fff;display:flex;align-items:center;gap:16px}
        .c-radio:hover,.c-radio-sel{border-color:#c8a96e}
        .c-radio-sel{background:rgba(200,169,110,.04)}
        .seat-avl{background:#fff;border-color:#e0d8ce;color:#1a1a18;cursor:pointer}
        .seat-avl:hover{border-color:#c8a96e;color:#c8a96e}
        .seat-off{background:#3a3530;border-color:#3a3530;color:rgba(255,255,255,.4);cursor:not-allowed}
        .seat-sel{background:#c8a96e;border-color:#c8a96e;color:#fff;cursor:pointer}
        .date-btn{flex-shrink:0;width:80px;border:2px solid #e0d8ce;background:#fff;color:#888;padding:14px 0;border-radius:10px;display:flex;flex-direction:column;align-items:center;transition:.2s;scroll-snap-align:start;cursor:pointer}
        .date-btn:hover,.date-btn-act{border-color:#c8a96e}
        .date-btn-act{background:#c8a96e;color:#fff}
        .add-head{width:100%;background:rgba(200,169,110,.05);padding:16px 20px;display:flex;justify-content:space-between;align-items:center;border:none;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:#1a1a18;cursor:pointer}
        .add-head:hover{background:rgba(200,169,110,.1)}
        @media(max-width:768px){
          .nav-links-res{display:none!important}
          .nav-cta-res{display:none!important}
          .m-btn-res{display:block!important}
        }
        @media(max-width:900px){.board{flex-direction:column!important;margin-top:-20px!important;align-items:stretch!important}}
        @media(max-width:600px){
          .book-body{padding:24px!important}
          .s-head{font-size:20px!important}
          .date-btn{width:70px!important;padding:12px 0!important}
          .seat-grid{grid-template-columns:repeat(4,1fr)!important}
          .ticket-box{padding:24px!important;border-radius:12px!important;box-shadow:0 8px 24px rgba(0,0,0,.04)!important}
        }
        @media(max-width:400px){.seat-grid{grid-template-columns:repeat(3,1fr)!important}}
        @media print{
          body *{visibility:hidden!important}
          #printable-ticket,#printable-ticket *{visibility:visible!important}
          #printable-ticket{position:absolute;left:0;top:0;width:100%;border:none!important;padding:20px!important;margin:0}
          @page{margin:0;size:auto}
        }
      `}</style>

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-[999] flex items-center justify-between"
        style={{
          height: "72px",
          padding: "0 5%",
          background: C.dark,
          boxShadow: "0 4px 24px rgba(0,0,0,.3)",
        }}
      >
        <img
          src="/logopointcut.png"
          alt="Point Cut"
          onClick={goHome}
          style={{ height: "44px", cursor: "pointer", transition: ".2s" }}
        />
        <ul
          className="nav-links-res flex gap-8 list-none"
          style={{ display: "flex" }}
        >
          <li>
            <button
              onClick={goHome}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontFamily: C.fB,
                fontSize: "14px",
                fontWeight: 500,
                padding: "4px 0",
                transition: ".2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
            >
              Home
            </button>
          </li>
        </ul>
        <div className="nav-cta-res" style={{ display: "block" }}>
          <button className="btn-outline btn-outline-light" onClick={logout}>
            LOGOUT
          </button>
        </div>
        <button
          className="m-btn-res"
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

      {/* Mobile Overlay & Drawer */}
      <div
        className="fixed inset-0 z-[1000] transition-all duration-300"
        style={{
          background: "rgba(0,0,0,.6)",
          backdropFilter: "blur(3px)",
          opacity: menu ? 1 : 0,
          pointerEvents: menu ? "all" : "none",
        }}
        onClick={() => setMenu(false)}
      />
      <div
        className="fixed top-0 right-0 bottom-0 z-[1001] flex flex-col transition-transform duration-300"
        style={{
          width: "280px",
          background: C.dark,
          transform: menu ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            padding: "24px",
            borderBottom: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <img
            src="/logopointcut.png"
            onClick={goHome}
            style={{ height: "44px", cursor: "pointer" }}
          />
          <button
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "28px",
              opacity: 0.7,
              cursor: "pointer",
            }}
            onClick={() => setMenu(false)}
          >
            ×
          </button>
        </div>
        <div
          className="flex flex-col flex-1"
          style={{ padding: "24px", gap: "8px" }}
        >
          <button
            onClick={goHome}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontFamily: C.fB,
              fontSize: "16px",
              fontWeight: 500,
              padding: "14px 0",
              textAlign: "left",
              borderBottom: "1px solid rgba(255,255,255,.06)",
              transition: ".2s",
              cursor: "pointer",
            }}
          >
            Home
          </button>
          <button
            className="btn-outline btn-outline-light"
            style={{ marginTop: "24px" }}
            onClick={logout}
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div
        style={{ background: "#fff", minHeight: "100vh", paddingTop: "72px" }}
      >
        {/* Banner */}
        <div
          className="text-center relative overflow-hidden"
          style={{ background: C.dark, padding: "60px 5%", color: "#fff" }}
        >
          <div
            style={{
              fontSize: "24px",
              color: C.gold,
              marginBottom: "12px",
              opacity: 0.8,
            }}
          >
            ✂
          </div>
          <h1
            className="font-serif"
            style={{
              fontSize: "clamp(32px,5vw,54px)",
              marginBottom: "12px",
              fontWeight: 700,
            }}
          >
            Halo, {customerName}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,.7)",
              fontSize: "15px",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Selamat datang di <strong>{shopName}</strong>. Rasakan kemudahan
            menjadwalkan grooming session Anda.
          </p>
        </div>

        {/* Board */}
        <div
          className="board flex gap-6 items-start relative z-10"
          style={{
            maxWidth: "1100px",
            margin: "-40px auto 60px",
            padding: "0 5%",
          }}
        >
          {/* Main */}
          <div
            className="flex-1 w-full overflow-hidden"
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 8px 30px rgba(0,0,0,.06)",
              border: `1px solid ${C.border}`,
              maxWidth: "100%",
              minWidth: 0,
            }}
          >
            {/* Stepper */}
            {step < 5 && (
              <div
                className="flex overflow-x-auto"
                style={{
                  background: "#fff",
                  padding: "20px 24px",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                {STEPS.slice(0, 4).map((l, i) => (
                  <div
                    key={l}
                    className="flex items-center gap-2.5 relative"
                    style={{
                      opacity: step === i + 1 || step > i + 1 ? 1 : 0.4,
                      marginRight: i < 3 ? "32px" : "0",
                    }}
                  >
                    <div
                      className="flex items-center justify-center font-oswald font-bold rounded-full flex-shrink-0"
                      style={{
                        width: "28px",
                        height: "28px",
                        background:
                          step > i + 1
                            ? C.gold
                            : step === i + 1
                              ? "#fff"
                              : C.beige,
                        border: `2px solid ${step > i + 1 || step === i + 1 ? C.gold : C.border}`,
                        color:
                          step > i + 1 || step === i + 1 ? "#fff" : C.muted,
                        fontSize: "12px",
                      }}
                    >
                      {step > i + 1 ? "✓" : i + 1}
                    </div>
                    <span
                      className="font-oswald whitespace-nowrap"
                      style={{
                        fontSize: "13px",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        color: C.text,
                      }}
                    >
                      {l}
                    </span>
                    {i < 3 && (
                      <div
                        style={{
                          position: "absolute",
                          right: "-24px",
                          top: "50%",
                          width: "16px",
                          height: "2px",
                          background: C.border,
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Book Body */}
            <div className="book-body" style={{ padding: "32px" }}>
              {/* Step 1 */}
              {step === 1 && (
                <>
                  <h3
                    className="font-serif s-head"
                    style={{
                      fontSize: "24px",
                      color: C.text,
                      marginBottom: "8px",
                    }}
                  >
                    Pilihan Layanan
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: C.muted,
                      marginBottom: "32px",
                      lineHeight: 1.6,
                    }}
                  >
                    Pilih paket layanan potong rambut oleh Senior Capster.
                  </p>

                  <div
                    className={`l-radio ${haircut === "haircut" ? "l-radio-sel" : ""}`}
                    onClick={() => setHaircut("haircut")}
                  >
                    <div>
                      <p
                        className="font-serif"
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          marginBottom: "4px",
                        }}
                      >
                        Haircut
                      </p>
                      <p style={{ fontSize: "13px", color: C.muted }}>
                        Biaya Booking Online: Rp 50.000
                      </p>
                    </div>
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: "24px",
                        height: "24px",
                        border: `2px solid ${haircut === "haircut" ? C.gold : C.border}`,
                        background:
                          haircut === "haircut" ? C.gold : "transparent",
                      }}
                    >
                      {haircut === "haircut" && (
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            background: "#fff",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Addons */}
                  <div
                    style={{
                      marginTop: "24px",
                      border: `1px solid ${C.border}`,
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      className="add-head"
                      onClick={() => setAddOpen((o) => !o)}
                    >
                      <span>✨ Tambah Layanan Ekstra (Colors, Perms, dll)</span>
                      <span>{addOpen ? "▲" : "▼"}</span>
                    </button>
                    <div
                      style={{
                        maxHeight: addOpen ? "800px" : "0",
                        overflow: "hidden",
                        transition: "max-height .6s cubic-bezier(.4,0,.2,1)",
                        background: "#fff",
                      }}
                    >
                      <div
                        style={{
                          padding: "24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "20px",
                        }}
                      >
                        {[
                          {
                            label: "Coloring",
                            filter: (x: any) =>
                              x.name.toLowerCase().includes("coloring") ||
                              x.name.toLowerCase().includes("highlight"),
                          },
                          {
                            label: "Perm & Treatment",
                            filter: (x: any) =>
                              x.name.toLowerCase().includes("perm") ||
                              x.name.toLowerCase().includes("lift"),
                          },
                          {
                            label: "Layanan Lainnya",
                            filter: (x: any) =>
                              !x.name.toLowerCase().includes("coloring") &&
                              !x.name.toLowerCase().includes("highlight") &&
                              !x.name.toLowerCase().includes("perm") &&
                              !x.name.toLowerCase().includes("lift"),
                          },
                        ].map((sec) => (
                          <div key={sec.label}>
                            <p
                              className="font-oswald"
                              style={{
                                fontSize: "12px",
                                fontWeight: 800,
                                color: C.gold,
                                letterSpacing: "1.5px",
                                marginBottom: "12px",
                                textTransform: "uppercase",
                                borderBottom: `1px solid ${C.border}`,
                                paddingBottom: "8px",
                              }}
                            >
                              {sec.label}
                            </p>
                            {addonsData.filter(sec.filter).map((item: any) => (
                              <div
                                key={item.name}
                                onClick={() => toggleAddon(item.name)}
                                className="flex items-center justify-between cursor-pointer"
                                style={{
                                  padding: "12px 0",
                                  borderBottom: `1px solid rgba(224,216,206,.4)`,
                                  transition: ".2s",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: addons.includes(item.name)
                                        ? 700
                                        : 500,
                                      color: addons.includes(item.name)
                                        ? C.gold
                                        : C.text,
                                    }}
                                  >
                                    {item.name}
                                  </span>
                                  <p
                                    style={{
                                      fontSize: "11px",
                                      color: C.muted,
                                      marginTop: 2,
                                    }}
                                  >
                                    Profesional treatment
                                  </p>
                                </div>
                                <span
                                  className="font-oswald"
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    color: addons.includes(item.name)
                                      ? C.gold
                                      : C.muted,
                                  }}
                                >
                                  +Rp {item.price / 1000}k{" "}
                                  {addons.includes(item.name) && "✓"}
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "36px", textAlign: "right" }}>
                    <button
                      className="btn-gold"
                      disabled={!haircut}
                      onClick={() => setStep(2)}
                    >
                      Selanjutnya &nbsp; →
                    </button>
                  </div>
                </>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <>
                  <h3
                    className="font-serif s-head"
                    style={{
                      fontSize: "24px",
                      color: C.text,
                      marginBottom: "8px",
                    }}
                  >
                    Pilih Kapster
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: C.muted,
                      marginBottom: "32px",
                      lineHeight: 1.6,
                    }}
                  >
                    Pilih ahli tata rambut favorit Anda.
                  </p>
                  <div className="flex flex-col gap-4">
                    {capsters.map((c: any) => (
                      <div
                        key={c.id}
                        className={`c-radio ${capster?.id === c.id ? "c-radio-sel" : ""}`}
                        onClick={() => {
                          setCapster(c);
                          setSelectedSeat(null);
                        }}
                      >
                        <img
                          src={c.avatar || "/default-avatar.png"}
                          alt={c.name}
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            borderRadius: "12px",
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <p
                            className="font-serif"
                            style={{ fontSize: "18px", fontWeight: 700 }}
                          >
                            {c.name}
                          </p>
                          <p
                            className="font-oswald"
                            style={{
                              fontSize: "12px",
                              color: C.gold,
                              letterSpacing: "1px",
                              textTransform: "uppercase",
                              marginBottom: "4px",
                            }}
                          >
                            Senior Capster — KODE {c.queue_prefix}
                          </p>
                          <p style={{ fontSize: "13px", color: C.muted }}>
                            {c.bio || "Professional Capster"}
                          </p>
                        </div>
                        <div
                          className="flex items-center justify-center rounded-full"
                          style={{
                            width: "24px",
                            height: "24px",
                            border: `2px solid ${capster?.id === c.id ? C.gold : C.border}`,
                            background:
                              capster?.id === c.id ? C.gold : "transparent",
                            flexShrink: 0,
                          }}
                        >
                          {capster?.id === c.id && (
                            <div
                              style={{
                                width: "10px",
                                height: "10px",
                                background: "#fff",
                                borderRadius: "50%",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className="flex justify-between"
                    style={{ marginTop: "36px" }}
                  >
                    <button className="btn-outline" onClick={() => setStep(1)}>
                      ← &nbsp; Kembali
                    </button>
                    <button
                      className="btn-gold"
                      disabled={!capster}
                      onClick={() => setStep(3)}
                    >
                      Selanjutnya &nbsp; →
                    </button>
                  </div>
                </>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <>
                  <h3
                    className="font-serif s-head"
                    style={{
                      fontSize: "24px",
                      color: C.text,
                      marginBottom: "8px",
                    }}
                  >
                    Pilih Waktu Kedatangan
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: C.muted,
                      marginBottom: "32px",
                      lineHeight: 1.6,
                    }}
                  >
                    Pilih hari, lalu ambil nomor antrian untuk kapster{" "}
                    <strong>{capster?.name}</strong>.
                  </p>

                  {/* Date Row */}
                  <div
                    className="flex overflow-x-auto gap-3"
                    style={{
                      paddingBottom: "8px",
                      marginBottom: "24px",
                      scrollSnapType: "x mandatory",
                    }}
                  >
                    {DAYS.map((d) => (
                      <button
                        key={d.val}
                        className={`date-btn ${bookingDate === d.val ? "date-btn-act" : ""}`}
                        onClick={() => {
                          setBookingDate(d.val);
                          setSelectedSeat(null);
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            marginBottom: "4px",
                          }}
                        >
                          {d.d}
                        </span>
                        <span
                          className="font-oswald"
                          style={{
                            fontSize: "24px",
                            fontWeight: 700,
                            lineHeight: 1,
                          }}
                        >
                          {d.n}
                        </span>
                        <span style={{ fontSize: "10px", marginTop: "4px" }}>
                          {d.m}
                        </span>
                      </button>
                    ))}
                  </div>

                  {bookingDate && (
                    <div style={{ marginTop: "24px" }}>
                      {/* Legend */}
                      <div
                        className="flex flex-wrap gap-4"
                        style={{
                          marginBottom: "20px",
                          padding: "12px",
                          background: C.beige,
                          borderRadius: "8px",
                        }}
                      >
                        {[
                          {
                            label: "Terkunci/Penuh",
                            bg: "#fee2e2",
                            bc: "#ef4444",
                          },
                          { label: "Tersedia", bg: "#fff", bc: C.border },
                          { label: "Pilihan Anda", bg: C.gold, bc: C.gold },
                        ].map((l) => (
                          <div
                            key={l.label}
                            className="flex items-center gap-1.5"
                            style={{ fontSize: "11px", color: C.muted }}
                          >
                            <div
                              style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "3px",
                                background: l.bg,
                                border: `1px solid ${l.bc}`,
                                flexShrink: 0,
                              }}
                            />
                            {l.label}
                          </div>
                        ))}
                      </div>
                      {/* Seat Grid */}
                      <div
                        className="seat-grid"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(5,1fr)",
                          gap: "10px",
                        }}
                      >
                        {Array.from({ length: MAX_QUEUE }, (_, i) => {
                          const num = i + 1;
                          const qNumText = `${capster?.queue_prefix || ""}${num}`;
                          const isLocked = lockedSlots.some(
                            (s: any) => s.slot_number === num,
                          );
                          const cls =
                            selectedSeat === num
                              ? "seat-sel"
                              : isLocked
                                ? "seat-off"
                                : "seat-avl";
                          return (
                            <button
                              key={num}
                              className={`font-oswald font-bold flex items-center justify-center rounded-md border-2 transition-all duration-200 ${cls}`}
                              style={{
                                aspectRatio: "1",
                                fontSize: "13px",
                                letterSpacing: "1px",
                              }}
                              onClick={() => {
                                if (isLocked) return;
                                setSelectedSeat(num);
                              }}
                            >
                              {qNumText}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div
                    className="flex justify-between"
                    style={{ marginTop: "36px" }}
                  >
                    <button className="btn-outline" onClick={() => setStep(2)}>
                      ← &nbsp; Kembali
                    </button>
                    <button
                      className="btn-gold"
                      disabled={!bookingDate || selectedSeat === null}
                      onClick={() => setStep(4)}
                    >
                      Pembayaran &nbsp; →
                    </button>
                  </div>
                </>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <>
                  <h3
                    className="font-serif text-center"
                    style={{
                      fontSize: "24px",
                      color: C.text,
                      marginBottom: "8px",
                    }}
                  >
                    Selesaikan Pembayaran
                  </h3>
                  <p
                    className="text-center"
                    style={{
                      fontSize: "14px",
                      color: C.muted,
                      maxWidth: "400px",
                      margin: "0 auto 24px",
                      lineHeight: 1.6,
                    }}
                  >
                    Silakan scan kode QRIS di bawah ini untuk mengamankan slot
                    reservasi Anda.
                  </p>

                  <div
                    style={{
                      background: C.beige,
                      borderRadius: "12px",
                      padding: "32px",
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div className="text-center">
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#555",
                          marginBottom: "8px",
                          textTransform: "uppercase",
                          letterSpacing: "2px",
                        }}
                      >
                        Total Tagihan
                      </p>
                      <p
                        className="font-oswald"
                        style={{
                          fontWeight: 700,
                          fontSize: "36px",
                          color: C.dark,
                          lineHeight: 1,
                        }}
                      >
                        Rp {total.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <QrisVisual />
                    <p
                      className="text-center"
                      style={{
                        fontSize: "13px",
                        color: C.muted,
                        maxWidth: "300px",
                        margin: "0 auto",
                      }}
                    >
                      Mendukung semua dompet digital dan M-Banking di seluruh
                      Indonesia.
                    </p>
                  </div>

                  <div
                    className="flex justify-between"
                    style={{ marginTop: "36px" }}
                  >
                    <button className="btn-outline" onClick={() => setStep(3)}>
                      ← &nbsp; Kembali
                    </button>
                    <button className="btn-gold" onClick={doPaymentSuccess}>
                      Simulasikan Sukses &nbsp; ✓
                    </button>
                  </div>
                </>
              )}

              {/* Step 5 */}
              {step === 5 && queue && (
                <div className="text-center" style={{ padding: "24px 0" }}>
                  <div className="no-print">
                    <div
                      className="flex items-center justify-center rounded-full text-white mx-auto mb-6"
                      style={{
                        width: "72px",
                        height: "72px",
                        background: "#25D366",
                        fontSize: "32px",
                        boxShadow: "0 8px 24px rgba(37,211,102,.3)",
                      }}
                    >
                      ✓
                    </div>
                    <h3
                      className="font-serif"
                      style={{
                        fontSize: "24px",
                        color: C.text,
                        marginBottom: "8px",
                      }}
                    >
                      Reservasi Terkonfirmasi!
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: C.muted,
                        marginBottom: "32px",
                        lineHeight: 1.6,
                      }}
                    >
                      Simpan atau bawa bukti reservasi elektronik ini saat Anda
                      berkunjung.
                    </p>
                  </div>

                  <div
                    id="printable-ticket"
                    className="ticket-box"
                    style={{
                      maxWidth: "400px",
                      margin: "0 auto",
                      border: `2px solid ${C.border}`,
                      borderRadius: "16px",
                      padding: "40px",
                      background: "#fff",
                      boxShadow: "0 16px 48px rgba(0,0,0,.08)",
                    }}
                  >
                    <img
                      src="/logopointcut.png"
                      alt="Pointcut Logo"
                      style={{ height: "44px", margin: "0 auto 20px" }}
                    />
                    <p
                      style={{
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        color: C.muted,
                        marginBottom: "8px",
                      }}
                    >
                      KODE RESERVASI
                    </p>
                    <h3
                      className="font-oswald"
                      style={{
                        fontSize: "64px",
                        fontWeight: 700,
                        color: C.dark,
                        margin: "0",
                      }}
                    >
                      {queue}
                    </h3>
                    <div
                      style={{
                        width: "100%",
                        height: "2px",
                        borderTop: `2px dashed ${C.border}`,
                        margin: "24px 0",
                      }}
                    />
                    <div className="flex flex-col gap-3 text-left">
                      {[
                        {
                          label: "Nama",
                          val: (
                            <strong
                              className="font-oswald"
                              style={{
                                fontSize: "16px",
                                textTransform: "uppercase",
                              }}
                            >
                              {customerName}
                            </strong>
                          ),
                        },
                        {
                          label: "Tanggal",
                          val: (
                            <strong
                              className="font-oswald"
                              style={{ fontSize: "16px" }}
                            >
                              {bookingDate
                                ? new Date(bookingDate).toLocaleDateString(
                                    "id-ID",
                                    {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    },
                                  )
                                : "-"}
                            </strong>
                          ),
                        },
                        {
                          label: "Kapster",
                          val: (
                            <strong
                              className="font-serif"
                              style={{ fontSize: "16px", fontStyle: "italic" }}
                            >
                              {capster?.name}
                            </strong>
                          ),
                        },
                        {
                          label: "Layanan",
                          val: (
                            <strong
                              className="font-oswald"
                              style={{ fontSize: "16px" }}
                            >
                              Haircut
                              {addons.length > 0
                                ? ` + ${addons.length} Ekstra`
                                : ""}
                            </strong>
                          ),
                        },
                        {
                          label: "Status",
                          val: (
                            <div
                              style={{
                                background: "rgba(37,211,102,.1)",
                                color: "#1ea851",
                                padding: "4px 10px",
                                borderRadius: "24px",
                                fontSize: "12px",
                                fontWeight: 700,
                                letterSpacing: "1px",
                                display: "inline-block",
                              }}
                            >
                              LUNAS
                            </div>
                          ),
                        },
                      ].map((r) => (
                        <div
                          key={r.label}
                          className="flex justify-between items-center"
                          style={{
                            padding: "8px 0",
                            fontSize: "14px",
                            color: C.text,
                          }}
                        >
                          <span style={{ color: C.muted }}>{r.label}:</span>
                          {r.val}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="no-print flex gap-3 justify-center"
                    style={{ marginTop: "36px" }}
                  >
                    <button className="btn-outline" onClick={downloadPDF}>
                      ⬇ Unduh PDF E-Ticket
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div
            style={{ flex: 1, position: "sticky", top: "96px", width: "100%" }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                border: `1px solid ${C.border}`,
                padding: "28px",
                boxShadow: "0 12px 40px rgba(0,0,0,.04)",
              }}
            >
              <h4
                className="font-serif"
                style={{
                  fontSize: "20px",
                  marginBottom: "20px",
                  paddingBottom: "16px",
                  borderBottom: `1px dashed ${C.border}`,
                  color: C.text,
                }}
              >
                Ringkasan Pemesanan
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Atas Nama", val: customerName },
                  {
                    label: "Tanggal",
                    val: bookingDate
                      ? new Date(bookingDate).toLocaleDateString("id-ID", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })
                      : "-",
                  },
                  { label: "Kapster", val: capster?.name || "-" },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex justify-between items-center"
                    style={{
                      padding: "8px 0",
                      fontSize: "14px",
                      color: C.text,
                    }}
                  >
                    <span style={{ color: C.muted }}>{r.label}</span>
                    <span style={{ fontWeight: 600 }}>{r.val}</span>
                  </div>
                ))}
                <div
                  className="flex justify-between items-center"
                  style={{ padding: "8px 0", fontSize: "14px" }}
                >
                  <span style={{ color: C.muted }}>No. Antrian</span>
                  <span
                    className="font-oswald"
                    style={{ color: C.gold, fontWeight: 700 }}
                  >
                    {capster && selectedSeat
                      ? `${capster.queue_prefix}${selectedSeat}`
                      : "-"}
                  </span>
                </div>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  borderTop: `1px dashed ${C.border}`,
                  paddingTop: "20px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: C.muted,
                    marginBottom: "10px",
                  }}
                >
                  Rincian Biaya
                </p>
                {haircut ? (
                  <div
                    className="flex justify-between items-center"
                    style={{ padding: "8px 0", fontSize: "14px" }}
                  >
                    <span>Haircut Booking</span>
                    <span
                      className="font-oswald"
                      style={{ color: C.gold, fontWeight: 600 }}
                    >
                      Rp 50.000
                    </span>
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: "13px",
                      color: C.muted,
                      fontStyle: "italic",
                    }}
                  >
                    Layanan belum dipilih
                  </p>
                )}
                {addons.map((a) => (
                  <div
                    key={a}
                    className="flex justify-between"
                    style={{ fontSize: "13px", padding: "8px 0" }}
                  >
                    <span>• {a}</span>
                    <span style={{ color: C.gold }}>
                      +{" "}
                      {(
                        addonsData.find((x) => x.name === a)?.price || 0
                      ).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "20px",
                  borderTop: `2px solid ${C.border}`,
                  paddingTop: "20px",
                }}
              >
                <div
                  className="flex justify-between items-center"
                  style={{ padding: "8px 0", fontSize: "14px" }}
                >
                  <span style={{ fontWeight: 700 }}>Total Tagihan</span>
                  <span
                    className="font-oswald"
                    style={{ color: C.dark, fontSize: "24px", fontWeight: 700 }}
                  >
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: C.muted,
                    marginTop: "8px",
                    lineHeight: 1.5,
                  }}
                >
                  *Total ini adalah biaya komitmen reservasi. Biaya
                  ekstra/tambahan bayar di studio.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center"
          style={{
            background: "#fff",
            borderTop: `1px solid ${C.border}`,
            padding: "32px 20px",
            marginTop: "40px",
          }}
        >
          <div className="flex justify-center items-center gap-2.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <a
              href="https://www.instagram.com/pointcut__/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-oswald"
              style={{
                fontSize: "16px",
                letterSpacing: "1px",
                fontWeight: 600,
                color: C.dark,
                textDecoration: "none",
              }}
            >
              @pointcut_
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
