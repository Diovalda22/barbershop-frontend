import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Storage } from '@/services/storage';
import { Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import * as XLSX from 'xlsx';

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
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  info: '#3B82F6',
  infoBg: '#EFF6FF'
};

const TitleSection = styled.div`
  margin-bottom: 32px;
  h1 { font-size: 26px; font-weight: 800; color: ${C.primary}; margin-bottom: 6px; letter-spacing: -0.5px; }
  p { font-size: 14px; color: ${C.textMuted}; font-weight: 500; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const SummaryCard = styled.div<{ $type: 'success' | 'danger' | 'info' }>`
  background: white;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid ${C.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  gap: 16px;

  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    .icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${p => p.$type === 'success' ? C.successBg : p.$type === 'danger' ? C.dangerBg : C.infoBg};
      color: ${p => p.$type === 'success' ? C.success : p.$type === 'danger' ? C.danger : C.info};
    }
    h3 { font-size: 14px; font-weight: 700; color: ${C.textMuted}; text-transform: uppercase; margin: 0; }
  }

  .value {
    font-size: 32px;
    font-weight: 800;
    color: ${p => p.$type === 'success' ? C.success : p.$type === 'danger' ? C.danger : C.primary};
    letter-spacing: -1px;
  }
`;

const MainCard = styled.div`
  background: white;
  border-radius: 20px;
  border: 1px solid ${C.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  padding: 28px;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;

  .period-picker {
    padding: 10px 16px;
    border-radius: 12px;
    border: 1px solid ${C.border};
    font-weight: 600;
    color: ${C.text};
    outline: none;
    cursor: pointer;
    background: ${C.bg};
    &:focus { border-color: ${C.blue}; background: white; }
  }

  .view-toggle {
    display: flex;
    gap: 8px;
    background: ${C.bg};
    padding: 4px;
    border-radius: 12px;
    
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      background: transparent;
      color: ${C.textMuted};
      transition: all 0.2s;
      
      &.active {
        background: white;
        color: ${C.primary};
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
    }
  }
`;

const ExportBtn = styled.button`
  padding: 10px 20px;
  background: ${C.primary};
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  &:hover { opacity: 0.9; transform: translateY(-1px); }
`;

const BreakdownList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 12px;
    background: ${C.bg};
    .label { font-size: 14px; font-weight: 600; color: ${C.textMuted}; }
    .val { font-size: 18px; font-weight: 800; color: ${C.primary}; }
    &.profit { background: ${C.infoBg}; border: 1px solid rgba(59, 130, 246, 0.2); .val { color: ${C.info}; font-size: 24px; } }
  }
`;

export const NetProfitPage = () => {
  const [loading, setLoading] = useState(true);
  const [periodType, setPeriodType] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [viewFilter, setViewFilter] = useState<'saya' | 'semua'>('saya');
  
  const [report, setReport] = useState({
    totalRevenue: 0,
    totalExpense: 0,
    netProfit: 0,
    revenueCount: 0,
    expenseCount: 0
  });

  useEffect(() => {
    fetchReport();
  }, [periodType, selectedDate, viewFilter]);

  const fetchReport = () => {
    setLoading(true);
    const allReservations = Storage.get<any[]>('reservations', []);
    const allExpenses = Storage.get<any[]>('expenses', []);
    const userStr = localStorage.getItem("admin_user");
    const currentUser = userStr ? JSON.parse(userStr) : null;

    // Filter Revenue
    let filRev = allReservations.filter((r: any) => {
      if (!r.booking_date || typeof r.booking_date !== 'string' || r.payment?.status !== 'paid') return false;
      
      let inPeriod = false;
      if (periodType === 'daily') inPeriod = r.booking_date === selectedDate;
      else if (periodType === 'monthly') inPeriod = r.booking_date.startsWith(selectedDate.slice(0, 7));
      else if (periodType === 'yearly') inPeriod = r.booking_date.startsWith(selectedDate.slice(0, 4));

      if (!inPeriod) return false;
      if (viewFilter === 'saya' && currentUser) {
        return r.capster?.name?.toLowerCase() === currentUser.name.toLowerCase();
      }
      return true;
    });

    // Filter Expenses
    let filExp = allExpenses.filter((r: any) => {
      if (!r.date || typeof r.date !== 'string') return false;
      
      let inPeriod = false;
      if (periodType === 'daily') inPeriod = r.date === selectedDate;
      else if (periodType === 'monthly') inPeriod = r.date.startsWith(selectedDate.slice(0, 7));
      else if (periodType === 'yearly') inPeriod = r.date.startsWith(selectedDate.slice(0, 4));

      if (!inPeriod) return false;
      if (viewFilter === 'saya' && currentUser) {
        return r.created_by?.toLowerCase() === currentUser.name.toLowerCase();
      }
      return true;
    });

    const totalRevenue = filRev.reduce((sum: number, r: any) => sum + (r.payment?.amount || 0), 0);
    const totalExpense = filExp.reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0);

    setReport({
      totalRevenue,
      totalExpense,
      netProfit: totalRevenue - totalExpense,
      revenueCount: filRev.length,
      expenseCount: filExp.length
    });

    setLoading(false);
  };

  const exportToExcel = () => {
    const dataForExcel = [
      { 'Keterangan': 'Total Pendapatan', 'Jumlah (Rp)': report.totalRevenue },
      { 'Keterangan': 'Total Pengeluaran', 'Jumlah (Rp)': report.totalExpense },
      { 'Keterangan': 'Laba Bersih', 'Jumlah (Rp)': report.netProfit }
    ];

    const headers = ['Keterangan', 'Jumlah (Rp)'];
    const rows = dataForExcel.map(r => [
      r['Keterangan'], r['Jumlah (Rp)']
    ]);

    const aoa = [
      [`Laporan Laba Bersih - Periode: ${selectedDate}`],
      [],
      headers,
      ...rows
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    const workbook = XLSX.utils.book_new();

    const wscols = [
      { wch: 30 }, 
      { wch: 25 }  
    ];
    worksheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Laba Bersih");
    XLSX.writeFile(workbook, `Laba_Bersih_${selectedDate}.xlsx`);
  };

  return (
    <div>
      <TitleSection>
        <h1>Laba Bersih</h1>
        <p>Analisis keuntungan dari pendapatan dan pengeluaran</p>
      </TitleSection>

      <MainCard style={{marginBottom: '32px'}}>
        <Toolbar>
           <div style={{display:'flex', gap:'16px', alignItems:'center'}}>
             <select className="period-picker" value={periodType} onChange={e => setPeriodType(e.target.value as any)}>
               <option value="daily">Harian</option>
               <option value="monthly">Bulanan</option>
               <option value="yearly">Tahunan</option>
             </select>
             {periodType === 'daily' && <input type="date" className="period-picker" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} />}
             {periodType === 'monthly' && <input type="month" className="period-picker" value={selectedDate.slice(0,7)} onChange={e=>setSelectedDate(e.target.value + '-01')} />}
             {periodType === 'yearly' && <input type="number" min="2000" max="2100" className="period-picker" value={selectedDate.slice(0,4)} onChange={e=>setSelectedDate(e.target.value + '-01-01')} />}

             <div className="view-toggle">
               <button className={viewFilter === 'saya' ? 'active' : ''} onClick={() => setViewFilter('saya')}>Laba Saya</button>
               <button className={viewFilter === 'semua' ? 'active' : ''} onClick={() => setViewFilter('semua')}>Laba Semua</button>
             </div>
           </div>
           <ExportBtn onClick={exportToExcel}>
             <Download size={18} /> Ekspor Excel
           </ExportBtn>
        </Toolbar>
      </MainCard>

      {loading ? (
          <div style={{textAlign:'center', padding:'48px'}}><span style={{ fontSize: '14px', color: C.textMuted }}>Memuat Data...</span></div>
      ) : (
        <>
          <Grid>
            <SummaryCard $type="success">
              <div className="header">
                <div className="icon-box"><TrendingUp size={24} /></div>
                <h3>Pendapatan</h3>
              </div>
              <div className="value">Rp {report.totalRevenue.toLocaleString('id-ID')}</div>
            </SummaryCard>
            
            <SummaryCard $type="danger">
              <div className="header">
                <div className="icon-box"><TrendingDown size={24} /></div>
                <h3>Pengeluaran</h3>
              </div>
              <div className="value">Rp {report.totalExpense.toLocaleString('id-ID')}</div>
            </SummaryCard>

            <SummaryCard $type="info">
              <div className="header">
                <div className="icon-box"><DollarSign size={24} /></div>
                <h3>Laba Bersih</h3>
              </div>
              <div className="value">Rp {report.netProfit.toLocaleString('id-ID')}</div>
            </SummaryCard>
          </Grid>

          <MainCard>
            <h3 style={{fontSize:'16px', fontWeight:800, marginBottom:'24px', color:C.primary}}>Rincian Ringkasan</h3>
            <BreakdownList>
              <div className="row">
                <span className="label">Total Transaksi Pendapatan</span>
                <span className="val" style={{fontSize:'16px'}}>{report.revenueCount} Transaksi</span>
              </div>
              <div className="row">
                <span className="label">Total Item Pengeluaran</span>
                <span className="val" style={{fontSize:'16px'}}>{report.expenseCount} Item</span>
              </div>
              <div className="row profit">
                <span className="label">Hasil Laba Bersih</span>
                <span className="val">Rp {report.netProfit.toLocaleString('id-ID')}</span>
              </div>
            </BreakdownList>
          </MainCard>
        </>
      )}
    </div>
  );
};
