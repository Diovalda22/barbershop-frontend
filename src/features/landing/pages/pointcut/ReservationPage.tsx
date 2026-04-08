import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import styled, { createGlobalStyle } from 'styled-components'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/* ── Theme ── */
const C = {
  dark:'#1a1a18', dark2:'#2a2520', cream:'#f4ede3', beige:'#f8f3eb',
  gold:'#c8a96e', white:'#fff', muted:'#888', text:'#1a1a18',
  border:'#e0d8ce', fS:"'Playfair Display',serif", fB:"'DM Sans',sans-serif", fO:"'Oswald',sans-serif"
}

const GS = createGlobalStyle`
  *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
  body{font-family:${C.fB};background:${C.cream};color:${C.text};overflow-x:hidden}
  img{max-width:100%;display:block}button{cursor:pointer;font-family:inherit}
`
function useFont(){useEffect(()=>{const id='pc-f';if(document.getElementById(id))return;const l=document.createElement('link');l.id=id;l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500&display=swap';document.head.appendChild(l)},[]);}

/* ── Atoms ── */
const BtnGold=styled.button`background:${C.gold};color:#fff;font-family:${C.fO};font-size:14px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:14px 32px;border:none;border-radius:4px;transition:.2s;&:hover:not(:disabled){background:#b09558;}&:disabled{opacity:0.5;cursor:not-allowed}`
const BtnOutline=styled.button<{$light?:boolean}>`background:transparent;font-family:${C.fO};font-size:14px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:12px 30px;border:2px solid ${p=>p.$light?C.white:C.gold};color:${p=>p.$light?C.white:C.gold};border-radius:4px;transition:.25s;&:hover{background:${p=>p.$light?'rgba(255,255,255,.1)':C.gold};color:${p=>p.$light?C.white:C.white};border-color:${p=>p.$light?C.white:C.gold}}`

/* ── Nav ── */
const NavWrap=styled.nav`position:fixed;top:0;left:0;right:0;z-index:999;height:72px;padding:0 5%;display:flex;align-items:center;justify-content:space-between;background:${C.dark};box-shadow:0 4px 24px rgba(0,0,0,.3)`
const NavLogo=styled.img`height:44px;width:auto;object-fit:contain;cursor:pointer;transition:.2s;&:hover{transform:scale(1.05)}`
const NavLinks=styled.ul`display:flex;gap:32px;list-style:none;@media(max-width:768px){display:none}`
const NL=styled.button`background:none;border:none;color:${C.white};font-family:${C.fB};font-size:14px;font-weight:500;padding:4px 0;transition:.2s;&:hover{color:${C.gold}}`
const NavCta=styled.div`@media(max-width:768px){display:none}`
const MBtn=styled.button`display:none;background:none;border:none;color:${C.white};font-size:26px;line-height:1;@media(max-width:768px){display:block}`

/* ── Mobile Menu ── */
const MOverlay=styled.div<{$o:boolean}>`position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.6);backdrop-filter:blur(3px);opacity:${p=>p.$o?1:0};pointer-events:${p=>p.$o?'all':'none'};transition:.3s`
const MMenu=styled.div<{$o:boolean}>`position:fixed;top:0;right:0;bottom:0;z-index:1001;width:280px;background:${C.dark};transform:translateX(${p=>p.$o?'0':'100%'});transition:transform .3s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;`
const MMenuHead=styled.div`display:flex;align-items:center;justify-content:space-between;padding:24px;border-bottom:1px solid rgba(255,255,255,.08)`
const MClose=styled.button`background:none;border:none;color:${C.white};font-size:28px;line-height:1;opacity:.7;&:hover{opacity:1}`
const MMenuBody=styled.div`display:flex;flex-direction:column;padding:24px;gap:8px;flex:1`
const MNL=styled.button`background:none;border:none;color:${C.white};font-family:${C.fB};font-size:16px;font-weight:500;padding:14px 0;text-align:left;border-bottom:1px solid rgba(255,255,255,.06);transition:.2s;&:hover{color:${C.gold}}`

/* ── Booking Layout ── */
const PageWrap=styled.div`background:#fff;min-height:100vh;padding-top:72px;`
const Banner=styled.div`background:${C.dark};padding:60px 5%;text-align:center;color:${C.white};position:relative;overflow:hidden;`
const Mustache=styled.div`font-size:24px;color:${C.gold};margin-bottom:12px;opacity:.8`
const BannerTitle=styled.h1`font-family:${C.fS};font-size:clamp(32px,5vw,54px);margin-bottom:12px;font-weight:700`
const BannerSub=styled.p`color:rgba(255,255,255,.7);font-size:15px;max-width:500px;margin:0 auto;line-height:1.6`

const Board=styled.div`max-width:1100px;margin:-40px auto 60px;padding:0 5%;display:flex;gap:24px;align-items:flex-start;position:relative;z-index:10;@media(max-width:900px){flex-direction:column;margin-top:-20px;align-items:stretch;}`
const MainCol=styled.div`width:100%;max-width:100%;flex:1.7;background:#fff;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.06);overflow:hidden;border:1px solid ${C.border};`
const SideCol=styled.div`flex:1;position:sticky;top:96px;width:100%;@media(max-width:900px){padding-bottom:32px;}`

/* ── Stepper ── */
const StepperWrap=styled.div`display:flex;background:#fff;padding:20px 24px;overflow-x:auto;border-bottom:1px solid ${C.border};&::-webkit-scrollbar{display:none}`
const StepNode=styled.div<{$act:boolean,$done:boolean}>`display:flex;align-items:center;gap:10px;opacity:${p=>p.$act||p.$done?1:.4};position:relative;margin-right:32px;&::after{content:'';position:absolute;right:-24px;top:50%;width:16px;height:2px;background:${C.border};transform:translateY(-50%)}&:last-child{margin-right:0}&:last-child::after{display:none}`
const StepCircle=styled.div<{$act:boolean,$done:boolean}>`width:28px;height:28px;border-radius:50%;background:${p=>p.$done?C.gold:p.$act?'#fff':C.beige};border:2px solid ${p=>p.$done||p.$act?C.gold:C.border};color:${p=>p.$done||p.$act?'#fff':C.muted};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;`
const StepLabel=styled.span`font-family:${C.fO};font-size:13px;letter-spacing:1px;text-transform:uppercase;color:${C.text};white-space:nowrap`

/* ── Content Area ── */
const BookBody=styled.div`padding:32px;@media(max-width:600px){padding:24px}`
const SHead=styled.h3`font-family:${C.fS};font-size:24px;color:${C.text};margin-bottom:8px;@media(max-width:600px){font-size:20px;}`
const SDesc=styled.p`font-size:14px;color:${C.muted};margin-bottom:32px;line-height:1.6;@media(max-width:600px){font-size:13px;margin-bottom:24px;}`

/* ── Cards ── */
const LRadio=styled.div<{$sel:boolean}>`border:2px solid ${p=>p.$sel?C.gold:C.border};padding:20px;border-radius:8px;cursor:pointer;transition:.2s;background:${p=>p.$sel?'rgba(200,169,110,.04)':C.white};display:flex;justify-content:space-between;align-items:center;&:hover{border-color:${C.gold};}`
const CRadio=styled.div<{$sel:boolean}>`border:2px solid ${p=>p.$sel?C.gold:C.border};padding:16px;border-radius:10px;cursor:pointer;transition:.2s;background:${p=>p.$sel?'rgba(200,169,110,.04)':C.white};display:flex;align-items:center;gap:16px;&:hover{border-color:${C.gold};}`

/* ── Addons Accordion ── */
const AddBox=styled.div`margin-top:24px;border:1px solid ${C.border};border-radius:8px;overflow:hidden`
const AddHead=styled.button`width:100%;background:rgba(200,169,110,.05);padding:16px 20px;display:flex;justify-content:space-between;align-items:center;border:none;font-family:${C.fB};font-size:14px;font-weight:500;color:${C.text};&:hover{background:rgba(200,169,110,.1)}`
const AddBody=styled.div<{$open:boolean}>`max-height:${p=>p.$open?'800px':'0'};overflow:hidden;transition:max-height .6s cubic-bezier(.4,0,.2,1);background:${C.white}`
const AddContent=styled.div`padding:24px;@media(max-width:600px){padding:20px;}`

/* ── Date & Seat ── */
const DateRow=styled.div`display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;margin-bottom:24px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;&::-webkit-scrollbar{display:none}`
const DateBtn=styled.button<{$act:boolean}>`flex-shrink:0;width:80px;border:2px solid ${p=>p.$act?C.gold:C.border};background:${p=>p.$act?C.gold:C.white};color:${p=>p.$act?C.white:C.muted};padding:14px 0;border-radius:10px;display:flex;flex-direction:column;align-items:center;transition:.2s;scroll-snap-align:start;@media(max-width:600px){width:70px;padding:12px 0;}&:hover{border-color:${C.gold};}`
const DateDay = styled.span`font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;@media(max-width:600px){font-size:10px;margin-bottom:2px}`
const DateNum = styled.span`font-family:${C.fO};font-size:24px;font-weight:700;line-height:1;@media(max-width:600px){font-size:20px;}`
const DateMonth = styled.span`font-size:10px;margin-top:4px;@media(max-width:600px){font-size:9px;margin-top:2px;}`

const SeatLegend=styled.div`display:flex;flex-wrap:wrap;gap:16px;margin-bottom:20px;padding:12px;background:${C.beige};border-radius:8px`
const LegItem=styled.div`display:flex;align-items:center;gap:6px;font-size:11px;color:${C.muted}`
const LegDot=styled.div<{$c:string}>`width:16px;height:16px;border-radius:3px;background:${p=>p.$c};border:1px solid ${C.border};flex-shrink:0`
const SeatGrid=styled.div`display:grid;grid-template-columns:repeat(5,1fr);gap:10px;@media(max-width:600px){grid-template-columns:repeat(4,1fr);gap:8px;}@media(max-width:400px){grid-template-columns:repeat(3,1fr);}`
const Seat=styled.button<{$s:'avl'|'off'|'onl'|'sel'}>`
  aspect-ratio:1;border-radius:6px;border:2px solid;
  font-family:${C.fO};font-size:13px;font-weight:700;letter-spacing:1px;
  display:flex;align-items:center;justify-content:center;transition:.2s;
  ${p=>p.$s==='avl'&&`background:${C.white};border-color:${C.border};color:${C.text};cursor:pointer;&:hover{border-color:${C.gold};color:${C.gold}}`}
  ${p=>p.$s==='off'&&`background:#3a3530;border-color:#3a3530;color:rgba(255,255,255,.4);cursor:not-allowed`}
  ${p=>p.$s==='onl'&&`background:rgba(200,169,110,.15);border-color:${C.gold};color:${C.gold};cursor:not-allowed`}
  ${p=>p.$s==='sel'&&`background:${C.gold};border-color:${C.gold};color:${C.white};cursor:pointer`}
`

/* ── Sidebar Summary ── */
const StickyBox=styled.div`background:${C.white};border-radius:12px;border:1px solid ${C.border};padding:28px;box-shadow:0 12px 40px rgba(0,0,0,.04);`
const SSumTitle=styled.h4`font-family:${C.fS};font-size:20px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px dashed ${C.border};color:${C.text}`
const SRow=styled.div`display:flex;justify-content:space-between;align-items:center;padding:8px 0;font-size:14px;color:${C.text}`

/* ── Payment QRIS ── */
const QrisBox=styled.div`border:3px solid #ed1b24;border-radius:12px;width:260px;margin:32px auto;background:#fff;overflow:hidden;box-shadow:0 12px 30px rgba(237,27,36,.15);`
const QrisHead=styled.div`background:#ed1b24;color:#fff;font-family:${C.fO};font-size:24px;font-weight:700;padding:14px 0;letter-spacing:3px;display:flex;align-items:center;justify-content:center;gap:8px;`
const QrisBody=styled.div`padding:24px;background:#fff`

/* ── Receipt ── */
const TicketBox=styled.div`max-width:400px;margin:0 auto;border:2px solid ${C.border};border-radius:16px;padding:40px;background:#fff;position:relative;box-shadow:0 16px 48px rgba(0,0,0,.08);@media(max-width:600px){padding:24px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.04);}`
const TLogo=styled.img`height:44px;margin:0 auto 20px`

const PrintStyle = createGlobalStyle`
  @media print {
    body * { visibility: hidden !important; }
    #printable-ticket, #printable-ticket * { visibility: visible !important; }
    #printable-ticket { position: absolute; left: 0; top: 0; width: 100%; border: none !important; padding: 20px !important; margin: 0; }
    @page { margin: 0; size: auto; }
  }
`
import { Storage } from '@/services/storage'

/* ── Data ── */
const MAX_QUEUE=15
const RESERVASI_FEE=50000 // Fixed haircut price for online booking
const getDays=()=>{const d=[];for(let i=0;i<7;i++){const t=new Date();t.setDate(t.getDate()+i);d.push({val:t.toISOString().split('T')[0],d:t.toLocaleDateString('id-ID',{weekday:'short'}),n:t.getDate(),m:t.toLocaleDateString('id-ID',{month:'short'})})}return d;}
const DAYS=getDays()

// Realistic QR Math
const QR_SIZE=28;
const QR_SEED=Array.from({length:QR_SIZE*QR_SIZE},(_,i)=> {
  return (i*13 + Math.floor(i/QR_SIZE)*7 + Math.floor(i/3)*11)%2===0
})


export function ReservationPage() {
  useFont()
  const navigate = useNavigate()
  const shopName = Storage.get('settings', { shopName: 'Pointcut Barbershop' }).shopName;
  const [capsters, setCapsters] = useState<any[]>([])
  const [addonsData, setAddonsData] = useState<any[]>([])
  const [lockedSlots, setLockedSlots] = useState<any[]>([]);
  const [menu,setMenu]=useState(false)

  const [step,setStep]=useState(1)
  const [haircut,setHaircut]=useState<string|null>(null)
  const [addOpen,setAddOpen]=useState(false)
  const [addons,setAddons]=useState<string[]>([])
  const [capster,setCapster]=useState<any>(null)
  const [queue,setQueue]=useState<string|null>(null)
  const [selectedSeat,setSelectedSeat]=useState<number|null>(null)
  const [bookingDate,setBookingDate]=useState<string|null>(null)
  const [customerName,setCustomerName]=useState<string>('Pelanggan')

  // Auth Guard
  useEffect(() => {
    const token = localStorage.getItem('customer_token')
    if (!token) {
      navigate('/user/login?redirect=/booking')
    } else {
      setCustomerName(localStorage.getItem('customer_name') || 'Pelanggan')
    }
    document.title = `Booking - ${shopName}`;
  }, [navigate, shopName])

  // Fetch Capsters & Services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          api.get('/capsters?barbershop=pointcut'),
          api.get('/services?barbershop=pointcut')
        ]);
        if (cRes.success) {
          // Filter only senior capsters as requested
          const seniors = cRes.data.filter((c: any) => 
            c.is_senior || 
            c.specialization?.toLowerCase().includes('senior') ||
            c.role?.toLowerCase().includes('senior')
          );
          setCapsters(seniors);
        }
        if (sRes.success) setAddonsData(sRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  // Sync Locked Slots from Backend
  useEffect(() => {
    if (bookingDate && capster) {
      const fetchLocks = async () => {
        try {
          const res = await api.get(`/slot-locks?date=${bookingDate}&capster_id=${capster.id}&barbershop=pointcut`);
          if (res.success) {
            setLockedSlots(res.data);
          }
        } catch (err) {
          console.error('Failed to sync locks:', err);
        }
      };
      fetchLocks();
    }
  }, [bookingDate, capster]);

  const goHome = () => navigate('/')

  const addonPrice = addons.reduce((a, n) => a + (addonsData.find(x => x.name === n)?.price || 0), 0)
  const total = RESERVASI_FEE + addonPrice

  const toggleAddon=(n:string)=>setAddons(p=>p.includes(n)?p.filter(x=>x!==n):[...p,n])

  const doPaymentSuccess = async () => {
    if (!capster || selectedSeat === null || !bookingDate) return
    const qNum = `${capster.qPrefix || capster.queue_prefix}${selectedSeat}`;

    try {
      const res = await api.post('/bookings', {
        capster_id: capster.id,
        service_id: addonsData.find(x => x.name.toLowerCase().includes('haircut'))?.id || addonsData[0]?.id,
        booking_date: bookingDate,
        start_time: '12:00', 
        slot_number: selectedSeat,
        notes: `Seat: ${qNum}. Addons: ${addons.join(', ')}`,
        payment_method: 'midtrans'
      });

      if (res.success) {
        setQueue(res.data.queue_number || qNum);
        setStep(5);
      } else {
        alert('Gagal membuat pesanan: ' + res.message);
      }
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Terjadi kesalahan saat membuat pesanan.');
    }
  }

  const downloadPDF=async()=>{
    const el=document.getElementById('printable-ticket');
    if(!el)return;
    const originalBoxShadow = el.style.boxShadow;
    try{
      el.style.boxShadow = 'none';
      const canvas=await html2canvas(el, {scale: 3, useCORS: true, backgroundColor: '#ffffff'});
      const img=canvas.toDataURL('image/png', 1.0);
      const pdf=new jsPDF({orientation:'portrait', unit:'px', format:[canvas.width/3+40, canvas.height/3+40]});
      pdf.addImage(img, 'PNG', 20, 20, canvas.width/3, canvas.height/3);
      pdf.save(`Resi-Pointcut-${queue}.pdf`);
    } catch(err){
      console.error('Error', err);
    } finally {
      el.style.boxShadow = originalBoxShadow;
    }
  }

  const STEPS=['Layanan','Kapster','Jadwal','Payment','Struk']
  const logout = () => { localStorage.removeItem('customer_token'); navigate('/'); }

  /* Realistic QR Component */
  const QrisVisual = () => (
    <QrisBox>
      <QrisHead>
        <span>QRIS</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10V4h6"/><path d="M20 10V4h-6"/><path d="M4 14v6h6"/><path d="M20 14v6h-6"/></svg>
      </QrisHead>
      <QrisBody>
        <div style={{position:'relative', width:'100%', aspectRatio:'1', margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:`repeat(${QR_SIZE},1fr)`,width:'100%',height:'100%'}}>
             {QR_SEED.map((f,i)=><div key={i} style={{background:f?'#000':'#fff'}}/>)}
          </div>
          {/* Locators */}
          <div style={{position:'absolute',top:'-2px',left:'-2px',width:'44px',height:'44px',background:'#fff',padding:'4px'}}>
             <div style={{width:'100%',height:'100%',border:'5px solid #000',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{width:'14px',height:'14px',background:'#000'}}/>
             </div>
          </div>
          <div style={{position:'absolute',top:'-2px',right:'-2px',width:'44px',height:'44px',background:'#fff',padding:'4px'}}>
             <div style={{width:'100%',height:'100%',border:'5px solid #000',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{width:'14px',height:'14px',background:'#000'}}/>
             </div>
          </div>
          <div style={{position:'absolute',bottom:'-2px',left:'-2px',width:'44px',height:'44px',background:'#fff',padding:'4px'}}>
             <div style={{width:'100%',height:'100%',border:'5px solid #000',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{width:'14px',height:'14px',background:'#000'}}/>
             </div>
          </div>
        </div>
      </QrisBody>
      <div style={{background:'#eee',textAlign:'center',padding:'12px',fontFamily:C.fB,fontSize:'12px',color:'#555',fontWeight:700}}>GPN / PT POINT CUT STUDIO</div>
    </QrisBox>
  )

  return (
    <>
      <GS/>
      
      {/* Navbar */}
      <NavWrap>
        <NavLogo src="/logopointcut.png" alt="Point Cut" onClick={goHome}/>
        <NavLinks><li><NL onClick={goHome}>Home</NL></li></NavLinks>
        <NavCta><BtnOutline $light onClick={logout}>LOGOUT</BtnOutline></NavCta>
        <MBtn onClick={()=>setMenu(o=>!o)}>☰</MBtn>
      </NavWrap>

      <MOverlay $o={menu} onClick={()=>setMenu(false)}/>
      <MMenu $o={menu}>
        <MMenuHead>
          <NavLogo src="/logopointcut.png" onClick={goHome}/>
          <MClose onClick={()=>setMenu(false)}>×</MClose>
        </MMenuHead>
        <MMenuBody>
          <MNL onClick={goHome}>Home</MNL>
          <BtnOutline $light style={{marginTop:'24px'}} onClick={logout}>LOGOUT</BtnOutline>
        </MMenuBody>
      </MMenu>

      <PageWrap>
        <Banner>
           <Mustache>✂</Mustache>
           <BannerTitle>Halo, {customerName}</BannerTitle>
           <BannerSub>Selamat datang di <strong>{shopName}</strong>. Rasakan kemudahan menjadwalkan grooming session Anda dengan antarmuka yang cepat, transparan, dan profesional.</BannerSub>
        </Banner>

        <Board>
          {/* Main Content (Left) */}
          <MainCol>
            {step < 5 && (
              <StepperWrap>
                {STEPS.slice(0,4).map((l,i)=>(
                  <StepNode key={l} $act={step===i+1} $done={step>i+1}>
                    <StepCircle $act={step===i+1} $done={step>i+1}>{step>i+1?'✓':i+1}</StepCircle>
                    <StepLabel>{l}</StepLabel>
                  </StepNode>
                ))}
              </StepperWrap>
            )}

            <BookBody>
              {/* Step 1 */}
              {step===1&&(
                <>
                  <SHead>Pilihan Layanan</SHead>
                  <SDesc>Pilih paket layanan potong rambut oleh Senior Capster dan tentukan gaya tambahan khusus Anda.</SDesc>
                  
                  <LRadio $sel={haircut==='haircut'} onClick={()=>setHaircut('haircut')}>
                    <div>
                      <p style={{fontFamily:C.fS,fontSize:'18px',fontWeight:700,marginBottom:'4px'}}>Haircut</p>
                      <p style={{fontSize:'13px',color:C.muted}}>Biaya Booking Online: Rp 50.000</p>
                    </div>
                    <div style={{width:'24px',height:'24px',borderRadius:'50%',border:`2px solid ${haircut==='haircut'?C.gold:C.border}`,background:haircut==='haircut'?C.gold:'transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      {haircut==='haircut'&&<div style={{width:'10px',height:'10px',background:'#fff',borderRadius:'50%'}}/>}
                    </div>
                  </LRadio>

                  <AddBox>
                    <AddHead onClick={()=>setAddOpen(o=>!o)}>
                      <span>✨ Tambah Layanan Ekstra (Colors, Perms, dll)</span>
                      <span>{addOpen ? '▲' : '▼'}</span>
                    </AddHead>
                    <AddBody $open={addOpen}>
                      <AddContent>
                        <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                          {/* Coloring Section */}
                          <div>
                            <p style={{fontSize:'12px', fontWeight:800, color:C.gold, letterSpacing:'1.5px', marginBottom:'12px', textTransform:'uppercase', borderBottom:`1px solid ${C.border}`, paddingBottom:'8px'}}>Coloring</p>
                            {addonsData.filter(x => x.name.toLowerCase().includes('coloring') || x.name.toLowerCase().includes('highlight')).map(item => (
                              <div key={item.name} onClick={() => toggleAddon(item.name)} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0',
                                borderBottom: `1px solid rgba(224, 216, 206, 0.4)`, cursor: 'pointer', transition: '.2s'
                              }}>
                                <div>
                                  <span style={{ fontSize: '14px', fontWeight: addons.includes(item.name) ? 700 : 500, color: addons.includes(item.name) ? C.gold : C.text }}>{item.name}</span>
                                  <p style={{ fontSize: '11px', color: C.muted, marginTop: 2 }}>Profesional treatment</p>
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: addons.includes(item.name) ? C.gold : C.muted }}>
                                  +Rp {(item.price / 1000)}k {addons.includes(item.name) && "✓"}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Perm & Treatment Section */}
                          <div>
                            <p style={{fontSize:'12px', fontWeight:800, color:C.gold, letterSpacing:'1.5px', marginBottom:'12px', textTransform:'uppercase', borderBottom:`1px solid ${C.border}`, paddingBottom:'8px'}}>Perm & Treatment</p>
                            {addonsData.filter(x => x.name.toLowerCase().includes('perm') || x.name.toLowerCase().includes('lift')).map(item => (
                              <div key={item.name} onClick={() => toggleAddon(item.name)} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0',
                                borderBottom: `1px solid rgba(224, 216, 206, 0.4)`, cursor: 'pointer'
                              }}>
                                <div>
                                  <span style={{ fontSize: '14px', fontWeight: addons.includes(item.name) ? 700 : 500, color: addons.includes(item.name) ? C.gold : C.text }}>{item.name}</span>
                                  <p style={{ fontSize: '11px', color: C.muted, marginTop: 2 }}>Style with chemicals</p>
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: addons.includes(item.name) ? C.gold : C.muted }}>
                                  +Rp {(item.price / 1000)}k {addons.includes(item.name) && "✓"}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Others Section */}
                          <div>
                            <p style={{fontSize:'12px', fontWeight:800, color:C.gold, letterSpacing:'1.5px', marginBottom:'12px', textTransform:'uppercase', borderBottom:`1px solid ${C.border}`, paddingBottom:'8px'}}>Layanan Lainnya</p>
                            {addonsData.filter(x => !x.name.toLowerCase().includes('coloring') && !x.name.toLowerCase().includes('highlight') && !x.name.toLowerCase().includes('perm') && !x.name.toLowerCase().includes('lift')).map(item => (
                              <div key={item.name} onClick={() => toggleAddon(item.name)} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0',
                                borderBottom: `1px solid rgba(224, 216, 206, 0.4)`, cursor: 'pointer'
                              }}>
                                <div>
                                  <span style={{ fontSize: '14px', fontWeight: addons.includes(item.name) ? 700 : 500, color: addons.includes(item.name) ? C.gold : C.text }}>{item.name}</span>
                                  <p style={{ fontSize: '11px', color: C.muted, marginTop: 2 }}>Additional care</p>
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: addons.includes(item.name) ? C.gold : C.muted }}>
                                  +Rp {(item.price / 1000)}k {addons.includes(item.name) && "✓"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </AddContent>
                    </AddBody>
                  </AddBox>

                  <div style={{marginTop:'36px',textAlign:'right'}}>
                    <BtnGold disabled={!haircut} onClick={()=>setStep(2)}>Selanjutnya &nbsp; →</BtnGold>
                  </div>
                </>
              )}

              {/* Step 2 */}
              {step===2&&(
                <>
                  <SHead>Pilih Kapster</SHead>
                  <SDesc>Pilih ahli tata rambut favorit Anda yang akan menangani grooming session Anda.</SDesc>
                  <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                    {capsters.map((c:any)=>(
                      <CRadio key={c.id} $sel={capster?.id===c.id} onClick={()=>{setCapster(c);setSelectedSeat(null)}}>
                        <img src={c.avatar || '/default-avatar.png'} alt={c.name} style={{width:'70px',height:'70px',objectFit:'cover',borderRadius:'12px'}}/>
                        <div style={{flex:1}}>
                          <p style={{fontFamily:C.fS,fontSize:'18px',fontWeight:700}}>{c.name}</p>
                          <p style={{fontSize:'12px',color:C.gold,fontFamily:C.fO,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'4px'}}>Senior Capster — KODE {c.queue_prefix}</p>
                          <p style={{fontSize:'13px',color:C.muted}}>{c.bio || 'Professional Capster'}</p>
                        </div>
                        <div style={{width:'24px',height:'24px',borderRadius:'50%',border:`2px solid ${capster?.id===c.id?C.gold:C.border}`,background:capster?.id===c.id?C.gold:'transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          {capster?.id===c.id&&<div style={{width:'10px',height:'10px',background:'#fff',borderRadius:'50%'}}/>}
                        </div>
                      </CRadio>
                    ))}
                  </div>

                  <div style={{marginTop:'36px',display:'flex',justifyContent:'space-between'}}>
                    <BtnOutline onClick={()=>setStep(1)}>← &nbsp; Kembali</BtnOutline>
                    <BtnGold disabled={!capster} onClick={()=>setStep(3)}>Selanjutnya &nbsp; →</BtnGold>
                  </div>
                </>
              )}

              {/* Step 3 */}
              {step===3&&(
                <>
                  <SHead>Pilih Waktu Kedatangan</SHead>
                  <SDesc>Pilih hari, lalu ambil nomor antrian yang masih tersedia untuk kapster <strong>{capster?.nama}</strong>.</SDesc>
                  
                  <DateRow>
                    {DAYS.map(d=>(
                      <DateBtn key={d.val} $act={bookingDate===d.val} onClick={()=>{setBookingDate(d.val);setSelectedSeat(null)}}>
                        <DateDay>{d.d}</DateDay>
                        <DateNum>{d.n}</DateNum>
                        <DateMonth>{d.m}</DateMonth>
                      </DateBtn>
                    ))}
                  </DateRow>

                  {bookingDate && (
                    <div style={{marginTop:'24px',animation:'fadeIn .5s ease'}}>
                      <SeatLegend>
                        <LegItem><LegDot $c="#fee2e2" style={{borderColor:'#ef4444'}}/>Terkunci/Penuh</LegItem>
                        <LegItem><LegDot $c="#fff"/>Tersedia</LegItem>
                        <LegItem><LegDot $c={C.gold}/>Pilihan Anda</LegItem>
                      </SeatLegend>
                      <SeatGrid>
                        {Array.from({length: MAX_QUEUE}, (_, i) => {
                          const num = i + 1;
                          const prefix = capster?.queue_prefix || '';
                          const qNumText = `${prefix}${num}`;
                          
                          const isLocked = lockedSlots.some((s:any) => s.slot_number === num);
                          
                          const st:any = selectedSeat === num ? 'sel' : isLocked ? 'off' : 'avl'
                          return(
                            <Seat key={num} $s={st}
                              onClick={()=>{if(isLocked)return;setSelectedSeat(num)}}
                              title={isLocked?`Tidak Tersedia`:`Tersedia`}
                            >{qNumText}</Seat>
                          )
                        })}
                      </SeatGrid>
                    </div>
                  )}

                  <div style={{marginTop:'36px',display:'flex',justifyContent:'space-between'}}>
                    <BtnOutline onClick={()=>setStep(2)}>← &nbsp; Kembali</BtnOutline>
                    <BtnGold disabled={!bookingDate || selectedSeat===null} onClick={()=>setStep(4)}>Pembayaran &nbsp; →</BtnGold>
                  </div>
                </>
              )}

              {/* Step 4 */}
              {step===4&&(
                <>
                  <SHead style={{textAlign:'center'}}>Selesaikan Pembayaran</SHead>
                  <SDesc style={{textAlign:'center',maxWidth:'400px',margin:'0 auto 24px'}}>Silakan scan kode QRIS di bawah ini untuk mengamankan slot reservasi Anda secara instan.</SDesc>
                  
                  <div style={{background:C.beige,borderRadius:'12px',padding:'32px',border:`1px solid ${C.border}`}}>
                    <div style={{textAlign:'center'}}>
                      <p style={{fontSize:'14px',color:'#555',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'2px'}}>Total Tagihan</p>
                      <p style={{fontFamily:C.fO,fontWeight:700,fontSize:'36px',color:C.dark,lineHeight:1}}>Rp {total.toLocaleString('id-ID')}</p>
                    </div>
                    
                    <QrisVisual />
                    
                    <p style={{textAlign:'center',fontSize:'13px',color:C.muted,maxWidth:'300px',margin:'0 auto'}}>Mendukung semua dompet digital dan M-Banking di seluruh Indonesia.</p>
                  </div>

                  <div style={{marginTop:'36px',display:'flex',justifyContent:'space-between'}}>
                    <BtnOutline onClick={()=>setStep(3)}>← &nbsp; Kembali</BtnOutline>
                    <BtnGold onClick={doPaymentSuccess}>Simulasikan Sukses &nbsp; ✓</BtnGold>
                  </div>
                </>
              )}

              {/* Step 5 */}
              {step===5&&queue&&(
                <div style={{textAlign:'center',padding:'24px 0'}}>
                  <PrintStyle />
                  <div className="no-print">
                    <div style={{width:'72px',height:'72px',borderRadius:'50%',background:'#25D366',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',color:'#fff',margin:'0 auto 24px',boxShadow:'0 8px 24px rgba(37,211,102,.3)'}}>✓</div>
                    <SHead>Reservasi Terkonfirmasi!</SHead>
                    <SDesc>Simpan atau bawa bukti reservasi elektronik ini saat Anda berkunjung ke studio.</SDesc>
                  </div>

                  <TicketBox id="printable-ticket">
                     <TLogo src="/logopointcut.png" alt="Pointcut Logo"/>
                     <p style={{fontSize:'11px',textTransform:'uppercase',letterSpacing:'2px',color:C.muted,marginBottom:'8px'}}>KODE RESERVASI</p>
                     <h3 style={{fontFamily:C.fO,fontSize:'64px',fontWeight:700,color:C.dark,margin:'0'}}>{queue}</h3>
                     <div style={{width:'100%',height:'2px',borderTop:`2px dashed ${C.border}`,margin:'24px 0'}}></div>
                     <div style={{textAlign:'left',display:'flex',flexDirection:'column',gap:'12px'}}>
                       <SRow><span style={{color:C.muted}}>Nama:</span><strong style={{fontFamily:C.fO,fontSize:'16px',textTransform:'uppercase'}}>{customerName}</strong></SRow>
                       <SRow><span style={{color:C.muted}}>Tanggal:</span><strong style={{fontFamily:C.fO,fontSize:'16px'}}>{bookingDate ? new Date(bookingDate).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) : '-'}</strong></SRow>
                       <SRow><span style={{color:C.muted}}>Kapster:</span><strong style={{fontFamily:C.fS,fontSize:'16px',fontStyle:'italic'}}>{capster?.name}</strong></SRow>
                       <SRow><span style={{color:C.muted}}>Layanan:</span><strong style={{fontFamily:C.fO,fontSize:'16px',textAlign:'right'}}>Haircut{addons.length>0? ' + ' + addons.length + ' Ekstra' : ''}</strong></SRow>
                       <SRow><span style={{color:C.muted}}>Status:</span><div style={{background:'rgba(37,211,102,.1)',color:'#1ea851',padding:'4px 10px',borderRadius:'24px',fontSize:'12px',fontWeight:700,letterSpacing:'1px',display:'inline-block'}}>LUNAS</div></SRow>
                     </div>
                  </TicketBox>

                  <div className="no-print" style={{marginTop:'36px',display:'flex',gap:'12px',justifyContent:'center'}}>
                    <BtnOutline onClick={downloadPDF}>⬇ Unduh PDF E-Ticket</BtnOutline>
                  </div>
                </div>
              )}
            </BookBody>
          </MainCol>

          {/* Sidebar Summary (Right) */}
          <SideCol>
            <StickyBox>
               <SSumTitle>Ringkasan Pemesanan</SSumTitle>
               
               <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                 <SRow><span style={{color:C.muted}}>Atas Nama</span><span style={{fontWeight:600}}>{customerName}</span></SRow>
                 <SRow><span style={{color:C.muted}}>Tanggal</span><span style={{fontWeight:600}}>{bookingDate ? new Date(bookingDate).toLocaleDateString('id-ID',{weekday:'short',day:'numeric',month:'short'}) : '-'}</span></SRow>
                 <SRow><span style={{color:C.muted}}>Kapster</span><span style={{fontWeight:600}}>{capster?.name || '-'}</span></SRow>
                 <SRow><span style={{color:C.muted}}>No. Antrian</span><span style={{color:C.gold,fontWeight:700}}>{capster&&selectedSeat?`${capster.queue_prefix}${selectedSeat}`:'-'}</span></SRow>
               </div>

               <div style={{marginTop:'20px',borderTop:`1px dashed ${C.border}`,paddingTop:'20px',display:'flex',flexDirection:'column',gap:'10px'}}>
                 <p style={{fontSize:'11px',textTransform:'uppercase',letterSpacing:'2px',color:C.muted}}>Rincian Biaya</p>
                 {haircut ? (
                    <SRow><span>Haircut Booking</span><span style={{color:C.gold,fontWeight:600}}>Rp 50.000</span></SRow>
                  ) : (
                    <p style={{fontSize:'13px',color:C.muted,fontStyle:'italic'}}>Layanan belum dipilih</p>
                  )}
                 {addons.map(a => <SRow key={a} style={{ fontSize: '13px' }}><span>• {a}</span><span style={{ color: C.gold }}>+ {(addonsData.find(x => x.name === a)?.price || 0).toLocaleString('id-ID')}</span></SRow>)}
               </div>

               <div style={{marginTop:'20px',borderTop:`2px solid ${C.border}`,paddingTop:'20px'}}>
                 <SRow style={{alignItems:'center'}}>
                   <span style={{fontWeight:700}}>Total Tagihan</span>
                   <span style={{color:C.dark,fontFamily:C.fO,fontSize:'24px',fontWeight:700}}>Rp {total.toLocaleString('id-ID')}</span>
                 </SRow>
                 <p style={{fontSize:'11px',color:C.muted,marginTop:'8px',lineHeight:1.5}}>*Total ini adalah biaya komitmen reservasi. Biaya ekstra/tambahan bayar di studio.</p>
               </div>
            </StickyBox>
          </SideCol>

        </Board>

        {/* Footer */}
        <div style={{background:'#fff',borderTop:`1px solid ${C.border}`,padding:'32px 20px',textAlign:'center',color:C.dark,marginTop:'40px'}}>
           <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'10px'}}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
             <a href="https://www.instagram.com/pointcut__/" target="_blank" rel="noopener noreferrer" style={{fontFamily:C.fO,fontSize:'16px',letterSpacing:'1px',fontWeight:600}}>@pointcut_</a>
           </div>
        </div>
      </PageWrap>
    </>
  )
}
