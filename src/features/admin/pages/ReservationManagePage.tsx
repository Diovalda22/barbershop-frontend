import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '@/lib/api';
import { Plus, X, Search, Calendar, Loader2, CheckCircle2 } from 'lucide-react';

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
  @media(max-width: 640px){ grid-template-columns: 1fr; }
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

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
  background: white; border-radius: 20px; width: 100%; max-width: 440px;
  padding: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  
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
  const [formService, setFormService] = useState('');
  const [formCustomer, setFormCustomer] = useState('');
  const [formPaymentMethod, setFormPaymentMethod] = useState('cash');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [dateFilter]);

  const fetchInitialData = async () => {
    try {
      const [caps, svcs] = await Promise.all([
        api.get('/admin/capsters'),
        api.get('/admin/services')
      ]);
      if (caps.success) setCapsters(caps.data);
      if (svcs.success) setServices(svcs.data);
      if (caps.data?.length > 0) setFormCapster(caps.data[0].id.toString());
      if (svcs.data?.length > 0) setFormService(svcs.data[0].id.toString());
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/bookings?date=${dateFilter}`);
      if (res.success) setData(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQueueStatus = async (queueId: number, newStatus: string) => {
    try {
       let endpoint = `/admin/queue/${queueId}/`;
       if (newStatus === 'in_service') endpoint += 'call';
       else if (newStatus === 'done') endpoint += 'done';
       else if (newStatus === 'skipped') endpoint += 'skip';
       else return;

       const res = await api.put(endpoint, {});
       if (res.success) {
         fetchBookings();
       }
    } catch (err) {
      console.error('Failed to update queue status:', err);
      alert('Gagal mengupdate status antrean.');
    }
  };

  const confirmPayment = async (paymentId: number) => {
    try {
      const res = await api.put(`/admin/payments/${paymentId}/confirm`, {});
      if (res.success) {
        alert('Pembayaran berhasil dikonfirmasi!');
        fetchBookings();
      }
    } catch (err: any) {
      alert('Gagal konfirmasi pembayaran: ' + err.message);
    }
  };

  const handleAddOffline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCapster || !formService || !formCustomer) return alert('Lengkapi data!');

    try {
      const res = await api.post('/admin/bookings', {
        capster_id: formCapster,
        service_id: formService,
        customer_name: formCustomer,
        booking_date: dateFilter,
        start_time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', hour12: false}),
        payment_method: formPaymentMethod
      });

      if (res.success) {
        setModalOpen(false);
        setFormCustomer('');
        fetchBookings();
      }
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
        <h1>Order List</h1>
        <p>Manage and monitor your barbershop queue and status</p>
      </TitleSection>

      <StatsGrid>
        <StatCard $color={C.blue} $bg="rgba(59, 130, 246, 0.1)">
          <div className="header">Total Orders</div>
          <div className="value">{counts.total}</div>
          <div className="badge">Today's Total</div>
        </StatCard>
        <StatCard $color={C.warning} $bg={C.warningBg}>
          <div className="header">Active Queue</div>
          <div className="value">{counts.process}</div>
          <div className="badge">In Service</div>
        </StatCard>
        <StatCard $color={C.success} $bg={C.successBg}>
          <div className="header">Completed</div>
          <div className="value">{counts.done}</div>
          <div className="badge">Success</div>
        </StatCard>
        <StatCard $color={C.danger} $bg={C.dangerBg}>
          <div className="header">Skipped</div>
          <div className="value">{counts.cancel}</div>
          <div className="badge">Failed</div>
        </StatCard>
      </StatsGrid>

      <Card>
        <TableActionRow>
           <div className="search-group">
             <div className="input-wrap">
               <Search size={18} />
               <input type="text" placeholder="Search orders..." />
             </div>
             <div className="input-wrap">
                <Calendar size={18} />
                <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)} />
             </div>
           </div>
           <BtnPrimary onClick={() => setModalOpen(true)}>
             <Plus size={18} /> Add walk-in order
           </BtnPrimary>
        </TableActionRow>

        {loading ? (
          <div style={{textAlign:'center', padding:'48px'}}><Loader2 className="animate-spin" /></div>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>KODE</th>
                <th>Customer Name</th>
                <th>Service Type</th>
                <th>Service Price</th>
                <th>Payment Status</th>
                <th>Service Time</th>
                <th>Queue Status</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr><td colSpan={8} style={{textAlign:'center', color:C.textMuted, padding:'48px'}}>No orders found for this date.</td></tr>
              )}
              {data.map((r: any) => (
                <tr key={r.id}>
                  <td><span style={{ fontWeight: 800, color: C.primary, fontSize: '15px' }}>{r.queue_number || '-'}</span></td>
                  <td>
                    <div style={{fontWeight:700}}>{r.customer_name}</div>
                    <div style={{fontSize:'12px', color:C.textMuted}}>{r.type.toUpperCase()}</div>
                  </td>
                  <td>{r.service?.name}</td>
                  <td><span style={{ fontWeight: 600 }}>Rp {r.payment?.amount?.toLocaleString('id-ID')}</span></td>
                  <td>
                    <span style={{ 
                        fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '6px',
                        background: r.payment?.status === 'paid' ? C.successBg : C.dangerBg,
                        color: r.payment?.status === 'paid' ? C.success : C.danger
                    }}>
                        {r.payment?.status?.toUpperCase() || 'UNPAID'}
                    </span>
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
                          <CheckCircle2 size={12} /> Confirm Pay
                        </BtnPrimary>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2>Walk-In Registration <X size={20} cursor="pointer" onClick={() => setModalOpen(false)} /></h2>
            <form onSubmit={handleAddOffline}>
              <FormGroup>
                <label>Customer Name</label>
                <input required type="text" value={formCustomer} onChange={e => setFormCustomer(e.target.value)} placeholder="Nama pelanggan..." />
              </FormGroup>
              <FormGroup>
                <label>Assign Kapster</label>
                <select required value={formCapster} onChange={e => setFormCapster(e.target.value)}>
                  {capsters.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </FormGroup>
              <FormGroup>
                <label>Service</label>
                <select required value={formService} onChange={e => setFormService(e.target.value)}>
                  {services.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name} (Rp {s.price.toLocaleString()})</option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup>
                <label>Payment Method</label>
                <select value={formPaymentMethod} onChange={e => setFormPaymentMethod(e.target.value)}>
                  <option value="cash">Cash (Tunai)</option>
                  <option value="qris">Cashless (QRIS/E-Wallet)</option>
                </select>
                <p style={{fontSize:'11px', color:C.textMuted, marginTop:'4px'}}>*Nasabah membayar setelah pengerjaan selesai.</p>
              </FormGroup>
              <BtnPrimary type="submit" style={{width:'100%', justifyContent:'center', marginTop:'8px'}}>Register Now</BtnPrimary>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};
