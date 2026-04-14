import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Plus, Wallet, DollarSign, ShoppingCart } from 'lucide-react';
import { Storage } from '@/services/storage';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

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

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
`;

const Greeting = styled.div`
  h1 { font-size: 28px; font-weight: 800; color: ${C.primary}; margin-bottom: 6px; letter-spacing: -0.5px; }
  p { font-size: 14px; color: ${C.textMuted}; font-weight: 500; }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
  
  @media(max-width: 1200px){ gap: 16px; }
  @media(max-width: 1024px){ grid-template-columns: repeat(2, 1fr); }
  @media(max-width: 640px){ grid-template-columns: 1fr; }
`;

const StatCard = styled.div<{ $primary?: boolean }>`
  background: ${p => p.$primary ? C.primary : 'white'};
  padding: 24px;
  border-radius: 16px;
  border: ${p => p.$primary ? 'none' : `1px solid ${C.border}`};
  box-shadow: ${p => p.$primary ? '0 10px 25px -5px rgba(15, 23, 42, 0.2)' : '0 1px 3px rgba(0,0,0,0.02)'};
  color: ${p => p.$primary ? 'white' : C.text};
  position: relative;

  .header {
    display: flex; justify-content: space-between; align-items: flex-start;
    h3 { font-size: 14px; font-weight: 600; color: ${p => p.$primary ? 'rgba(255,255,255,0.7)' : C.textMuted}; }
  }
  
  .value {
    font-size: 28px; font-weight: 800; margin: 16px 0 8px;
    display: flex; align-items: center; gap: 10px;
    letter-spacing: -0.5px;
  }

  .sub { font-size: 12px; font-weight: 500; color: ${p => p.$primary ? 'rgba(255,255,255,0.5)' : C.textMuted}; }
  
  .icon-wrap {
    width: 36px; height: 36px; border-radius: 10px;
    background: ${p => p.$primary ? 'rgba(255,255,255,0.1)' : C.bg};
    display: flex; align-items: center; justify-content: center;
    color: ${p => p.$primary ? 'white' : C.textMuted};
  }
`;

const BigChartCard = styled.div`
  background: white;
  padding: 28px;
  border-radius: 20px;
  border: 1px solid ${C.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  margin-bottom: 24px;

  .header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 32px;
    
    h3 { font-size: 18px; font-weight: 700; color: ${C.primary}; margin: 0; }
    p { font-size: 13px; color: ${C.textMuted}; margin-top: 4px; font-weight: 500; }
  }
`;

const ActionCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${C.border};
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: ${C.blue}; }

  .icon {
    width: 48px; height: 48px; border-radius: 12px; background: ${C.bg};
    display: flex; align-items: center; justify-content: center; color: ${C.primary};
  }

  h4 { font-size: 15px; font-weight: 700; color: ${C.primary}; margin-bottom: 2px; }
  p { font-size: 13px; color: ${C.textMuted}; }
`;

export const DashboardPage = () => {
  const [data, setData] = useState({
    todayRevenue: 0,
    todayExpense: 0,
    todayBookings: 0,
    monthRevenue: 0,
    monthExpense: 0,
    monthNetProfit: 0,
    last7Days: [] as any[]
  });

  const userStr = localStorage.getItem("admin_user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const adminName = currentUser?.name || "Superadmin";

  useEffect(() => {
    const allReservations = Storage.get<any[]>('reservations', []);
    const allExpenses = Storage.get<any[]>('expenses', []);
    const today = new Date().toISOString().slice(0, 10);
    const month = today.slice(0, 7);

    // Last 7 Days setup
    const last7DaysData = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { 
        fullDate: d.toISOString().slice(0,10), 
        label: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }), 
        rev: 0, 
        exp: 0 
      };
    });

    let todayRev = 0;
    let monthRev = 0;
    let todayBookings = 0;

    allReservations.forEach(r => {
      const isPaid = r.payment?.status === 'paid';
      const amt = r.payment?.amount || 0;
      
      if (r.booking_date) {
        if (r.booking_date === today) {
           if(isPaid) todayRev += amt;
           todayBookings++;
        }
        if (r.booking_date.startsWith(month)) {
           if(isPaid) monthRev += amt;
        }

        if (isPaid) {
          const dayMatch = last7DaysData.find(d => d.fullDate === r.booking_date);
          if (dayMatch) dayMatch.rev += amt;
        }
      }
    });

    let todayExp = 0;
    let monthExp = 0;

    allExpenses.forEach(e => {
       if (e.date) {
         const amt = Number(e.amount) || 0;
         if (e.date === today) todayExp += amt;
         if (e.date.startsWith(month)) monthExp += amt;

         const dayMatch = last7DaysData.find(d => d.fullDate === e.date);
         if (dayMatch) dayMatch.exp += amt;
       }
    });

    setData({
      todayRevenue: todayRev,
      todayExpense: todayExp,
      todayBookings,
      monthRevenue: monthRev,
      monthExpense: monthExp,
      monthNetProfit: monthRev - monthExp,
      last7Days: last7DaysData
    });
    
  }, []);

  const chartData = useMemo(() => {
    if (!data?.last7Days) return { labels: [], revData: [], expData: [] };
    return {
        labels: data.last7Days.map((s:any) => s.label),
        revData: data.last7Days.map((s:any) => s.rev),
        expData: data.last7Days.map((s:any) => s.exp)
    };
  }, [data]);

  const barChartConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Pendapatan',
        data: chartData.revData,
        backgroundColor: '#10B981', 
        borderRadius: 6,
        barThickness: 18,
      },
      {
        label: 'Pengeluaran',
        data: chartData.expData,
        backgroundColor: '#EF4444', 
        borderRadius: 6,
        barThickness: 18,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: { 
      legend: { display: true, position: 'top' as const, labels: { usePointStyle: true, boxWidth: 8 } } 
    },
    scales: {
      y: { border: { display: false }, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } },
      x: { border: { display: false }, grid: { display: false }, ticks: { color: '#94a3b8' } }
    }
  };


  return (
    <div>
      <TopRow>
        <Greeting>
          <h1>Halo, {adminName}! 👋</h1>
          <p>Inilah yang terjadi di tokomu hari ini.</p>
        </Greeting>
      </TopRow>

      <StatsGrid>
        <StatCard $primary>
          <div className="header">
            <h3>Pendapatan Hari Ini</h3>
            <div className="icon-wrap"><ArrowUpRight size={16} /></div>
          </div>
          <div className="value">
            Rp {data.todayRevenue.toLocaleString('id-ID')}
          </div>
          <p className="sub">{data.todayBookings} Pesanan Hari Ini</p>
        </StatCard>

        <StatCard>
          <div className="header">
            <h3>Pengeluaran Hari Ini</h3>
            <div className="icon-wrap"><ArrowDownRight size={16} color={C.accent} /></div>
          </div>
          <div className="value">
            Rp {data.todayExpense.toLocaleString('id-ID')}
          </div>
          <p className="sub">Biaya Operasional Harian</p>
        </StatCard>

        <StatCard>
          <div className="header">
            <h3>Pendapatan Bulan Ini</h3>
            <div className="icon-wrap"><Wallet size={16} color={C.blue} /></div>
          </div>
          <div className="value">
            Rp {data.monthRevenue.toLocaleString('id-ID')}
          </div>
          <p className="sub">Total Omzet Bulan Ini</p>
        </StatCard>

        <StatCard>
          <div className="header">
            <h3>Laba Bersih Bulanan</h3>
            <div className="icon-wrap"><DollarSign size={16} color={C.success} /></div>
          </div>
          <div className="value">
            Rp {data.monthNetProfit.toLocaleString('id-ID')}
          </div>
          <p className="sub">Pendapatan - Pengeluaran Bulanan</p>
        </StatCard>
      </StatsGrid>

      <BigChartCard>
        <div className="header">
          <div>
            <h3>Arus Kas 7 Hari Terakhir</h3>
            <p>Perbandingan pendapatan dan biaya operasional toko</p>
          </div>
          <div className="icon-wrap">
            <TrendingUp size={20} color={C.blue} />
          </div>
        </div>
        <Bar data={barChartConfig} options={chartOptions as any} height={80} />
      </BigChartCard>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <ActionCard onClick={() => window.location.href = '/admin/reservations'}>
          <div className="icon"><Plus size={24} /></div>
          <div>
            <h4>Registrasi Cepat</h4>
            <p>Tambah pelanggan walk-in</p>
          </div>
        </ActionCard>
        <ActionCard onClick={() => window.location.href = '/admin/expenses'}>
          <div className="icon"><ShoppingCart size={24} /></div>
          <div>
            <h4>Catat Pengeluaran</h4>
            <p>Tambah data operasional</p>
          </div>
        </ActionCard>
        <ActionCard onClick={() => window.location.href = '/admin/profit'}>
          <div className="icon"><DollarSign size={24} /></div>
          <div>
            <h4>Laba Bersih</h4>
            <p>Lihat detail ringkasan</p>
          </div>
        </ActionCard>
      </div>
    </div>
  );
};
