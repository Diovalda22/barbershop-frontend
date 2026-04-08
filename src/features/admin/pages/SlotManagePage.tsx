import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '@/lib/api';
import { Calendar, User, ShieldAlert, CheckCircle2, Lock, Loader2 } from 'lucide-react';

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
`;

export const SlotManagePage = () => {
  const [capsters, setCapsters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lockedSlots, setLockedSlots] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCapster, setSelectedCapster] = useState('');

  const MAX_QUEUE = 15;

  useEffect(() => {
    fetchCapsters();
  }, []);

  const fetchCapsters = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/capsters');
      if (res.success) {
        setCapsters(res.data);
        if (res.data.length > 0) setSelectedCapster(res.data[0].id.toString());
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
      const res = await api.get(`/admin/slot-locks?date=${dateFilter}&capster_id=${selectedCapster}`);
      if (res.success) {
        setLockedSlots(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch locks:', err);
    }
  };

  const toggleLock = async (num: number) => {
    try {
      const res = await api.post('/admin/slot-locks/toggle', {
        capster_id: selectedCapster,
        lock_date: dateFilter,
        slot_number: num
      });
      if (res.success) {
        fetchLocks();
      }
    } catch (err) {
      console.error('Failed to toggle lock:', err);
      alert('Gagal mengubah status slot.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Loader2 className="animate-spin" size={48} color={C.blue} />
      </div>
    );
  }

  return (
    <div>
      <TitleSection>
        <h1>Schedule Management</h1>
        <p>Control availability and block slots for offline appointments</p>
      </TitleSection>

      <Toolbar>
        <div className="input-label" style={{ flex: '0 0 240px' }}>
          <label><Calendar size={14} /> Selected Date</label>
          <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)} />
        </div>
        <div className="input-label">
          <label><User size={14} /> Active Personnel</label>
          <select value={selectedCapster} onChange={e=>setSelectedCapster(e.target.value)}>
            {capsters.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </Toolbar>

      <MainCard>
        <InfoBox>
          <div className="icon"><ShieldAlert size={24} /></div>
          <div className="text">
            <h4>Quick Slot Locking</h4>
            <p>Locked slots will be hidden from the online reservation system. This is useful for manual breaks or walk-in customers that haven't been added yet.</p>
          </div>
        </InfoBox>
        
        <TimeGrid>
          {Array.from({ length: MAX_QUEUE }, (_, i) => {
             const num = i + 1;
             const locked = lockedSlots.some((l: any) => l.slot_number === num);
             return (
               <SlotBtn key={num} $locked={locked} onClick={() => toggleLock(num)}>
                 <div className="prefix">{activeCapster?.queue_prefix || ''}{num}</div>
                 <div className="status">
                   {locked ? (
                     <><Lock size={14} /> Locked</>
                   ) : (
                     <><CheckCircle2 size={14} /> Available</>
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
