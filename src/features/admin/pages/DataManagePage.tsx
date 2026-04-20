import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Storage } from '@/services/storage';
import { Save, Plus, Trash2, ShieldCheck, UserPlus, Scissors } from 'lucide-react';

const C = {
  primary: '#0F172A',
  accent: '#C0392B',
  blue: '#3B82F6',
  bg: '#F8FAFC',
  border: '#E2E8F0',
  text: '#1E293B',
  textMuted: '#64748B',
  success: '#10B981',
  danger: '#EF4444'
};

const TitleSection = styled.div`
  margin-bottom: 32px;
  h1 { font-size: 26px; font-weight: 800; color: ${C.primary}; margin-bottom: 6px; letter-spacing: -0.5px; }
  p { font-size: 14px; color: ${C.textMuted}; font-weight: 500; }
`;

const Section = styled.div`
  background: white;
  border-radius: 20px;
  border: 1px solid ${C.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  padding: 32px;
  margin-bottom: 32px;
  @media (max-width: 768px) { padding: 20px; }

  h3 { 
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px; 
    font-weight: 700; 
    color: ${C.primary}; 
    margin-bottom: 24px;
    
    svg { color: ${C.blue}; }
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  @media (max-width: 640px) { flex-direction: column; align-items: stretch; }
`;

const InputGroup = styled.div`
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label { font-size: 13px; font-weight: 600; color: ${C.textMuted}; }
  
  input {
    padding: 12px 16px;
    border: 1px solid ${C.border};
    border-radius: 12px;
    font-size: 14px;
    background: ${C.bg};
    transition: 0.2s;
    &:focus { border-color: ${C.blue}; background: white; outline: none; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.05); }
  }
`;

const ActionBtn = styled.button<{ $danger?: boolean, $outline?: boolean }>`
  padding: 12px 20px;
  background: ${p => p.$danger ? 'rgba(239, 68, 68, 0.1)' : p.$outline ? 'transparent' : C.primary};
  color: ${p => p.$danger ? C.danger : p.$outline ? C.primary : 'white'};
  border: ${p => p.$outline ? `1px solid ${C.border}` : 'none'};
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  align-self: flex-end;

  &:hover { 
    background: ${p => p.$danger ? C.danger : p.$outline ? C.bg : '#1e293b'};
    color: ${p => p.$danger ? 'white' : p.$outline ? C.primary : 'white'};
    transform: translateY(-1px);
  }
  @media (max-width: 640px) { align-self: stretch; justify-content: center; }
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid ${C.border};
  @media (max-width: 640px) { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px; }
  
  &:last-child { border-bottom: none; }
  
  .info {
    strong { font-size: 15px; color: ${C.primary}; }
    p { font-size: 13px; color: ${C.textMuted}; margin-top: 2px; }
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  border: 1px solid ${C.border};
  border-radius: 12px;
  overflow: hidden;
`;

const StatusBtn = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid ${p => p.$active ? '#10B981' : C.border};
  background: ${p => p.$active ? '#10B981' : '#F8FAFC'};
  color: ${p => p.$active ? 'white' : C.textMuted};
  cursor: pointer;
  transition: .2s;
  &:hover { opacity: 0.8; }
`;

export const DataManagePage = () => {
  const [settings, setSettings] = useState<any>({ shopName: 'Barbershop' });
  const [capsters, setCapsters] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCName, setNewCName] = useState('');
  const [newCPrefix, setNewCPrefix] = useState('A');
  const [newSName, setNewSName] = useState('');
  const [newSPrice, setNewSPrice] = useState('');

  const fetchData = () => {
    try {
      setLoading(true);
      const caps = Storage.get<any[]>('capsters', []);
      const svcs = Storage.get<any[]>('services', []);
      const sets = Storage.get<any>('settings', { shopName: 'Barbershop' });
      
      setCapsters(caps);
      setServices(svcs);
      setSettings(sets);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveSettings = () => {
    try {
      Storage.set('settings', settings);
      alert('Pengaturan berhasil disimpan!');
    } catch (err: any) {
      alert('Gagal menyimpan pengaturan: ' + err.message);
    }
  };

  const addCapster = () => {
    if (!newCName) return;
    try {
      const caps = Storage.get<any[]>('capsters', []);
      const newCap = {
        id: Date.now().toString(),
        name: newCName, 
        queue_prefix: newCPrefix,
        specialization: '-', 
        is_active: true
      };
      
      const updated = [...caps, newCap];
      Storage.set('capsters', updated);
      setCapsters(updated);
      setNewCName('');
    } catch (err: any) {
      alert('Gagal menambah personel: ' + err.message);
    }
  };

  const deleteCapster = (id: string) => {
    if (!confirm('Hapus kapster ini?')) return;
    try {
      const caps = Storage.get<any[]>('capsters', []);
      const updated = caps.filter((c: any) => c.id !== id);
      Storage.set('capsters', updated);
      setCapsters(updated);
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const addService = () => {
    if (!newSName || !newSPrice) return;
    try {
      const svcs = Storage.get<any[]>('services', []);
      const newSvc = {
        id: Date.now().toString(),
        name: newSName, 
        price: Number(newSPrice), 
        duration_minutes: 30,
        description: '-',
        is_active: true
      };
      const updated = [...svcs, newSvc];
      Storage.set('services', updated);
      setServices(updated);
      setNewSName('');
      setNewSPrice('');
    } catch (err: any) {
      alert('Gagal menambah layanan: ' + err.message);
    }
  };

  const deleteService = (id: string) => {
    if (!confirm('Hapus layanan ini?')) return;
    try {
      const svcs = Storage.get<any[]>('services', []);
      const updated = svcs.filter((s: any) => s.id !== id);
      Storage.set('services', updated);
      setServices(updated);
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div>
      <TitleSection>
        <h1>Manajemen Data Master</h1>
        <p>Konfigurasi profil barbershop, staf, dan layanan Anda</p>
      </TitleSection>

      <Section>
        <h3><ShieldCheck size={20} /> Konfigurasi Toko</h3>
        <FormRow>
          <InputGroup>
            <label>Nama Barbershop</label>
            <input 
              type="text" 
              value={settings.shopName} 
              onChange={e => setSettings({...settings, shopName: e.target.value})} 
              placeholder="e.g. BarberFlow Elite" 
            />
          </InputGroup>
          <ActionBtn onClick={saveSettings}>
            <Save size={18} /> Perbarui Info Toko
          </ActionBtn>
        </FormRow>
      </Section>

      <Section>
        <h3><UserPlus size={20} /> Personel Kapster</h3>
        <FormRow>
          <InputGroup>
            <label>Nama Lengkap</label>
            <input placeholder="Nama Kapster Baru" value={newCName} onChange={e=>setNewCName(e.target.value)} />
          </InputGroup>
          <InputGroup style={{flex: '0 0 140px'}}>
            <label>Kode</label>
            <input placeholder="e.g. A" value={newCPrefix} onChange={e=>setNewCPrefix(e.target.value)} maxLength={1} />
          </InputGroup>
          <ActionBtn onClick={addCapster}>
            <Plus size={18} /> Tambah Personel
          </ActionBtn>
        </FormRow>
        
        <ListContainer>
           {loading && <div style={{padding:'48px', textAlign:'center'}}><span style={{ fontSize: '14px', color: C.textMuted }}>Memuat Data...</span></div>}
           {!loading && capsters.length === 0 && <div style={{padding:'24px', textAlign:'center', color:C.textMuted}}>Belum ada personel yang terdaftar.</div>}
           {!loading && capsters.map((c: any) => (
              <ListItem key={c.id}>
                 <div className="info" style={{ opacity: !c.is_active ? 0.5 : 1 }}>
                    <strong>{c.name} {!c.is_active && <span style={{fontSize:'10px', background:C.danger, color:'white', padding:'2px 6px', borderRadius:'10px', marginLeft:8}}>TUTUP</span>}</strong>
                    <p>Kode: <span style={{color:C.blue, fontWeight:700}}>{c.queue_prefix || c.qPrefix}</span></p>
                 </div>
                 <div style={{display:'flex', gap:'8px'}}>
                    <StatusBtn 
                      $active={!!c.is_active} 
                      onClick={() => {
                        try {
                          const nextStatus = !c.is_active;
                          const caps = Storage.get<any[]>('capsters', []);
                          const updated = caps.map((x:any) => x.id === c.id ? {...x, is_active: nextStatus} : x);
                          Storage.set('capsters', updated);
                          setCapsters(updated);
                        } catch (err: any) {
                          alert('Gagal memperbarui status: ' + err.message);
                        }
                      }}
                    >
                      {!c.is_active ? 'Buka Barber' : 'Tutup Barber'}
                    </StatusBtn>
                    <ActionBtn $danger onClick={()=>deleteCapster(c.id)}>
                      <Trash2 size={16} /> Hapus
                    </ActionBtn>
                 </div>
              </ListItem>
           ))}
        </ListContainer>
      </Section>

      <Section>
        <h3><Scissors size={20} /> Menu Layanan & Harga</h3>
        <FormRow>
          <InputGroup>
            <label>Nama Layanan</label>
            <input placeholder="misal: Gentleman Cut" value={newSName} onChange={e=>setNewSName(e.target.value)} />
          </InputGroup>
          <InputGroup>
            <label>Harga (IDR)</label>
            <input type="number" placeholder="50000" value={newSPrice} onChange={e=>setNewSPrice(e.target.value)} />
          </InputGroup>
          <ActionBtn onClick={addService}>
            <Plus size={18} /> Tambah Layanan
          </ActionBtn>
        </FormRow>
        
        <ListContainer>
           {loading && <div style={{padding:'48px', textAlign:'center'}}><span style={{ fontSize: '14px', color: C.textMuted }}>Memuat Data...</span></div>}
           {!loading && services.length === 0 && <div style={{padding:'24px', textAlign:'center', color:C.textMuted}}>Tidak ada layanan yang terdaftar.</div>}
           {!loading && services.map((s: any) => (
              <ListItem key={s.id}>
                 <div className="info">
                    <strong>{s.name}</strong>
                    <p style={{color:C.success, fontWeight:700}}>Rp {Number(s.price).toLocaleString('id-ID')}</p>
                 </div>
                 <ActionBtn $danger onClick={()=>deleteService(s.id)}>
                   <Trash2 size={16} /> Hapus
                 </ActionBtn>
              </ListItem>
           ))}
        </ListContainer>
      </Section>

    </div>
  );
};
