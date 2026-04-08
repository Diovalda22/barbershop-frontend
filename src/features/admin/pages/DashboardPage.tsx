import { useMemo } from 'react';
import styled from 'styled-components';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ArrowUpRight, TrendingUp, Plus, Users, Wallet } from 'lucide-react';

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
  transition: transform 0.2s;

  &:hover { transform: translateY(-2px); }

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

  &:hover { border-color: ${C.blue}; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }

  .icon {
    width: 48px; height: 48px; border-radius: 12px; background: ${C.bg};
    display: flex; align-items: center; justify-content: center; color: ${C.primary};
  }

  h4 { font-size: 15px; font-weight: 700; color: ${C.primary}; margin-bottom: 2px; }
  p { font-size: 13px; color: ${C.textMuted}; }
`;

export const DashboardPage = () => {
  // Data dummy statis — tanpa API call
  const data = {
    today: { revenue: 850000, total_bookings: 12 },
    queue: { waiting: 3 },
    month_revenue: 18500000,
    popular_services: [
      { service: 'Haircut Senior', count: 45 },
      { service: 'Haircut Junior', count: 30 },
      { service: 'Basic Coloring', count: 20 },
      { service: 'Shaving', count: 15 },
      { service: 'Reservasi', count: 10 },
    ]
  };

  const adminName = "Superadmin";

  const chartData = useMemo(() => {
    if (!data?.popular_services) return { labels: [], data: [] };
    return {
        labels: data.popular_services.map((s:any) => s.service),
        data: data.popular_services.map((s:any) => s.count)
    };
  }, [data]);

  const barChartConfig = {
    labels: chartData.labels,
    datasets: [{
      label: 'Total Orders',
      data: chartData.data,
      backgroundColor: '#3B82F6', 
      borderRadius: 6,
      barThickness: 40,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { border: { display: false }, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } },
      x: { border: { display: false }, grid: { display: false }, ticks: { color: '#94a3b8' } }
    }
  };


  return (
    <div>
      <TopRow>
        <Greeting>
          <h1>Hello, {adminName}! 👋</h1>
          <p>This is what's happening in your store today.</p>
        </Greeting>
      </TopRow>

      <StatsGrid>
        <StatCard $primary>
          <div className="header">
            <h3>Total revenue</h3>
            <div className="icon-wrap"><ArrowUpRight size={16} /></div>
          </div>
          <div className="value">
            Rp {data?.today?.revenue?.toLocaleString('id-ID') || 0}
          </div>
          <p className="sub">Today's Revenue</p>
        </StatCard>

        <StatCard>
          <div className="header">
            <h3>Total orders</h3>
            <div className="icon-wrap"><ArrowUpRight size={16} /></div>
          </div>
          <div className="value">
            {data?.today?.total_bookings || 0}
          </div>
          <p className="sub">Today's Orders</p>
        </StatCard>

        <StatCard>
          <div className="header">
            <h3>Active Queue</h3>
            <div className="icon-wrap"><ArrowUpRight size={16} /></div>
          </div>
          <div className="value">
            {data?.queue?.waiting || 0}
          </div>
          <p className="sub">Waiting Customers</p>
        </StatCard>

        <StatCard>
          <div className="header">
            <h3>Monthly Revenue</h3>
            <div className="icon-wrap"><ArrowUpRight size={16} /></div>
          </div>
          <div className="value">
            Rp {data?.month_revenue?.toLocaleString('id-ID') || 0}
          </div>
          <p className="sub">Current Month Balance</p>
        </StatCard>
      </StatsGrid>

      <BigChartCard>
        <div className="header">
          <div>
            <h3>Popular Services</h3>
            <p>Distribution of your top service offerings</p>
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
            <h4>Quick Registration</h4>
            <p>Add walk-in customer</p>
          </div>
        </ActionCard>
        <ActionCard onClick={() => window.location.href = '/admin/data'}>
          <div className="icon"><Users size={24} /></div>
          <div>
            <h4>Manage Personnel</h4>
            <p>Update kapster data</p>
          </div>
        </ActionCard>
        <ActionCard onClick={() => window.location.href = '/admin/revenue'}>
          <div className="icon"><Wallet size={24} /></div>
          <div>
            <h4>Store Reports</h4>
            <p>Check and export revenue</p>
          </div>
        </ActionCard>
      </div>
    </div>
  );
};
