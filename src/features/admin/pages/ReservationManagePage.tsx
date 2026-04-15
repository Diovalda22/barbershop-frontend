import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { Storage, currentUser } from '@/services/storage';
import { Plus, X, Search, Calendar, CheckCircle2 } from 'lucide-react';

const C = {
  primary: '#0F172A',
  accent: '#C0392B',
  blue: '#3B82F6',
  bg: '#F8FAFC',
  border: '#E2E8F0',
  text: '#1E293B',
  textMuted: '#64748B',
  success: '#10B981',
  successBg: '#ECFDF5',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  danger: '#EF4444',
  dangerBg: '#FEF2F2'
};

const TIME_SLOTS = [
  "13:30", "14:00", "14:30", "15:00", "15:30", 
  "16:00", "16:30", "17:00", "17:30", 
  "18:45", "19:15", "19:45", "20:15", "20:45"
];

const TitleSection = styled.div`
  margin-bottom: 32px;
  h1 { font-size: 26px; font-weight: 800; color: ${C.primary}; margin-bottom: 6px; letter-spacing: -0.5px; }
  p { font-size: 14px; color: ${C.textMuted}; font-weight: 500; }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
  @media(max-width: 1024px){ grid-template-columns: repeat(2, 1fr); }
  @media(max-width: 480px){ grid-template-columns: 1fr; }
`;

const StatCard = styled.div<{ $color: string, $bg: string }>`
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${C.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  gap: 12px;

  .header { font-size: 13px; font-weight: 700; color: ${C.textMuted}; text-transform: uppercase; letter-spacing: 0.5px; }
  .value { font-size: 28px; font-weight: 800; color: ${C.primary}; }
  .badge { 
    display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 8px;
    font-size: 11px; font-weight: 700; background: ${p => p.$bg}; color: ${p => p.$color};
    width: fit-content;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  border: 1px solid ${C.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  overflow: hidden;
  padding: 28px;
`;

const TableActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;

  .search-group {
    display: flex;
    gap: 12px;
    
    .input-wrap {
      position: relative;
      display: flex;
      align-items: center;
      
      svg { position: absolute; left: 12px; color: ${C.textMuted}; }
      input {
        padding: 10px 16px 10px 38px;
        border-radius: 12px;
        border: 1px solid ${C.border};
        outline: none;
        font-size: 14px;
        background: ${C.bg};
        transition: 0.2s;
        &:focus { border-color: ${C.blue}; background: white; }
      }
    }
  }
`;

const BtnPrimary = styled.button`
  background: ${C.accent};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(192, 57, 43, 0.2);

  &:hover { 
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(192, 57, 43, 0.3);
}
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* Enable horizontal scrolling on mobile */

  th, td {
    padding: 18px 16px;
    text-align: left;
    border-bottom: 1px solid ${C.bg};
  }

  th {
    font-weight: 700;
    color: ${C.textMuted};
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: ${C.bg};
    &:first-child { border-radius: 10px 0 0 10px; }
    &:last-child { border-radius: 0 10px 10px 0; }
  }

  td {
    color: ${C.text};
    font-size: 14px;
  }
  
  tr:hover td { background: rgba(59, 130, 246, 0.02); }
  tr:last-child td { border-bottom: none; }
`;

const Badge = styled.span<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  background: ${p => {
    if (p.$status === 'completed' || p.$status === 'done') return C.successBg;
    if (p.$status === 'cancelled' || p.$status === 'skipped') return C.dangerBg;
    if (p.$status === 'confirmed' || p.$status === 'waiting') return C.warningBg;
    if (p.$status === 'in_progress' || p.$status === 'in_service') return 'rgba(59, 130, 246, 0.1)';
    return C.warningBg;
  }};
  color: ${p => {
    if (p.$status === 'completed' || p.$status === 'done') return C.success;
    if (p.$status === 'cancelled' || p.$status === 'skipped') return C.danger;
    if (p.$status === 'confirmed' || p.$status === 'waiting') return C.warning;
    if (p.$status === 'in_progress' || p.$status === 'in_service') return C.blue;
    return C.warning;
  }};
`;

const SelectStatus = styled.select`
  padding: 8px 12px;
  border: 1px solid ${C.border};
  border-radius: 10px;
  background: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: 0.2s;
  &:hover { border-color: ${C.blue}; }
`;

const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white; border-radius: 20px; width: 90%; max-width: 440px;
  padding: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  
  @media (max-width: 480px) { padding: 24px; }
  
  h2 { font-size: 20px; font-weight: 800; margin-bottom: 24px; color: ${C.primary}; display: flex; justify-content: space-between; align-items: center; }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  label { display: block; font-size: 13px; font-weight: 600; color: ${C.text}; margin-bottom: 8px; }
  input, select { 
    width: 100%; padding: 12px 16px; border: 1px solid ${C.border}; border-radius: 12px; outline: none;
    font-size: 14px; color: ${C.text};
    &:focus { border-color: ${C.blue}; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
  }
`;

export const ReservationManagePage = () => {
  const [data, setData] = useState<any[]>([]);
  const [capsters, setCapsters] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formCapster, setFormCapster] = useState('');
  const [formMainHaircut, setFormMainHaircut] = useState('Haircut Senior');
  const [formAddons, setFormAddons] = useState<string[]>([]);
  const [addonsOpen, setAddonsOpen] = useState(false);


  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [dateFilter]);

  const fetchInitialData = async () => {
    try {
      const caps = Storage.get<any[]>('capsters', []);
      const svcs = Storage.get<any[]>('services', []);
      
      setCapsters(caps);
      setServices(svcs);

      if (caps.length > 0) {
        if (currentUser && currentUser.role === 'kapster') {
           const match = caps.find((c: any) => c.name.toLowerCase() === currentUser.name.toLowerCase());
           if (match) setFormCapster(match.id.toString());
           else setFormCapster(caps[0].id.toString());
        } else {
           setFormCapster(caps[0].id.toString());
        }
      }
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const allReservations = Storage.get('reservations', []);
      
      let filtered = allReservations.filter((r: any) => r.booking_date === dateFilter);
      if (currentUser?.role === 'kapster') {
        filtered = filtered.filter((r: any) => r.capster?.name?.toLowerCase() === currentUser.name.toLowerCase());
      }
      setData(filtered);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQueueStatus = async (queueId: number, newStatus: string) => {
    try {
       const allRes = Storage.get('reservations', []);
       const updated = allRes.map((r: any) => {
         if (r.queue && r.queue.id === queueId) {
             return { ...r, queue: { ...r.queue, status: newStatus } };
         }
         return r;
       });
       Storage.set('reservations', updated);
       fetchBookings();
    } catch (err) {
      console.error('Failed to update queue status:', err);
      alert('Gagal mengupdate status antrean.');
    }
  };

  const confirmPayment = async (paymentId: number) => {
    try {
      const allRes = Storage.get('reservations', []);
      const updated = allRes.map((r: any) => {
        if (r.payment && r.payment.id === paymentId) {
            return { ...r, payment: { ...r.payment, status: 'paid' } };
        }
        return r;
      });
      Storage.set('reservations', updated);
      alert('Pembayaran berhasil dikonfirmasi!');
      fetchBookings();
    } catch (err: any) {
      alert('Gagal konfirmasi pembayaran: ' + err.message);
    }
  };

  const updatePaymentMethod = async (paymentId: number, newMethod: string) => {
    try {
      const allRes = Storage.get('reservations', []);
      const updated = allRes.map((r: any) => {
        if (r.payment && r.payment.id === paymentId) {
            return { ...r, payment: { ...r.payment, method: newMethod } };
        }
        return r;
      });
      Storage.set('reservations', updated);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOffline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCapster || !formMainHaircut) return alert('Lengkapi data!');

    try {
      const allRes = Storage.get('reservations', []);
      const newCapster = capsters.find(c => c.id.toString() === formCapster);
      
      const todayRes = allRes.filter((r: any) => r.booking_date === dateFilter && r.capster?.id === newCapster?.id);
      const takenNums = new Set(
         todayRes.map((r: any) => {
            const match = r.queue_number?.match(/\d+$/);
            return match ? parseInt(match[0], 10) : 0;
         })
      );

      let startingNum = 1;
      const now = new Date();
      const isToday = dateFilter === now.toLocaleDateString("en-CA");

      if (isToday) {
         const currentH = now.getHours();
         const currentM = now.getMinutes();
         let foundFutureSlot = false;

         for (let i = 0; i < TIME_SLOTS.length; i++) {
             const [sh, sm] = TIME_SLOTS[i].split(":").map(Number);
             if (sh > currentH || (sh === currentH && sm >= currentM)) {
                  startingNum = i + 1;
                  foundFutureSlot = true;
                  break;
             }
         }

         if (!foundFutureSlot) {
             const [lastH, lastM] = TIME_SLOTS[TIME_SLOTS.length - 1].split(":").map(Number);
             const lastTimeMins = lastH * 60 + lastM;
             const currTimeMins = currentH * 60 + currentM;
             
             if (currTimeMins > lastTimeMins) {
                  const diffMins = currTimeMins - lastTimeMins;
                  const extraIntervals = Math.ceil(diffMins / 30);
                  startingNum = TIME_SLOTS.length + extraIntervals;
             } else {
                  startingNum = TIME_SLOTS.length;
             }
         }
      } else {
         // if not today, just get max
         let maxNum = 0;
         for (let x of takenNums) if (x > maxNum) maxNum = x;
         startingNum = Math.max(1, maxNum + 1);
      }

      let nextNum = startingNum;
      while (takenNums.has(nextNum)) {
          nextNum++;
      }
      
      const qNum = (newCapster?.queue_prefix || '') + nextNum;

      let amount = 0;
      const mainSvc = services.find(s => s.name.toLowerCase() === formMainHaircut.toLowerCase()) || { name: formMainHaircut, price: formMainHaircut.toLowerCase().includes('junior') ? 25000 : 35000 };
      amount += mainSvc.price;

      formAddons.forEach(addonName => {
         const sv = services.find(s => s.name === addonName);
         if (sv) amount += sv.price;
      });

      let calculatedStartTime = "00:00";
      if (nextNum <= TIME_SLOTS.length) {
         calculatedStartTime = TIME_SLOTS[nextNum - 1];
      } else {
         const lastTimeStr = TIME_SLOTS[TIME_SLOTS.length - 1];
         if (lastTimeStr) {
             const [lastH, lastM] = lastTimeStr.split(":").map(Number);
             let totalMins = lastH * 60 + lastM + (nextNum - TIME_SLOTS.length) * 30;
             const h = Math.floor(totalMins / 60) % 24;
             const m = totalMins % 60;
             calculatedStartTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
         }
      }

      const newBooking = {
        id: Date.now(),
        customer_name: "Cust-" + qNum,
        type: 'offline', 
        capster: newCapster,
        service: mainSvc,
        notes: formAddons.length > 0 ? `Addons: ${formAddons.join(', ')}` : '',
        booking_date: dateFilter,
        start_time: calculatedStartTime,
        queue_number: qNum,
        payment: {
            id: Date.now() + 1,
            method: 'cash',
            amount,
            status: 'unpaid'
        },
        queue: {
            id: Date.now() + 2,
            status: 'waiting'
        }
      };

      Storage.set('reservations', [...allRes, newBooking]);
      setModalOpen(false);
      setFormAddons([]);
      fetchBookings();
    } catch (err) {
      console.error('Failed to add offline booking:', err);
      alert('Gagal menambahkan pesanan.');
    }
  };

  const counts = useMemo(() => {
    return {
      total: data.length,
      process: data.filter(r => r.queue?.status === 'in_service').length,
      done: data.filter(r => r.queue?.status === 'done').length,
      cancel: data.filter(r => r.queue?.status === 'skipped').length,
    };
  }, [data]);

  const mapStatusDisplay = (status: string) => {
    if (status === 'waiting') return 'Menunggu';
    if (status === 'in_service') return 'Melayani';
    if (status === 'done') return 'Selesai';
    if (status === 'skipped') return 'Dilewati';
    return status;
  };

  return (
    <div>
      <TitleSection>
        <h1>Daftar Pesanan</h1>
        <p>Kelola dan pantau antrean serta status barbershop Anda</p>
      </TitleSection>

      <StatsGrid>
        <StatCard $color={C.blue} $bg="rgba(59, 130, 246, 0.1)">
          <div className="header">Total Pesanan</div>
          <div className="value">{counts.total}</div>
          <div className="badge">Total Hari Ini</div>
        </StatCard>
        <StatCard $color={C.warning} $bg={C.warningBg}>
          <div className="header">Antrean Aktif</div>
          <div className="value">{counts.process}</div>
          <div className="badge">Sedang Melayani</div>
        </StatCard>
        <StatCard $color={C.success} $bg={C.successBg}>
          <div className="header">Selesai</div>
          <div className="value">{counts.done}</div>
          <div className="badge">Sukses</div>
        </StatCard>
        <StatCard $color={C.danger} $bg={C.dangerBg}>
          <div className="header">Dilewati</div>
          <div className="value">{counts.cancel}</div>
          <div className="badge">Batal</div>
        </StatCard>
      </StatsGrid>

      <Card>
        <TableActionRow>
           <div className="search-group">
             <div className="input-wrap">
               <Search size={18} />
               <input type="text" placeholder="Cari pesanan..." />
             </div>
             <div className="input-wrap">
                <Calendar size={18} />
                <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)} />
             </div>
           </div>
           <BtnPrimary onClick={() => setModalOpen(true)}>
             <Plus size={18} /> Tambah Pesanan Offline
           </BtnPrimary>
        </TableActionRow>

        {loading ? (
          <div style={{textAlign:'center', padding:'48px'}}>
              <span style={{ fontSize: '14px', color: C.textMuted }}>Memuat Data...</span>
          </div>
        ) : (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>KODE</th>
                  <th>Nama Pelanggan</th>
                  <th>Tipe Layanan</th>
                  <th>Harga Layanan</th>
                  <th>Status Pembayaran</th>
                  <th>Waktu Layanan</th>
                  <th>Status Antrean</th>
                  <th>Aksi Cepat</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 && (
                  <tr><td colSpan={8} style={{textAlign:'center', color:C.textMuted, padding:'48px'}}>Tidak ada pesanan untuk tanggal ini.</td></tr>
                )}
                {data.map((r: any) => (
                  <tr key={r.id}>
                    <td><span style={{ fontWeight: 800, color: C.primary, fontSize: '15px' }}>{r.queue_number || '-'}</span></td>
                    <td>
                      <div style={{fontWeight:700}}>{r.customer_name}</div>
                      <div style={{fontSize:'12px', color:C.textMuted}}>{r.type.toUpperCase()}</div>
                    </td>
                    <td>
                      {r.service?.name}
                      {r.notes && <div style={{ fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{r.notes}</div>}
                    </td>
                    <td><span style={{ fontWeight: 600 }}>Rp {r.payment?.amount?.toLocaleString('id-ID')}</span></td>
                    <td>
                      <span style={{ 
                          fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '6px',
                          background: r.payment?.status === 'paid' ? C.successBg : C.dangerBg,
                          color: r.payment?.status === 'paid' ? C.success : C.danger,
                          display: 'block', width: 'fit-content', marginBottom: '8px'
                      }}>
                          {r.payment?.status?.toUpperCase() === 'PAID' ? 'SUDAH BAYAR' : 'BELUM BAYAR'}
                      </span>
                      {r.type === 'offline' ? (
                        <select 
                          value={r.payment?.method || 'cash'} 
                          onChange={e => updatePaymentMethod(r.payment.id, e.target.value)}
                          style={{ padding:'4px', fontSize:'12px', borderRadius:'6px', border:`1px solid ${C.border}`, outline:'none', cursor:'pointer' }}
                        >
                          <option value="cash">Tunai (Cash)</option>
                          <option value="cashless">Cashless (QRIS)</option>
                        </select>
                      ) : (
                        <div style={{ fontSize: '11px', fontWeight: 600, color: C.textMuted }}>Cashless (QRIS)</div>
                      )}
                    </td>
                    <td>{r.start_time} WIB</td>
                    <td><Badge $status={r.queue?.status}>{mapStatusDisplay(r.queue?.status)}</Badge></td>
                    <td>
                      <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                        {r.queue && (
                            <SelectStatus value={r.queue.status} onChange={e => updateQueueStatus(r.queue.id, e.target.value)}>
                                <option value="waiting">Menunggu</option>
                                <option value="in_service">Panggil / Melayani</option>
                                <option value="done">Selesai</option>
                                <option value="skipped">Lewati</option>
                            </SelectStatus>
                        )}
                        {r.payment?.status !== 'paid' && (
                          <BtnPrimary 
                            style={{padding:'6px 14px', fontSize:'11px', background:C.success, boxShadow:'none'}}
                            onClick={() => confirmPayment(r.payment.id)}
                          >
                            <CheckCircle2 size={12} /> Konfirmasi Bayar
                          </BtnPrimary>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        )}
      </Card>

      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2>Registrasi Walk-In <X size={20} cursor="pointer" onClick={() => setModalOpen(false)} /></h2>
            <form onSubmit={handleAddOffline}>
              <FormGroup>
                <label>Haircut Utama</label>
                <select required value={formMainHaircut} onChange={e => setFormMainHaircut(e.target.value)}>
                  <option value="Haircut Senior">Haircut Senior</option>
                  <option value="Haircut Junior">Haircut Junior</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Tambah Lainnya (Addons)</label>
                <div style={{ border: `1px solid ${C.border}`, borderRadius: '12px', padding: '12px', background: '#fff' }}>
                   <div onClick={() => setAddonsOpen(!addonsOpen)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '14px', color: C.text }}>
                      <span>Pilih Tambahan ({formAddons.length})</span>
                      <span>{addonsOpen ? '▲' : '▼'}</span>
                   </div>
                   {addonsOpen && (
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                         {[
                           {
                             label: "Coloring",
                             filter: (x: any) => x.name.toLowerCase().includes("coloring") || x.name.toLowerCase().includes("highlight")
                           },
                           {
                             label: "Perm & Treatment",
                             filter: (x: any) => x.name.toLowerCase().includes("perm") || x.name.toLowerCase().includes("lift")
                           },
                           {
                             label: "Layanan Lainnya",
                             filter: (x: any) => !x.name.toLowerCase().includes("coloring") && !x.name.toLowerCase().includes("highlight") && !x.name.toLowerCase().includes("perm") && !x.name.toLowerCase().includes("lift") && !x.name.toLowerCase().includes("haircut")
                           }
                         ].map(sec => (
                             <div key={sec.label} style={{marginBottom:'6px'}}>
                               <div style={{fontSize:'12px', fontWeight:800, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.5px'}}>{sec.label}</div>
                               {services.filter(sec.filter).map((s: any) => (
                                 <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, margin: '6px 0', fontSize: '13px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={formAddons.includes(s.name)} onChange={(e) => {
                                        if (e.target.checked) setFormAddons([...formAddons, s.name]);
                                        else setFormAddons(formAddons.filter(a => a !== s.name));
                                    }} style={{ width: 'auto', margin: 0 }} />
                                    {s.name} <span style={{ color: C.textMuted }}>(Rp {s.price.toLocaleString()})</span>
                                 </label>
                               ))}
                             </div>
                         ))}
                      </div>
                   )}
                </div>
              </FormGroup>
              <BtnPrimary type="submit" style={{width:'100%', justifyContent:'center', marginTop:'8px'}}>Daftar Sekarang</BtnPrimary>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};
