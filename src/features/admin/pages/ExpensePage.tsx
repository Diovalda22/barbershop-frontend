import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Storage, currentUser } from '@/services/storage';
import * as XLSX from 'xlsx';
import { Download, ShoppingCart, TrendingDown, Plus, Trash2 } from 'lucide-react';

const C = {
  primary: '#0F172A',
  accent: '#C0392B',
  blue: '#3B82F6',
  bg: '#F8FAFC',
  border: '#E2E8F0',
  text: '#1E293B',
  textMuted: '#64748B',
  danger: '#EF4444',
  dangerBg: '#FEF2F2'
};

const TitleSection = styled.div`
  margin-bottom: 32px;
  h1 { font-size: 26px; font-weight: 800; color: ${C.primary}; margin-bottom: 6px; letter-spacing: -0.5px; }
  p { font-size: 14px; color: ${C.textMuted}; font-weight: 500; }
`;

const ExpenseCard = styled.div`
  background: white;
  padding: 32px;
  border-radius: 20px;
  border: 1px solid ${C.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .label-group {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .icon-box {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: ${C.dangerBg};
      color: ${C.danger};
      display: flex;
      align-items: center;
      justify-content: center;
    }

    h3 { font-size: 14px; font-weight: 700; color: ${C.textMuted}; text-transform: uppercase; margin: 0; }
    .value { font-size: 32px; font-weight: 800; color: ${C.primary}; margin-top: 4px; letter-spacing: -1px; }
  }

  .trend {
    display: flex;
    align-items: center;
    gap: 6px;
    color: ${C.danger};
    font-size: 14px;
    font-weight: 700;
    padding: 8px 14px;
    background: ${C.dangerBg};
    border-radius: 12px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const FormCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid ${C.border};
  margin-bottom: 32px;
  h3 { font-size: 16px; font-weight: 700; margin-bottom: 16px; color: ${C.primary}; }
  .form-row {
    display: flex;
    gap: 16px;
    align-items: flex-end;
    @media (max-width: 768px) { flex-direction: column; align-items: stretch; }
  }
  .input-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    label { font-size: 12px; font-weight: 600; color: ${C.textMuted}; text-transform: uppercase; }
    input { padding: 10px 16px; border-radius: 10px; border: 1px solid ${C.border}; font-weight: 500; font-size: 14px; outline: none; transition: 0.2s; &:focus { border-color: ${C.blue}; } }
  }
  .btn-submit {
    height: 42px;
    padding: 0 24px;
    background: ${C.primary};
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: 0.2s;
    &:hover { opacity: 0.9; }
  }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 20px;
  border: 1px solid ${C.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  overflow: hidden;
  padding: 28px;
  @media (max-width: 768px) { padding: 20px; }
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

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: stretch;
    .filter-group {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    .view-toggle {
      display: grid;
      grid-template-columns: 1fr 1fr;
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
  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin: 0 -28px;
  padding: 0 28px;
  &::-webkit-scrollbar { height: 8px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
  
  @media (max-width: 768px) {
    margin: 0 -20px;
    padding: 0 20px;
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

  td { color: ${C.text}; font-size: 14px; }
  tr:hover td { background: rgba(59, 130, 246, 0.02); }
  tr:last-child td { border-bottom: none; }

  .btn-delete {
    background: none; border: none; color: ${C.danger}; cursor: pointer; padding: 6px; border-radius: 6px; transition: 0.2s;
    &:hover { background: ${C.dangerBg}; }
  }
`;

export const ExpensePage = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodType, setPeriodType] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // yyyy-mm-dd
  const [viewFilter, setViewFilter] = useState<'saya' | 'semua'>('saya');
  const shopName = "Barbershop";

  // Form State
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    fetchReport();
  }, [periodType, selectedDate, viewFilter]);

  const fetchReport = () => {
    setLoading(true);
    const allExpenses = Storage.get<any[]>('expenses', []);
    
    let filteredExpenses = allExpenses.filter((r: any) => {
      if (!r.date || typeof r.date !== 'string') return false;
      
      let inPeriod = false;
      if (periodType === 'daily') {
        inPeriod = r.date === selectedDate;
      } else if (periodType === 'monthly') {
        inPeriod = r.date.startsWith(selectedDate.slice(0, 7));
      } else if (periodType === 'yearly') {
        inPeriod = r.date.startsWith(selectedDate.slice(0, 4));
      }

      if (!inPeriod) return false;

      // Filter by user
      if (viewFilter === 'saya' && currentUser) {
        return r.created_by?.toLowerCase() === currentUser.name.toLowerCase();
      }
      
      return true;
    });

    // sort desc by date
    filteredExpenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setExpenses(filteredExpenses);

    setReportData({
        total_expense: filteredExpenses.reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0),
        total_items: filteredExpenses.length
    });

    setLoading(false);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAmount || !newDate) return alert('Lengkapi semua data');

    const allExp = Storage.get<any[]>('expenses', []);
    const newExp = {
      id: crypto.randomUUID(),
      name: newName,
      amount: Number(newAmount),
      date: newDate,
      created_by: currentUser?.name || 'Admin',
      created_at: new Date().toISOString()
    };

    Storage.set('expenses', [...allExp, newExp]);
    setNewName('');
    setNewAmount('');
    fetchReport();
    alert('Pengeluaran berhasil ditambahkan');
  };

  const handleDelete = (id: string) => {
    if(!confirm('Yakin hapus data pengeluaran ini?')) return;
    const allExp = Storage.get<any[]>('expenses', []);
    Storage.set('expenses', allExp.filter(x => x.id !== id));
    fetchReport();
  };

  const exportToExcel = () => {
    if (!expenses.length) return alert('No data to export');

    const dataForExcel = expenses.map(r => {
      return {
        'Tanggal': r.date,
        'Keterangan': r.name,
        'Pelaksana': r.created_by || '-',
        'Pengeluaran (Rp)': r.amount || 0
      };
    });

    const headers = ['Tanggal', 'Keterangan', 'Pelaksana', 'Pengeluaran (Rp)'];
    const rows = dataForExcel.map(r => [
      r['Tanggal'], r['Keterangan'], r['Pelaksana'], r['Pengeluaran (Rp)']
    ]);

    const aoa = [
      [`Laporan Pengeluaran - Periode: ${selectedDate}`],
      [],
      headers,
      ...rows,
      ["", "", "TOTAL", reportData?.total_expense || 0]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    const workbook = XLSX.utils.book_new();

    const wscols = [
      { wch: 15 }, 
      { wch: 40 }, 
      { wch: 25 }, 
      { wch: 20 }  
    ];
    worksheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Pengeluaran");
    XLSX.writeFile(workbook, `Laporan_Pengeluaran_${shopName.replace(/\s+/g, '')}_${selectedDate}.xlsx`);
  };

  return (
    <div>
      <TitleSection>
        <h1>Catatan Pengeluaran</h1>
        <p>Kelola dan pantau seluruh biaya operasional</p>
      </TitleSection>

      <ExpenseCard>
        <div className="label-group">
          <div className="icon-box"><ShoppingCart size={26} /></div>
          <div>
            <h3>Total Pengeluaran</h3>
            <div className="value">Rp {reportData?.total_expense?.toLocaleString('id-ID') || 0}</div>
          </div>
        </div>
        <div className="trend">
          <TrendingDown size={18} />
          {reportData?.total_items || 0} Transaksi
        </div>
      </ExpenseCard>

      <FormCard>
        <h3>Tambah Pengeluaran</h3>
        <form className="form-row" onSubmit={handleAddExpense}>
          <div className="input-group">
            <label>Tanggal</label>
            <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Keterangan / Nama Pengeluaran</label>
            <input type="text" placeholder="Cth: Beli Sampo, Bayar Listrik..." value={newName} onChange={e=>setNewName(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Total Harga (Rp)</label>
            <input type="number" placeholder="50000" min="0" value={newAmount} onChange={e=>setNewAmount(e.target.value)} required />
          </div>
          <button type="submit" className="btn-submit"><Plus size={18} /> Tambah</button>
        </form>
      </FormCard>

      <TableCard>
        <Toolbar>
           <div className="filter-group" style={{display:'flex', gap:'16px', alignItems:'center'}}>
             <select className="period-picker" value={periodType} onChange={e => setPeriodType(e.target.value as any)}>
               <option value="daily">Harian</option>
               <option value="monthly">Bulanan</option>
               <option value="yearly">Tahunan</option>
             </select>
             {periodType === 'daily' && <input type="date" className="period-picker" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} />}
             {periodType === 'monthly' && <input type="month" className="period-picker" value={selectedDate.slice(0,7)} onChange={e=>setSelectedDate(e.target.value + '-01')} />}
             {periodType === 'yearly' && <input type="number" min="2000" max="2100" className="period-picker" value={selectedDate.slice(0,4)} onChange={e=>setSelectedDate(e.target.value + '-01-01')} />}
             
             <div className="view-toggle">
               <button className={viewFilter === 'saya' ? 'active' : ''} onClick={() => setViewFilter('saya')}>Pengeluaran Saya</button>
               <button className={viewFilter === 'semua' ? 'active' : ''} onClick={() => setViewFilter('semua')}>Pengeluaran Semua</button>
             </div>
           </div>
           <ExportBtn onClick={exportToExcel}>
             <Download size={18} /> Ekspor Excel
           </ExportBtn>
        </Toolbar>

        {loading ? (
          <div style={{textAlign:'center', padding:'48px'}}>
              <span style={{ fontSize: '14px', color: C.textMuted }}>Memuat Data...</span>
          </div>
        ) : (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Pelaksana</th>
                  <th>Total Harga</th>
                  <th style={{textAlign: 'right'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 && (
                  <tr><td colSpan={5} style={{textAlign:'center', color:C.textMuted, padding:'48px'}}>Data tidak ditemukan untuk periode ini.</td></tr>
                )}
                {expenses.map(r => (
                  <tr key={r.id}>
                    <td style={{ color: C.textMuted }}>{r.date}</td>
                    <td><div style={{fontWeight:700}}>{r.name}</div></td>
                    <td style={{fontSize:'13px'}}>{r.created_by || '-'}</td>
                    <td><span style={{fontWeight:800, color:C.danger}}>Rp {r.amount?.toLocaleString('id-ID')}</span></td>
                    <td style={{textAlign: 'right'}}>
                      <button className="btn-delete" onClick={() => handleDelete(r.id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}
      </TableCard>
    </div>
  );
};
