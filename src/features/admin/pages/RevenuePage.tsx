import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Storage } from '@/services/storage';
import * as XLSX from 'xlsx';
import { Download, Calculator, TrendingUp } from 'lucide-react';

const C = {
  primary: '#0F172A',
  accent: '#C0392B',
  blue: '#3B82F6',
  bg: '#F8FAFC',
  border: '#E2E8F0',
  text: '#1E293B',
  textMuted: '#64748B',
  success: '#10B981',
  successBg: '#ECFDF5'
};

const TitleSection = styled.div`
  margin-bottom: 32px;
  h1 { font-size: 26px; font-weight: 800; color: ${C.primary}; margin-bottom: 6px; letter-spacing: -0.5px; }
  p { font-size: 14px; color: ${C.textMuted}; font-weight: 500; }
`;

const RevenueCard = styled.div`
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
      background: ${C.successBg};
      color: ${C.success};
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
    color: ${C.success};
    font-size: 14px;
    font-weight: 700;
    padding: 8px 14px;
    background: ${C.successBg};
    border-radius: 12px;
  }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 20px;
  border: 1px solid ${C.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  overflow: hidden;
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

export const RevenuePage = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateMonth, setDateMonth] = useState(new Date().toISOString().slice(0, 7)); // yyyy-MM
  const [viewFilter, setViewFilter] = useState<'saya' | 'semua'>('saya');
  const shopName = "Barbershop";

  useEffect(() => {
    fetchReport();
  }, [dateMonth, viewFilter]);

  const fetchReport = () => {
    setLoading(true);
    // filter reservations yang periodenya masuk bulan ini dan sudah dibayar 
    const allReservations = Storage.get<any[]>('reservations', []);
    
    const userStr = localStorage.getItem("admin_user");
    const currentUser = userStr ? JSON.parse(userStr) : null;

    let monthlyBookings = allReservations.filter((r: any) => {
      // asumsi format r.booking_date adalah YYYY-MM-DD
      return typeof r.booking_date === 'string' && r.booking_date.startsWith(dateMonth) &&
             r.payment?.status === 'paid';
    });

    if (viewFilter === 'saya' && currentUser) {
      monthlyBookings = monthlyBookings.filter((r: any) => r.capster?.name?.toLowerCase() === currentUser.name.toLowerCase());
    }

    setBookings(monthlyBookings);

    setReportData({
        total_revenue: monthlyBookings.reduce((sum: number, r: any) => sum + (r.payment?.amount || 0), 0),
        total_bookings: monthlyBookings.length
    });

    setLoading(false);
  };

  const exportToExcel = () => {
    if (!bookings.length) return alert('No data to export');

    const dataForExcel = bookings.map(r => {
      return {
        'Tanggal & Jam': `${r.booking_date} ${r.start_time}`,
        'Kode Antrean': r.queue_number || '-',
        'Nama Pelanggan': r.customer_name,
        'Kapster': r.capster?.name || '-',
        'Layanan': r.service?.name || '-',
        'Pendapatan (Rp)': r.payment?.amount || 0
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Pendapatan");
    
    XLSX.utils.sheet_add_aoa(worksheet, [["", "", "", "", "TOTAL", reportData?.total_revenue || 0]], { origin: -1 });

    XLSX.writeFile(workbook, `Laporan_${shopName.replace(/\s+/g, '')}_${dateMonth}.xlsx`);
  };

  return (
    <div>
      <TitleSection>
        <h1>Analisis Pendapatan</h1>
        <p>Pantau pertumbuhan dan performa bisnis Anda</p>
      </TitleSection>

      <RevenueCard>
        <div className="label-group">
          <div className="icon-box"><Calculator size={26} /></div>
          <div>
            <h3>Total Pendapatan Bulanan</h3>
            <div className="value">Rp {reportData?.total_revenue?.toLocaleString('id-ID') || 0}</div>
          </div>
        </div>
        <div className="trend">
          <TrendingUp size={18} />
          {reportData?.total_bookings || 0} Pesanan Selesai
        </div>
      </RevenueCard>

      <TableCard>
        <Toolbar>
           <div style={{display:'flex', gap:'16px', alignItems:'center'}}>
             <input type="month" className="period-picker" value={dateMonth} onChange={e=>setDateMonth(e.target.value)} />
             <div className="view-toggle">
               <button className={viewFilter === 'saya' ? 'active' : ''} onClick={() => setViewFilter('saya')}>Pendapatan Saya</button>
               <button className={viewFilter === 'semua' ? 'active' : ''} onClick={() => setViewFilter('semua')}>Pendapatan Semua</button>
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
          <Table>
            <thead>
              <tr>
                <th>Tanggal & Jam</th>
                <th>Kode</th>
                <th>Nama Pelanggan</th>
                <th>Kapster</th>
                <th>Total Harga</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr><td colSpan={5} style={{textAlign:'center', color:C.textMuted, padding:'48px'}}>Data tidak ditemukan untuk periode ini.</td></tr>
              )}
              {bookings.map(r => (
                <tr key={r.id}>
                  <td style={{ color: C.textMuted }}>{r.booking_date} {r.start_time}</td>
                  <td><span style={{ fontWeight: 800 }}>{r.queue_number || '-'}</span></td>
                  <td>
                    <div style={{fontWeight:700}}>{r.customer_name}</div>
                    <div style={{fontSize:'12px', color:C.textMuted}}>{r.type}</div>
                  </td>
                  <td>{r.capster?.name || '-'}</td>
                  <td><span style={{fontWeight:800, color:C.success}}>Rp {r.payment?.amount?.toLocaleString('id-ID')}</span></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableCard>
    </div>
  );
};
