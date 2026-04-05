import { useState, useEffect } from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'

/* ── Theme ── */
const C = {
  dark:'#1a1a18', dark2:'#2a2520', cream:'#f4ede3', beige:'#ede6db',
  gold:'#c8a96e', white:'#fff', muted:'#888', text:'#1a1a18',
  border:'#e0d8ce', fS:"'Playfair Display',serif", fB:"'DM Sans',sans-serif", fO:"'Oswald',sans-serif"
}

/* ── Global ── */
const GS = createGlobalStyle`
  *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
  body{font-family:${C.fB};background:${C.cream};color:${C.text};overflow-x:hidden}
  img{max-width:100%;display:block}button{cursor:pointer;font-family:inherit}
`
function useFont(){useEffect(()=>{const id='pc-f';if(document.getElementById(id))return;const l=document.createElement('link');l.id=id;l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500&display=swap';document.head.appendChild(l)},[]);}

/* ── Atoms ── */
const BtnGold=styled.button`background:${C.gold};color:#fff;font-family:${C.fO};font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:12px 28px;border:none;transition:.25s;&:hover{background:#b09558}`
const BtnOutline=styled.button<{$light?:boolean}>`background:transparent;font-family:${C.fO};font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:11px 26px;border:2px solid ${p=>p.$light?C.white:C.gold};color:${p=>p.$light?C.white:C.gold};transition:.25s;&:hover{background:${C.gold};color:${C.white};border-color:${C.gold}}`
const SecLabel=styled.p`font-family:${C.fB};font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${C.gold};margin-bottom:10px;text-align:center`
const Mustache=styled.div`text-align:center;font-size:20px;margin:8px 0 20px;opacity:.5`

/* ── Nav ── */
const NavWrap=styled.nav<{$s:boolean}>`position:fixed;top:0;left:0;right:0;z-index:999;height:68px;padding:0 5%;display:flex;align-items:center;justify-content:space-between;transition:.3s;${p=>p.$s?css`background:${C.dark};box-shadow:0 2px 20px rgba(0,0,0,.4)`:css`background:transparent`}`
const NavLogo=styled.img`height:44px;width:auto;object-fit:contain`
const NavLinks=styled.ul`display:flex;gap:28px;list-style:none;@media(max-width:768px){display:none}`
const NL=styled.button<{$a?:boolean}>`background:none;border:none;color:${p=>p.$a?C.gold:C.white};font-family:${C.fB};font-size:14px;font-weight:500;padding:4px 0;border-bottom:2px solid ${p=>p.$a?C.gold:'transparent'};transition:.2s;&:hover{color:${C.gold}}`
const NavCta=styled.div`@media(max-width:768px){display:none}`
const MBtn=styled.button`display:none;background:none;border:none;color:${C.white};font-size:26px;line-height:1;@media(max-width:768px){display:block}`
const MOverlay=styled.div<{$o:boolean}>`position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.55);opacity:${p=>p.$o?1:0};pointer-events:${p=>p.$o?'all':'none'};transition:opacity .3s ease`
const MMenu=styled.div<{$o:boolean}>`position:fixed;top:0;right:0;bottom:0;z-index:1001;width:280px;background:${C.dark};transform:translateX(${p=>p.$o?'0':'100%'});transition:transform .3s ease;display:flex;flex-direction:column;padding:0;overflow-y:auto`
const MMenuHead=styled.div`display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid rgba(255,255,255,.08)`
const MClose=styled.button`background:none;border:none;color:${C.white};font-size:26px;line-height:1;opacity:.7;&:hover{opacity:1}`
const MMenuBody=styled.div`display:flex;flex-direction:column;padding:16px 24px;gap:4px;flex:1`
const MNL=styled.button<{$a?:boolean}>`background:none;border:none;color:${p=>p.$a?C.gold:C.white};font-family:${C.fB};font-size:16px;font-weight:500;padding:14px 0;text-align:left;border-bottom:1px solid rgba(255,255,255,.06);width:100%;transition:.2s;&:hover{color:${C.gold}};&:last-of-type{border:none}`

/* ── Hero ── */
const Hero=styled.section`position:relative;height:100vh;min-height:600px;background:linear-gradient(to right,rgba(0,0,0,.72) 0%,rgba(0,0,0,.45) 60%,rgba(0,0,0,.3) 100%),url('/hero_bg.png') center/cover no-repeat;display:flex;align-items:flex-end;padding:0 6% 80px`
const HeroContent=styled.div`max-width:600px`
const HeroLabel=styled.p`color:${C.gold};font-size:11px;letter-spacing:4px;text-transform:uppercase;margin-bottom:16px`
const HeroTitle=styled.h1`font-family:${C.fS};font-size:clamp(48px,7vw,86px);color:${C.white};line-height:1.05;margin-bottom:14px`
const HeroSub=styled.p`color:rgba(255,255,255,.7);font-size:15px;margin-bottom:28px`


/* ── Story Section (3-col) ── */
const StoryWrap=styled.div`display:grid;grid-template-columns:1fr 1.3fr 1fr;min-height:340px;@media(max-width:768px){grid-template-columns:1fr}`
const StoryLeft=styled.div`background:${C.dark2};padding:48px 40px;display:flex;flex-direction:column;justify-content:center;`
const StoryMid=styled.div`background:${C.beige};padding:48px 40px;text-align:center;display:flex;flex-direction:column;justify-content:center`
const StoryRight=styled.div`background:${C.dark};padding:48px 40px;color:${C.white}`
const Discount=styled.p`font-family:${C.fS};font-size:52px;color:${C.gold};line-height:1`
const DiscountSub=styled.p`font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:12px`
const Phone=styled.p`font-size:22px;font-weight:700;color:${C.white};margin:8px 0 24px`
const StoryHead=styled.h2`font-family:${C.fS};font-size:32px;margin-bottom:6px`
const StoryText=styled.p`font-size:14px;color:#555;line-height:1.8`
const HoursHead=styled.h3`font-family:${C.fO};font-size:16px;letter-spacing:3px;text-transform:uppercase;color:${C.white};margin-bottom:20px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.15)`
const HoursRow=styled.div<{$closed?:boolean}>`display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:13px;color:${p=>p.$closed?C.gold:'rgba(255,255,255,.7)'}`

/* ── Services Classic ── */
const ClassicWrap=styled.section`background:${C.dark};padding:70px 5% 60px`
const ClassicHead=styled.h2`font-family:${C.fS};font-style:italic;font-size:clamp(32px,4vw,52px);color:${C.white};margin-bottom:40px`
const ClassicGrid=styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:2px;@media(max-width:900px){grid-template-columns:repeat(2,1fr)}@media(max-width:500px){grid-template-columns:1fr}`
const ClassicCard=styled.div`background:#111`
const ClassicImg=styled.img`width:100%;height:220px;object-fit:cover;object-position:top`
const ClassicBody=styled.div`padding:20px`
const ClassicName=styled.h3`font-family:${C.fO};font-size:15px;font-weight:600;text-transform:uppercase;color:${C.white};margin-bottom:12px`
const ClassicList=styled.ul`list-style:none;margin-bottom:16px`
const ClassicItem=styled.li`font-size:12px;color:rgba(255,255,255,.55);padding:3px 0;&::before{content:'• ';color:${C.gold}}`


/* ── Service Menu Accordion ── */
const MenuWrap=styled.section`display:grid;grid-template-columns:1fr 1fr;@media(max-width:768px){grid-template-columns:1fr}`
const MenuPhoto=styled.div`background:url('/gallery_haircut.png') center/cover no-repeat;min-height:480px`
const MenuRight=styled.div`background:${C.cream};padding:60px 48px;@media(max-width:768px){padding:40px 24px}`
const MenuHead=styled.h2`font-family:${C.fS};font-size:clamp(24px,3vw,38px);margin-bottom:32px`
const AccItem=styled.div`border-bottom:1px solid ${C.border}`
const AccBtn=styled.button<{$open:boolean}>`width:100%;text-align:left;background:none;border:none;padding:16px 0;display:flex;justify-content:space-between;align-items:center;font-family:${C.fS};font-size:17px;color:${C.text};transition:.2s;&:hover{color:${C.gold}};span{color:${p=>p.$open?C.gold:C.muted};font-size:18px}`
const AccBody=styled.div<{$open:boolean}>`
  overflow:hidden;
  max-height:${p=>p.$open?'400px':'0'};
  opacity:${p=>p.$open?1:0};
  transition:max-height .45s cubic-bezier(.4,0,.2,1),opacity .3s ease,padding .35s ease;
  padding-bottom:${p=>p.$open?'16px':'0'}`
const AccPriceList=styled.ul`list-style:none;padding:0`
const AccPriceItem=styled.li`display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid ${C.border};font-size:13px;&:last-child{border:none}`
const AccItemName=styled.span`color:#444`
const AccItemPrice=styled.span`font-family:${C.fO};font-weight:600;color:${C.gold};font-size:13px`

/* ── Barbers ── */
const BarberWrap=styled.section`background:${C.beige};padding:70px 5%`
const BarberGrid=styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,300px));justify-content:center;gap:20px;margin-top:36px`
const BarberCard=styled.div`position:relative;overflow:hidden;`
const BarberImg=styled.img`width:100%;height:400px;object-fit:cover;object-position:top`
const BarberInfo=styled.div`background:rgba(26,26,24,.9);padding:18px 16px;text-align:center`
const BarberSocial=styled.div`position:absolute;top:12px;left:0;display:flex;flex-direction:column;gap:0`
const BSocBtn=styled.a`background:${C.gold};color:${C.white};width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:12px;text-decoration:none;transition:.2s;&:hover{background:#b09558}`
const BarberName=styled.p`font-family:${C.fO};font-size:15px;font-weight:600;text-transform:uppercase;color:${C.white};letter-spacing:1px`
const BarberRole=styled.p`font-size:11px;color:${C.gold};letter-spacing:2px;text-transform:uppercase;margin-top:4px`




/* ── How It Works ── */
const HowWrap=styled.section`background:${C.cream};padding:70px 5%;position:relative`
const HowTabs=styled.div`display:flex;justify-content:center;gap:0;margin-bottom:48px`
const HowTab=styled.button<{$a?:boolean}>`background:${p=>p.$a?C.dark:C.white};color:${p=>p.$a?C.white:C.muted};border:2px solid ${p=>p.$a?C.dark:C.border};font-family:${C.fO};font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:10px 28px;transition:.25s;&:hover{background:${C.dark};color:${C.white};border-color:${C.dark}}&:first-child{border-right:none}&:last-child{border-left:none}`
const HowDesktop=styled.div`display:flex;align-items:flex-start;justify-content:center;position:relative;padding:20px 0;@media(max-width:768px){display:none}`
const HowMobile=styled.div`display:none;@media(max-width:768px){display:flex;flex-direction:column;gap:0;padding:0 8px}`
const HowLine=styled.div`position:absolute;top:38px;left:10%;right:10%;height:2px;background:${C.border};z-index:0`
const HowStep=styled.div`flex:1;display:flex;flex-direction:column;align-items:center;gap:10px;position:relative;z-index:1;padding:0 8px;max-width:160px`
const HowNum=styled.div<{$last?:boolean}>`width:52px;height:52px;border-radius:50%;background:${p=>p.$last?C.gold:C.dark};display:flex;align-items:center;justify-content:center;font-family:${C.fO};font-size:18px;font-weight:700;color:${C.white};flex-shrink:0;box-shadow:0 4px 12px rgba(0,0,0,.18)`
const HowIcon=styled.div`width:44px;height:44px;background:${C.beige};border:2px solid ${C.border};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;margin-top:4px`
const HowLabel=styled.p`font-family:${C.fO};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:${C.text};text-align:center;line-height:1.4`
const HowSub=styled.p`font-size:10px;color:${C.muted};text-align:center;line-height:1.5;margin-top:2px`
/* mobile step */
const MStep=styled.div`display:flex;gap:16px;align-items:flex-start;position:relative;padding-bottom:32px;&:last-child{padding-bottom:0}&:not(:last-child)::before{content:'';position:absolute;left:22px;top:52px;bottom:0;width:2px;background:${C.border};z-index:0}`
const MStepNum=styled.div<{$last?:boolean}>`width:44px;height:44px;border-radius:50%;background:${p=>p.$last?C.gold:C.dark};display:flex;align-items:center;justify-content:center;font-family:${C.fO};font-size:16px;font-weight:700;color:${C.white};flex-shrink:0;position:relative;z-index:1`
const MStepBody=styled.div`padding-top:8px`
const MStepLabel=styled.p`font-family:${C.fO};font-size:13px;text-transform:uppercase;letter-spacing:1px;color:${C.text};font-weight:600`
const MStepSub=styled.p`font-size:12px;color:${C.muted};line-height:1.6;margin-top:3px`
const SubNote=styled.div`background:rgba(200,169,110,.1);border-left:3px solid ${C.gold};padding:8px 14px;margin-top:6px;font-size:11px;color:${C.text};border-radius:0 4px 4px 0`

/* ── Seat Picker ── */
const SeatWrap=styled.div`margin-top:8px`
const SeatLegend=styled.div`display:flex;flex-wrap:wrap;gap:14px;margin-bottom:16px;justify-content:center`
const LegItem=styled.div`display:flex;align-items:center;gap:6px;font-size:11px;color:${C.muted}`
const LegDot=styled.div<{$c:string}>`width:16px;height:16px;border-radius:3px;background:${p=>p.$c};border:1px solid ${C.border};flex-shrink:0`
const CapTabRow=styled.div`display:flex;gap:0;margin-bottom:20px;border:2px solid ${C.border};overflow:hidden`
const CapTab=styled.button<{$a?:boolean}>`flex:1;background:${p=>p.$a?C.dark:C.white};color:${p=>p.$a?C.white:C.muted};border:none;padding:12px 8px;font-family:${C.fO};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;transition:.2s;&:hover{background:${C.dark};color:${C.white}}`
const SeatGrid=styled.div`display:grid;grid-template-columns:repeat(5,1fr);gap:6px`
const Seat=styled.button<{$state:'available'|'offline'|'online'|'selected'}>`
  aspect-ratio:1;border-radius:4px;border:2px solid;
  font-family:${C.fO};font-size:10px;font-weight:700;letter-spacing:.5px;
  display:flex;align-items:center;justify-content:center;transition:.2s;cursor:${p=>p.$state==='available'||p.$state==='selected'?'pointer':'not-allowed'};
  ${p=>p.$state==='available'&&`background:#fff;border-color:${C.border};color:${C.muted};&:hover{border-color:${C.gold};color:${C.gold}}`}
  ${p=>p.$state==='offline'&&`background:#3a3530;border-color:#3a3530;color:rgba(255,255,255,.4)`}
  ${p=>p.$state==='online'&&`background:rgba(200,169,110,.2);border-color:${C.gold};color:${C.gold}`}
  ${p=>p.$state==='selected'&&`background:${C.gold};border-color:${C.gold};color:#fff`}
`
const FullBadge=styled.div`background:#3a3530;color:rgba(255,255,255,.7);text-align:center;padding:16px;font-size:13px;border-radius:4px;margin-top:8px`

/* ── Booking ── */
const BookWrap=styled.section`background:${C.beige};padding:70px 5%`
const BookPanel=styled.div`max-width:760px;margin:36px auto 0;background:${C.white};border:1px solid ${C.border}`
const BookBody=styled.div`padding:36px`
const BookTitle=styled.h3`font-family:${C.fS};font-size:22px;margin-bottom:6px`
const BookHint=styled.p`font-size:13px;color:${C.muted};margin-bottom:22px`
const StepBar=styled.div`display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:32px;position:relative;&::before{content:'';position:absolute;top:18px;left:15%;right:15%;height:1px;background:${C.border};z-index:0}`
const SStep=styled.div`flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;position:relative;z-index:1`
const SNum=styled.div<{$a?:boolean;$d?:boolean}>`width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;background:${p=>p.$d?C.gold:p.$a?C.dark:C.white};border:2px solid ${p=>p.$d||p.$a?C.gold:C.border};color:${p=>p.$d||p.$a?C.white:C.muted}`
const SLbl=styled.span<{$a?:boolean}>`font-size:9px;letter-spacing:1px;text-transform:uppercase;color:${p=>p.$a?C.gold:C.muted}`
const Radio=styled.div<{$sel?:boolean}>`border:2px solid ${p=>p.$sel?C.gold:C.border};padding:16px 20px;cursor:pointer;transition:.2s;background:${p=>p.$sel?'rgba(200,169,110,.06)':C.white};&:hover{border-color:${C.gold}}`
const RadioLabel=styled.p`font-family:${C.fS};font-size:16px`
const RadioPrice=styled.p`font-size:12px;color:${C.gold};font-weight:600;margin-top:3px`
const AddBtn=styled.button`background:none;border:1px dashed ${C.gold};color:${C.gold};font-family:${C.fB};font-size:13px;padding:10px 20px;width:100%;margin:16px 0;transition:.2s;&:hover{background:rgba(200,169,110,.08)}`
const AddPanel=styled.div<{$open:boolean}>`overflow:hidden;max-height:${p=>p.$open?'500px':'0'};transition:max-height .3s ease`
const AddGrid=styled.div`display:flex;flex-wrap:wrap;gap:8px;padding:16px 0`
const Chip=styled.button<{$sel?:boolean}>`padding:8px 14px;border:1px solid ${p=>p.$sel?C.gold:C.border};background:${p=>p.$sel?'rgba(200,169,110,.1)':C.white};color:${p=>p.$sel?C.text:C.muted};font-size:12px;transition:.2s;&:hover{border-color:${C.gold}}`
const CapGrid2=styled.div`display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;@media(max-width:480px){grid-template-columns:1fr}`
const CapCard=styled.div<{$sel?:boolean}>`border:2px solid ${p=>p.$sel?C.gold:C.border};cursor:pointer;transition:.2s;overflow:hidden;&:hover{border-color:${C.gold}}`
const CapImg=styled.img`width:100%;height:140px;object-fit:cover;object-position:top`
const CapInfo=styled.div`padding:14px;background:${p=>p.color||C.dark}`
const QInfo=styled.div`background:rgba(200,169,110,.1);border:1px solid rgba(200,169,110,.3);padding:12px;margin-top:8px;font-size:12px;color:${C.text}`
const SummBox=styled.div`background:${C.beige};border:1px solid ${C.border};padding:20px;margin-bottom:20px`
const SRow=styled.div`display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid ${C.border};font-size:13px;&:last-child{border:none;padding-top:12px;font-weight:700}`
const BookActions=styled.div`display:flex;justify-content:flex-end;gap:10px;margin-top:12px;flex-wrap:wrap`
const QrisBox=styled.div`display:flex;justify-content:center;margin-bottom:20px`
const QrisInner=styled.div`background:#fff;border:2px solid ${C.border};padding:24px;text-align:center;max-width:280px;width:100%`
const QrGrid=styled.div`display:grid;grid-template-columns:repeat(8,1fr);gap:2px;width:104px;margin:8px auto`
const QrC=styled.div<{$f?:boolean}>`width:11px;height:11px;border-radius:1px;background:${p=>p.$f?C.dark:'#eee'}`
const SuccBox=styled.div`text-align:center`
const QBox=styled.div`border:2px solid ${C.gold};display:inline-flex;flex-direction:column;align-items:center;padding:20px 48px;margin:16px 0`

/* ── Testimonials ── */
const TestiWrap=styled.section`background:${C.dark};padding:70px 5%`
const TestiGrid=styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:36px;@media(max-width:768px){grid-template-columns:1fr}`
const TCard=styled.div`background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);padding:28px`
const TQuote=styled.div`font-size:48px;line-height:.6;color:${C.gold};font-family:Georgia,serif;margin-bottom:12px`
const TText=styled.p`font-size:13px;color:rgba(255,255,255,.6);font-style:italic;line-height:1.8;margin-bottom:14px`
const TName=styled.p`font-family:${C.fO};font-size:13px;text-transform:uppercase;color:${C.white};letter-spacing:1px`
const TStars=styled.div`color:${C.gold};font-size:12px;margin-top:4px`

/* ── Footer ── */
const FootWrap=styled.footer`background:#111;padding:56px 5% 0`
const FootGrid=styled.div`display:grid;grid-template-columns:2fr 1fr 1fr;gap:36px;padding-bottom:36px;@media(max-width:700px){grid-template-columns:1fr}`
const FLogo=styled.img`height:48px;width:auto;object-fit:contain;margin-bottom:12px`
const FTag=styled.p`font-family:${C.fS};font-style:italic;color:rgba(255,255,255,.5);font-size:14px;margin-bottom:8px`
const FLabel=styled.p`font-family:${C.fO};font-size:11px;color:${C.gold};letter-spacing:2px;text-transform:uppercase;margin-bottom:14px`
const FLinks=styled.ul`list-style:none;display:flex;flex-direction:column;gap:8px`
const FLink=styled.button`background:none;border:none;color:rgba(255,255,255,.5);font-size:13px;text-align:left;padding:0;transition:.2s;&:hover{color:${C.gold}}`
const FText=styled.p`font-size:12px;color:rgba(255,255,255,.45);line-height:2`
const FDiv=styled.div`height:1px;background:rgba(255,255,255,.08)`
const FBot=styled.div`padding:18px 0;display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,.3);flex-wrap:wrap;gap:6px`

/* ── WA Button ── */
const WA=styled.a`position:fixed;bottom:28px;right:28px;z-index:998;width:52px;height:52px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,.3);transition:.2s;&:hover{transform:scale(1.08)}`

/* ── Data ── */
const MAX_QUEUE=15
const NAV=[{l:'Beranda',id:'beranda'},{l:'Tentang',id:'tentang'},{l:'Layanan',id:'layanan'},{l:'Tim',id:'tim'},{l:'Harga',id:'harga'},{l:'Tutorial',id:'tutorial'},{l:'Reservasi',id:'booking'}]
const HOURS=[['SENIN','12:00 – 21:00'],['SELASA','12:00 – 22:00'],['RABU','12:00 – 22:00'],['KAMIS','12:00 – 22:00'],['JUMAT','12:00 – 22:00'],['SABTU','12:00 – 22:00'],['MINGGU','12:00 – 22:00']]
const CLASSIC=[
  {img:'/gallery_haircut.png',name:'Haircut',items:['Senior Haircut','Junior Haircut','Fade & Taper','Line Up & Clean Up']},
  {img:'/gallery_coloring.png',name:'Coloring',items:['Basic Coloring','Highlight Bleaching','Highlight Fashion','Fashion Coloring Full']},
  {img:'/gallery_perm.png',name:'Perm & Waves',items:['Curly Perm','Wavy Perm','Design Perm','Down Perm','Root Lift']},
  {img:'/gallery_shaving.png',name:'Shaving & Extra',items:['Classic Shaving','Hair Tato','Scalp Treatment','Penataan Rambut']},
]
const MENU_ACC=[
  {title:'Haircut', items:[{n:'Senior Haircut',p:'Rp 35k'},{n:'Junior Haircut',p:'Rp 30k'}]},
  {title:'Coloring', items:[{n:'Basic Coloring',p:'Rp 70k'},{n:'Highlight Bleaching',p:'Rp 120k'},{n:'Highlight Fashion',p:'Rp 150k'},{n:'Fashion Coloring Full',p:'Rp 200k'}]},
  {title:'Perm & Waves', items:[{n:'Curly Perm',p:'Rp 200k'},{n:'Wavy Perm',p:'Rp 200k'},{n:'Design Perm',p:'Rp 300k'},{n:'Root Lift',p:'Rp 65k'},{n:'Down Perm',p:'Rp 100k'}]},
  {title:'Shaving & Extra', items:[{n:'Classic Shaving',p:'Rp 20k'},{n:'Hair Tato',p:'Rp 10k'}]},
  {title:'Reservasi Online', items:[{n:'Booking Online (Senior / Junior)',p:'Rp 50k'}]},
]
const CAPSTERS=[
  {id:1,nama:'Rizky Pratama',role:'Senior Capster',foto:'/capster1.png',qPrefix:'A',bio:'Spesialis fade & modern styling',
   offlineSlots:[1,2,3,4,5],onlineSlots:[7,9]},
  {id:2,nama:'Sari Dewi',role:'Senior Capster',foto:'/capster2.png',qPrefix:'B',bio:'Ahli coloring & creative styling',
   offlineSlots:[1,2],onlineSlots:[4]},
]
const ADDONS=[
  {name:'Basic Coloring',price:70000},{name:'Highlight Bleaching',price:120000},
  {name:'Highlight Fashion',price:150000},{name:'Fashion Coloring Full',price:200000},
  {name:'Curly Perm',price:200000},{name:'Wavy Perm',price:200000},
  {name:'Design Perm',price:300000},{name:'Root Lift',price:65000},
  {name:'Down Perm',price:100000},{name:'Hair Tato',price:10000},{name:'Classic Shaving',price:20000},
]

const TESTI=[
  {t:'Hasilnya keren banget, kapster ramah dan profesional!',n:'Budi S.',r:5},
  {t:'Tempatnya bersih, nyaman, worth it banget. Sudah jadi langganan!',n:'Andi P.',r:5},
  {t:'Satu-satunya barbershop yang bisa bikin gue puas total.',n:'Fajar R.',r:5},
]
const QR_SEED=Array.from({length:64},(_,i)=>(i*7+i%3)%2===0)
const RESERVASI_FEE=50000

function getSeatStep(
  CAPSTERS:any[],MAX_QUEUE:number,activeCap:number,setActiveCap:(i:number)=>void,
  capster:any,setCapster:(c:any)=>void,selectedSeat:number|null,setSelectedSeat:(n:number|null)=>void,
  onBack:()=>void,onNext:()=>void,C:any
){
  const cur=CAPSTERS[activeCap]
  const isFull=(cur.offlineSlots.length+cur.onlineSlots.length)>=MAX_QUEUE
  return(
    <>
      <BookTitle>Pilih Capster &amp; Nomor Antrian</BookTitle>
      <BookHint>Pilih kapster lalu klik slot antrian yang tersedia. Abu gelap = offline, emas = online, putih = tersedia.</BookHint>
      <CapTabRow>
        {CAPSTERS.map((c:any,i:number)=>(
          <CapTab key={c.id} $a={activeCap===i} onClick={()=>{setActiveCap(i);setCapster(null);setSelectedSeat(null)}}>
            {c.qPrefix} — {c.nama}
            <span style={{display:'block',fontSize:'9px',marginTop:'2px',opacity:.7}}>{c.offlineSlots.length+c.onlineSlots.length}/{MAX_QUEUE} terisi</span>
          </CapTab>
        ))}
      </CapTabRow>
      <SeatLegend>
        <LegItem><LegDot $c="#3a3530"/>Offline (walk-in)</LegItem>
        <LegItem><LegDot $c="rgba(200,169,110,.3)" style={{borderColor:C.gold}}/>Online (booked)</LegItem>
        <LegItem><LegDot $c="#fff"/>Tersedia</LegItem>
        <LegItem><LegDot $c={C.gold}/>Pilihan Anda</LegItem>
      </SeatLegend>
      <SeatWrap>
        {isFull
          ? <FullBadge>😔 Antrian {cur.qPrefix} sudah penuh hari ini ({MAX_QUEUE}/{MAX_QUEUE}). Silakan pilih kapster lain atau datang lagi besok.</FullBadge>
          : <SeatGrid>
              {Array.from({length:MAX_QUEUE},(_,i)=>{
                const num=i+1
                const isOff=cur.offlineSlots.includes(num)
                const isOn=cur.onlineSlots.includes(num)
                const isSel=selectedSeat===num&&capster?.id===cur.id
                const st:any=isSel?'selected':isOff?'offline':isOn?'online':'available'
                return(
                  <Seat key={num} $state={st}
                    onClick={()=>{if(isOff||isOn)return;setCapster(cur);setSelectedSeat(num)}}
                    title={isOff?`${cur.qPrefix}${num} — Antrian Offline`:isOn?`${cur.qPrefix}${num} — Sudah Dibooking Online`:`${cur.qPrefix}${num} — Tersedia`}
                  >{cur.qPrefix}{num}</Seat>
                )
              })}
            </SeatGrid>
        }
      </SeatWrap>
      {selectedSeat&&capster&&(
        <div style={{marginTop:'12px',padding:'10px 14px',background:'rgba(200,169,110,.1)',border:`1px solid ${C.gold}`,fontSize:'13px'}}>
          ✅ Nomor antrian Anda: <strong style={{color:C.gold,fontFamily:C.fO,fontSize:'16px'}}>{capster.qPrefix}{selectedSeat}</strong> — {capster.nama}
        </div>
      )}
      <BookActions>
        <BtnOutline onClick={onBack}>← KEMBALI</BtnOutline>
        <BtnGold disabled={!capster||selectedSeat===null} onClick={onNext}>LANJUT →</BtnGold>
      </BookActions>
    </>
  )
}

export function LandingPage(){
  useFont()
  const [scrolled,setScrolled]=useState(false)
  const [menu,setMenu]=useState(false)
  const [active,setActive]=useState('beranda')
  const [acc,setAcc]=useState<number|null>(null)
  // booking
  const [step,setStep]=useState(1)
  const [haircut,setHaircut]=useState<'senior'|'junior'|null>(null)
  const [addOpen,setAddOpen]=useState(false)
  const [addons,setAddons]=useState<string[]>([])
  const [capster,setCapster]=useState<typeof CAPSTERS[0]|null>(null)
  const [queue,setQueue]=useState<string|null>(null)
  const [howTab,setHowTab]=useState<'online'|'offline'>('online')
  const [activeCap,setActiveCap]=useState<number>(0)
  const [selectedSeat,setSelectedSeat]=useState<number|null>(null)


  useEffect(()=>{const h=()=>setScrolled(window.scrollY>60);window.addEventListener('scroll',h);return()=>window.removeEventListener('scroll',h)},[])

  const go=(id:string)=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenu(false);setActive(id)}

  const addonPrice=addons.reduce((a,n)=>a+(ADDONS.find(x=>x.name===n)?.price||0),0)
  const total=RESERVASI_FEE+addonPrice

  const toggleAddon=(n:string)=>setAddons(p=>p.includes(n)?p.filter(x=>x!==n):[...p,n])

  const doBook=()=>{
    if(!capster||selectedSeat===null)return
    setQueue(`${capster.qPrefix}${selectedSeat}`)
    setStep(4)
  }
  const reset=()=>{setStep(1);setHaircut(null);setAddons([]);setCapster(null);setQueue(null);setAddOpen(false);setSelectedSeat(null);setActiveCap(0)}

  const STEPS=['Layanan','Capster','Bayar','Selesai']

  return(
    <>
      <GS/>

      {/* Navbar */}
      <NavWrap $s={scrolled}>
        <NavLogo src="/logopointcut.png" alt="Point Cut" onClick={()=>go('beranda')} style={{cursor:'pointer'}}/>
        <NavLinks>
          {NAV.map(n=><li key={n.id}><NL $a={active===n.id} onClick={()=>go(n.id)}>{n.l}</NL></li>)}
        </NavLinks>
        <NavCta><BtnGold onClick={()=>go('booking')} style={{display:'block'}}>RESERVASI</BtnGold></NavCta>
        <MBtn onClick={()=>setMenu(o=>!o)}>☰</MBtn>
      </NavWrap>

      {/* Mobile Drawer */}
      <MOverlay $o={menu} onClick={()=>setMenu(false)}/>
      <MMenu $o={menu}>
        <MMenuHead>
          <NavLogo src="/logopointcut.png" alt="Point Cut" style={{height:'36px'}}/>
          <MClose onClick={()=>setMenu(false)}>×</MClose>
        </MMenuHead>
        <MMenuBody>
          {NAV.map(n=>(
            <MNL key={n.id} $a={active===n.id} onClick={()=>go(n.id)}>{n.l}</MNL>
          ))}
          <div style={{marginTop:'20px'}}>
            <BtnGold style={{width:'100%'}} onClick={()=>go('booking')}>RESERVASI SEKARANG</BtnGold>
          </div>
        </MMenuBody>
      </MMenu>

      {/* Hero */}
      <Hero id="beranda">
        <HeroContent>
          <HeroLabel>✦ STUDIO POINTCUT ✦</HeroLabel>
          <HeroTitle>We Know<br/>Your Style<br/>Better</HeroTitle>
          <HeroSub>Pengalaman grooming premium dengan kapster profesional berpengalaman</HeroSub>
          <BtnOutline $light onClick={()=>go('booking')}>Buat Reservasi →</BtnOutline>
        </HeroContent>
      </Hero>

      {/* Story 3-col */}
      <div id="tentang">
        <StoryWrap>
          <StoryLeft>
            <Discount>20%</Discount>
            <DiscountSub>OFF on your first appointment!</DiscountSub>
            <Phone>+62 812-3456-7890</Phone>
            <BtnGold onClick={()=>go('booking')}>BUAT RESERVASI</BtnGold>
          </StoryLeft>
          <StoryMid>
            <SecLabel>Our Story</SecLabel>
            <Mustache>✂</Mustache>
            <StoryHead>Studio Pointcut</StoryHead>
            <StoryText style={{marginTop:'12px'}}>Studio Pointcut lahir dari passion mendalam terhadap seni grooming pria. Kami percaya setiap potongan adalah cerminan karakter dan kepercayaan diri. Dengan kapster berpengalaman dan suasana yang nyaman, kami hadir memberikan pengalaman terbaik.</StoryText>
          </StoryMid>
          <StoryRight>
            <HoursHead>JAM BUKA</HoursHead>
            {HOURS.map(([day,h])=><HoursRow key={day} $closed={h==='TUTUP'}><span>{day}</span><span>{h}</span></HoursRow>)}
          </StoryRight>
        </StoryWrap>
      </div>

      {/* Classic Services */}
      <ClassicWrap id="layanan">
        <ClassicHead>Classic cuts, modern feel</ClassicHead>
        <ClassicGrid>
          {CLASSIC.map(c=>(
            <ClassicCard key={c.name}>
              <ClassicImg src={c.img} alt={c.name}/>
              <ClassicBody>
                <ClassicName>{c.name}</ClassicName>
                <ClassicList>{c.items.map(i=><ClassicItem key={i}>{i}</ClassicItem>)}</ClassicList>
              </ClassicBody>
            </ClassicCard>
          ))}
        </ClassicGrid>
      </ClassicWrap>

      {/* Service Menu Accordion */}
      <MenuWrap>
        <MenuPhoto/>
        <MenuRight>
          <MenuHead>Our Full Service Menu</MenuHead>
          {MENU_ACC.map((m,i)=>(
            <AccItem key={m.title}>
              <AccBtn $open={acc===i} onClick={()=>setAcc(acc===i?null:i)}>
                {m.title}<span>{acc===i?'−':'+'}</span>
              </AccBtn>
              <AccBody $open={acc===i}>
                <AccPriceList>
                  {m.items.map(item=>(
                    <AccPriceItem key={item.n}>
                      <AccItemName>{item.n}</AccItemName>
                      <AccItemPrice>{item.p}</AccItemPrice>
                    </AccPriceItem>
                  ))}
                </AccPriceList>
              </AccBody>
            </AccItem>
          ))}
        </MenuRight>
      </MenuWrap>

      {/* Barbers */}
      <BarberWrap id="tim">
        <SecLabel>Our Team</SecLabel>
        <Mustache>✂</Mustache>
        <h2 style={{fontFamily:C.fS,fontSize:'clamp(28px,4vw,42px)',textAlign:'center'}}>OUR BARBERS</h2>
        <p style={{textAlign:'center',color:C.muted,fontSize:'13px',marginTop:'8px'}}>Kapster profesional kami siap memberikan tampilan terbaik Anda</p>
        <BarberGrid>
          {CAPSTERS.map(c=>(
            <BarberCard key={c.id}>
              <BarberImg src={c.foto} alt={c.nama}/>
              <BarberSocial>
                <BSocBtn href="https://wa.me/6281234567890" target="_blank" title="WhatsApp">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </BSocBtn>
                <BSocBtn href="https://instagram.com/pointcut.studio" target="_blank" title="Instagram">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </BSocBtn>
              </BarberSocial>
              <BarberInfo>
                <BarberName>{c.nama}</BarberName>
                <BarberRole>— {c.role} —</BarberRole>
              </BarberInfo>
            </BarberCard>
          ))}
        </BarberGrid>
      </BarberWrap>

      {/* How It Works Tutorial */}
      <HowWrap id="tutorial">
        <SecLabel>Cara Reservasi</SecLabel>
        <Mustache>✂</Mustache>
        <h2 style={{fontFamily:C.fS,fontSize:'clamp(26px,4vw,40px)',textAlign:'center',marginBottom:'8px'}}>Proses Mudah &amp; Transparan</h2>
        <p style={{textAlign:'center',color:C.muted,fontSize:'14px',marginBottom:'36px'}}>Pilih cara reservasi yang paling nyaman untuk Anda</p>
        <HowTabs>
          <HowTab $a={howTab==='online'} onClick={()=>setHowTab('online')}>🌐 Online</HowTab>
          <HowTab $a={howTab==='offline'} onClick={()=>setHowTab('offline')}>🏪 Offline (Walk-in)</HowTab>
        </HowTabs>

        {howTab==='online'&&(<>
          {/* Desktop horizontal */}
          <HowDesktop>
            <HowLine/>
            {[
              {n:1,icon:'✂',label:'Pilih Layanan',sub:'Senior / Junior + tambahan'},
              {n:2,icon:'👀',label:'Lihat Antrian',sub:'Seat tersedia kapster'},
              {n:3,icon:'🎟',label:'Pilih Nomor',sub:'Klik slot yang kosong'},
              {n:4,icon:'💳',label:'Bayar QRIS',sub:'Rp 50.000 reservasi'},
              {n:5,icon:'🎉',label:'Nomor Antrian',sub:'Datang sesuai giliran',last:true},
            ].map(s=>(
              <HowStep key={s.n}>
                <HowNum $last={s.last}>{s.n}</HowNum>
                <HowIcon>{s.icon}</HowIcon>
                <HowLabel>{s.label}</HowLabel>
                <HowSub>{s.sub}</HowSub>
              </HowStep>
            ))}
          </HowDesktop>
          {/* Mobile vertical */}
          <HowMobile>
            {[
              {n:1,icon:'✂',label:'Pilih Layanan',sub:'Pilih Senior atau Junior Capster, tambah layanan optional'},
              {n:2,icon:'👀',label:'Lihat Antrian Kapster',sub:'Lihat slot antrian real-time tiap kapster'},
              {n:3,icon:'🎟',label:'Pilih Nomor Antrian',sub:'Klik slot kosong yang tersedia — tidak akan bertabrakan dengan antrian offline'},
              {n:4,icon:'💳',label:'Pembayaran QRIS',sub:'Bayar Rp 50.000 sebagai biaya reservasi via QRIS'},
              {n:5,icon:'🎉',label:'Nomor Antrian Diterima',sub:'Datang ke studio sesuai nomor antrian Anda',last:true},
            ].map(s=>(
              <MStep key={s.n}>
                <MStepNum $last={(s as any).last}>{s.n}</MStepNum>
                <MStepBody>
                  <MStepLabel>{s.icon} {s.label}</MStepLabel>
                  <MStepSub>{s.sub}</MStepSub>
                </MStepBody>
              </MStep>
            ))}
          </HowMobile>
          <SubNote style={{maxWidth:'600px',margin:'20px auto 0'}}>💡 <strong>Batas antrian:</strong> Maks. 15 customer/kapster/hari. Nomor online tidak akan bertabrakan dengan antrian offline — sistem seat picker otomatis memisahkan keduanya.</SubNote>
        </>)}

        {howTab==='offline'&&(<>
          <HowDesktop>
            <HowLine/>
            {[
              {n:1,icon:'🚶',label:'Datang ke Studio',sub:'Walk-in langsung'},
              {n:2,icon:'💬',label:'Pesan ke Kapster',sub:'Pilih kapster favorit'},
              {n:3,icon:'📋',label:'Input Pemesanan',sub:'Kapster input layanan & harga'},
              {n:4,icon:'🎟',label:'Nomor Antrian',sub:'Dapat nomor urut offline'},
              {n:5,icon:'💈',label:'Cukur',sub:'Antri & nikmati layanan'},
              {n:6,icon:'💳',label:'Payment',sub:'Bayar di kasir',last:true},
            ].map(s=>(
              <HowStep key={s.n}>
                <HowNum $last={s.last}>{s.n}</HowNum>
                <HowIcon>{s.icon}</HowIcon>
                <HowLabel>{s.label}</HowLabel>
                <HowSub>{s.sub}</HowSub>
              </HowStep>
            ))}
          </HowDesktop>
          <HowMobile>
            {[
              {n:1,icon:'🚶',label:'Datang ke Studio',sub:'Walk-in langsung tanpa perlu booking online'},
              {n:2,icon:'💬',label:'Pesan ke Kapster',sub:'Pilih kapster dan sampaikan layanan yang diinginkan'},
              {n:3,icon:'📋',label:'Kapster Input Pemesanan',sub:'Kapster akan menginput layanan & harga untuk Anda'},
              {n:4,icon:'🎟',label:'Nomor Antrian',sub:'Sistem akan otomatis assign nomor antrian offline (A1, A2, dst)'},
              {n:5,icon:'💈',label:'Cukur',sub:'Tunggu giliran dan nikmati layanan premium'},
              {n:6,icon:'💳',label:'Payment',sub:'Bayar di kasir setelah selesai',last:true},
            ].map(s=>(
              <MStep key={s.n}>
                <MStepNum $last={(s as any).last}>{s.n}</MStepNum>
                <MStepBody>
                  <MStepLabel>{s.icon} {s.label}</MStepLabel>
                  <MStepSub>{s.sub}</MStepSub>
                </MStepBody>
              </MStep>
            ))}
          </HowMobile>
          <SubNote style={{maxWidth:'600px',margin:'20px auto 0'}}>💡 <strong>Offline:</strong> Nomor antrian offline akan otomatis terintegrasi dengan sistem. Customer online tidak bisa ambil nomor yang sudah Anda pakai.</SubNote>
        </>)}

        <div style={{textAlign:'center',marginTop:'40px'}}>
          <BtnGold onClick={()=>go('booking')}>MULAI RESERVASI ONLINE →</BtnGold>
        </div>
      </HowWrap>

      {/* Booking */}
      <BookWrap id="booking">
        <SecLabel>Online Booking</SecLabel>
        <Mustache>✂</Mustache>
        <h2 style={{fontFamily:C.fS,fontSize:'clamp(26px,4vw,40px)',textAlign:'center'}}>BUAT RESERVASI</h2>
        {step<4&&(
          <StepBar style={{marginTop:'28px'}}>
            {STEPS.slice(0,3).map((l,i)=>(
              <SStep key={l}><SNum $a={step===i+1} $d={step>i+1}>{step>i+1?'✓':i+1}</SNum><SLbl $a={step===i+1}>{l}</SLbl></SStep>
            ))}
          </StepBar>
        )}
        <BookPanel>
          <BookBody>
            {/* Step 1: Pilih Haircut */}
            {step===1&&(
              <>
                <BookTitle>Pilih Haircut</BookTitle>
                <BookHint>Biaya reservasi online: Rp 50.000 (berlaku untuk Senior maupun Junior)</BookHint>
                <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'4px'}}>
                  <Radio $sel={haircut==='senior'} onClick={()=>setHaircut('senior')}>
                    <RadioLabel>Senior Capster</RadioLabel>
                    <RadioPrice>Reservasi: Rp 50.000 · Haircut: Rp 35.000 (bayar di tempat)</RadioPrice>
                  </Radio>
                  <Radio $sel={haircut==='junior'} onClick={()=>setHaircut('junior')}>
                    <RadioLabel>Junior Capster</RadioLabel>
                    <RadioPrice>Reservasi: Rp 50.000 · Haircut: Rp 30.000 (bayar di tempat)</RadioPrice>
                  </Radio>
                </div>
                <AddBtn onClick={()=>setAddOpen(o=>!o)}>
                  {addOpen?'− Tutup Layanan Tambahan':'+ Tambah Layanan (Coloring, Perm, dll)'}
                </AddBtn>
                <AddPanel $open={addOpen}>
                  <p style={{fontSize:'12px',color:C.muted,marginBottom:'4px'}}>Pilih layanan tambahan (opsional):</p>
                  <AddGrid>
                    {ADDONS.map(a=>(
                      <Chip key={a.name} $sel={addons.includes(a.name)} onClick={()=>toggleAddon(a.name)}>
                        {a.name} +{(a.price/1000).toFixed(0)}k
                      </Chip>
                    ))}
                  </AddGrid>
                </AddPanel>
                <BookActions>
                  <BtnGold disabled={!haircut} onClick={()=>setStep(2)}>LANJUT →</BtnGold>
                </BookActions>
              </>
            )}

            {/* Step 2: Pilih Capster & Seat */}
            {step===2&&getSeatStep(CAPSTERS,MAX_QUEUE,activeCap,setActiveCap,capster,setCapster,selectedSeat,setSelectedSeat,()=>setStep(1),()=>setStep(3),C)}




            {/* Step 3: Payment */}
            {step===3&&(
              <>
                <BookTitle>Pembayaran QRIS</BookTitle>
                <BookHint>Scan QR code berikut untuk menyelesaikan pembayaran.</BookHint>
                <SummBox style={{marginBottom:'16px'}}>
                  <SRow><span>Capster</span><span style={{fontWeight:600}}>{capster?.nama}</span></SRow>
                  <SRow><span>Antrian Anda</span><span style={{color:C.gold,fontWeight:700}}>{capster&&`${capster.qPrefix}${selectedSeat}`}</span></SRow>
                  {addons.length>0&&addons.map(a=><SRow key={a}><span>{a}</span><span style={{color:C.gold}}>+{(ADDONS.find(x=>x.name===a)?.price||0)/1000}k</span></SRow>)}
                  <SRow><span style={{fontWeight:700}}>Total Reservasi</span><span style={{color:C.gold,fontFamily:C.fO,fontSize:'18px'}}>Rp {total.toLocaleString('id-ID')}</span></SRow>
                </SummBox>
                <QrisBox>
                  <QrisInner>
                    <img src="/logopointcut.png" alt="logo" style={{height:'32px',width:'auto',objectFit:'contain',margin:'0 auto 8px'}}/>
                    <p style={{fontWeight:700,fontSize:'13px',marginBottom:'4px'}}>Studio Pointcut</p>
                    <p style={{color:C.gold,fontWeight:700,fontSize:'16px',marginBottom:'10px'}}>Rp {total.toLocaleString('id-ID')}</p>
                    <QrGrid>{QR_SEED.map((f,i)=><QrC key={i} $f={f}/>)}</QrGrid>
                    <p style={{fontSize:'10px',color:'#999',marginTop:'8px'}}>Scan via mobile banking / e-wallet</p>
                  </QrisInner>
                </QrisBox>
                <BookActions>
                  <BtnOutline onClick={()=>setStep(2)}>← KEMBALI</BtnOutline>
                  <BtnGold onClick={doBook}>KONFIRMASI PEMBAYARAN ✓</BtnGold>
                </BookActions>
              </>
            )}

            {/* Step 4: Success */}
            {step===4&&queue&&(
              <SuccBox>
                <div style={{width:'60px',height:'60px',borderRadius:'50%',background:C.gold,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',color:'#fff',margin:'0 auto 16px'}}>✓</div>
                <BookTitle style={{marginBottom:'6px'}}>Booking Berhasil!</BookTitle>
                <BookHint>Pembayaran dikonfirmasi. Silakan datang sesuai antrian.</BookHint>
                <QBox>
                  <span style={{fontSize:'10px',letterSpacing:'3px',textTransform:'uppercase',color:C.gold}}>NOMOR ANTRIAN</span>
                  <span style={{fontFamily:C.fS,fontSize:'56px',fontWeight:700,color:C.dark}}>{queue}</span>
                </QBox>
                <SummBox style={{textAlign:'left',maxWidth:'360px',margin:'0 auto 20px'}}>
                  <SRow><span>Capster</span><span>{capster?.nama}</span></SRow>
                  <SRow><span>Haircut</span><span style={{textTransform:'capitalize'}}>{haircut}</span></SRow>
                  {addons.length>0&&<SRow><span>Tambahan</span><span>{addons.join(', ')}</span></SRow>}
                  <SRow><span>Bayar</span><span style={{color:C.gold}}>Rp {total.toLocaleString('id-ID')}</span></SRow>
                </SummBox>
                <p style={{fontSize:'12px',color:C.muted,marginBottom:'20px'}}>💡 Antrian offline di depan Anda: <strong>{capster&&(capster.offlineSlots.filter(n=>n<(selectedSeat??0)).length)} orang</strong></p>
                <BtnGold onClick={reset}>BUAT BOOKING BARU</BtnGold>
              </SuccBox>
            )}
          </BookBody>
        </BookPanel>
      </BookWrap>

      {/* Testimonials */}
      <TestiWrap>
        <SecLabel style={{color:C.gold}}>Testimoni</SecLabel>
        <h2 style={{fontFamily:C.fS,fontSize:'clamp(26px,4vw,38px)',color:C.white,textAlign:'center',marginBottom:'0'}}>APA KATA MEREKA</h2>
        <TestiGrid>
          {TESTI.map((t,i)=>(
            <TCard key={i}>
              <TQuote>"</TQuote>
              <TText>{t.t}</TText>
              <TName>{t.n}</TName>
              <TStars>{'★'.repeat(t.r)}</TStars>
            </TCard>
          ))}
        </TestiGrid>
      </TestiWrap>

      {/* Footer */}
      <FootWrap id="kontak">
        <FootGrid>
          <div>
            <FLogo src="/logopointcut.png" alt="Point Cut"/>
            <FTag>Stay Sharp, Look Fresh</FTag>
            <FText>Studio grooming premium di kota Anda.<br/>Kami hadir untuk tampilan terbaik Anda setiap hari.</FText>
          </div>
          <div>
            <FLabel>Navigasi</FLabel>
            <FLinks>{NAV.map(n=><li key={n.id}><FLink onClick={()=>go(n.id)}>{n.l}</FLink></li>)}</FLinks>
          </div>
          <div>
            <FLabel>Hubungi Kami</FLabel>
            <FText>📍 Jl. Studio Pointcut No. 1<br/>📞 +62 812-3456-7890<br/>📧 hello@studiopointcut.com<br/>📸 @pointcut.studio</FText>
          </div>
        </FootGrid>
        <FDiv/>
        <FBot><span>© 2026 Studio Pointcut. All rights reserved.</span><span>Made with ♥ in Indonesia</span></FBot>
      </FootWrap>

      {/* WA Float */}
      <WA href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </WA>
    </>
  )
}
