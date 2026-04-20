import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Storage, currentUser } from '@/services/storage';
import { Calendar, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

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

const Toolbar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  background: white;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid ${C.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  align-items: center;
  @media (max-width: 768px) { flex-direction: column; align-items: stretch; padding: 20px; }

  .input-label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    
    label { font-size: 13px; font-weight: 700; color: ${C.textMuted}; display: flex; align-items: center; gap: 6px; }
    
    input, select {
      padding: 10px 16px;
      border: 1px solid ${C.border};
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      color: ${C.text};
      background: ${C.bg};
      outline: none;
      &:focus { border-color: ${C.blue}; background: white; }
    }
  }
`;

const MainCard = styled.div`
  background: white;
  border-radius: 24px;
  border: 1px solid ${C.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  padding: 32px;
`;

const InfoBox = styled.div`
  background: ${C.bg};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  border-left: 4px solid ${C.blue};

  .icon { color: ${C.blue}; margin-top: 2px; }
  .text {
    h4 { font-size: 15px; font-weight: 700; color: ${C.primary}; margin-bottom: 4px; }
    p { font-size: 13px; color: ${C.textMuted}; line-height: 1.5; }
  }
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
  @media (max-width: 480px) { grid-template-columns: repeat(2, 1fr); gap: 12px; }
`;

const SlotBtn = styled.button<{ $locked: boolean }>`
  padding: 24px 16px;
  border-radius: 16px;
  border: 2px solid ${p => p.$locked ? C.accent : C.border};
  background: ${p => p.$locked ? 'rgba(192, 57, 43, 0.05)' : 'white'};
  color: ${p => p.$locked ? C.accent : C.text};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px -10px rgba(0,0,0,0.1);
    border-color: ${p => p.$locked ? C.accent : C.blue};
  }

  .prefix { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
  .status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }
  .time {
    font-size: 13px;
    font-weight: 500;
    opacity: 0.8;
    margin-top: 2px;
  }
`;

const TIME_SLOTS = [
  "13:30", "14:00", "14:30", "15:00", "15:30", 
  "16:00", "16:30", "17:00", "17:30", 
  "18:45", "19:15", "19:45", "20:15", "20:45"
];

export const SlotManagePage = () => {
  const [capsters, setCapsters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lockedSlots, setLockedSlots] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCapster, setSelectedCapster] = useState('');

  useEffect(() => {
    fetchCapsters();
  }, []);

  const fetchCapsters = async () => {
    try {
      setLoading(true);
      const caps = Storage.get<any[]>('capsters', []);
      setCapsters(caps);
      
      if (caps.length > 0) {
        if (currentUser && currentUser.role === 'kapster') {
           const match = caps.find((c: any) => c.name.toLowerCase() === currentUser.name.toLowerCase());
           if (match) setSelectedCapster(match.id.toString());
           else setSelectedCapster(caps[0].id.toString());
        } else {
           setSelectedCapster(caps[0].id.toString());
        }
      }
    } catch (err) {
      console.error('Failed to fetch capsters:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeCapster = capsters.find((c: any) => c.id.toString() === selectedCapster);

  useEffect(() => {
    if (selectedCapster) {
      fetchLocks();
    }
  }, [dateFilter, selectedCapster]);

  const fetchLocks = async () => {
    try {
      const locks = Storage.get<any[]>('lockedSlots', []);
      const filteredLocks = locks.filter(
        (l: any) => l.lock_date === dateFilter && l.capster_id === selectedCapster
      );
      setLockedSlots(filteredLocks);
    } catch (err) {
      console.error('Failed to fetch locks:', err);
    }
  };

  const toggleLock = async (num: number) => {
    try {
      const locks = Storage.get<any[]>('lockedSlots', []);
      const index = locks.findIndex(
        (l: any) => l.lock_date === dateFilter && l.capster_id === selectedCapster && l.slot_number === num
      );
      
      let updatedLocks;
      if (index !== -1) {
          // Remove lock
          updatedLocks = locks.filter((_, i) => i !== index);
      } else {
          // Add lock
          updatedLocks = [...locks, { id: Date.now(), capster_id: selectedCapster, lock_date: dateFilter, slot_number: num }];
      }
      
      Storage.set('lockedSlots', updatedLocks);
      fetchLocks();
    } catch (err) {
      console.error('Failed to toggle lock:', err);
      alert('Gagal mengubah status slot.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <span style={{ fontSize: '14px', color: C.textMuted }}>Memuat...</span>
      </div>
    );
  }

  return (
    <div>
      <TitleSection>
        <h1>Manajemen Jadwal</h1>
        <p>Kontrol ketersediaan dan blokir slot untuk janji temu offline</p>
      </TitleSection>

      <Toolbar>
        <div className="input-label">
          <label><Calendar size={14} /> Tanggal Terpilih</label>
          <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)} />
        </div>
      </Toolbar>

      <MainCard>
        <InfoBox>
          <div className="icon"><ShieldAlert size={24} /></div>
          <div className="text">
            <h4>Manajemen Slot & Aturan Kedatangan</h4>
            <p>Slot yang dikunci akan disembunyikan dari sistem reservasi online. <strong>Informasi Penting:</strong> Pelanggan reservasi online telah diinstruksikan untuk hadir <strong>15 menit</strong> sebelum waktu slot yang dipilih ({TIME_SLOTS[0]} dsb).</p>
          </div>
        </InfoBox>
        
        <TimeGrid>
          {TIME_SLOTS.map((timeStr, i) => {
             const num = i + 1;
             const locked = lockedSlots.some((l: any) => l.slot_number === num);
             return (
               <SlotBtn key={num} $locked={locked} onClick={() => toggleLock(num)}>
                 <div className="prefix">{activeCapster?.queue_prefix || ''}{num}</div>
                 <div className="time">{timeStr}</div>
                 <div className="status">
                   {locked ? (
                     <><Lock size={14} /> Terkunci</>
                   ) : (
                     <><CheckCircle2 size={14} /> Tersedia</>
                   )}
                 </div>
               </SlotBtn>
             )
          })}
        </TimeGrid>
      </MainCard>
    </div>
  );
};
