import { useEffect, useState, useRef } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  PieChart, CalendarDays, Clock, Wallet, Users, LogOut, Bell
} from 'lucide-react';
import { initAdminStorage } from '@/services/storage';

const C = {
  primary: '#0F172A',
  accent: '#C0392B',
  blue: '#3B82F6',
  bg: '#F8FAFC',
  border: '#E2E8F0',
  text: '#1E293B',
  textMuted: '#64748B',
  sidebarBg: '#FFFFFF',
  navActive: '#F1F5F9'
};

const AppContainer = styled.div`
  display: flex; height: 100vh; width: 100vw; background: ${C.bg}; font-family: 'Inter', sans-serif; overflow: hidden;
`;

const Sidebar = styled.div`
  width: 260px; background: ${C.sidebarBg}; color: ${C.text}; display: flex; flex-direction: column; z-index: 10; border-right: 1px solid ${C.border};
`;

const SidebarHeader = styled.div`
  height: 80px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid ${C.border}; gap: 12px;
  .logo-box {
    width: 32px; height: 32px; background: ${C.accent}; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    img { width: 22px; height: 22px; filter: brightness(0) invert(1); }
  }
  span { font-size: 20px; font-weight: 800; color: ${C.primary}; letter-spacing: -0.5px; b { color: ${C.accent}; } }
`;

const NavList = styled.nav`
  flex: 1; padding: 24px 16px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto;
`;

const StyledNavLink = styled(NavLink)`
  display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px;
  color: ${C.textMuted}; text-decoration: none; font-weight: 500; font-size: 14px; transition: all 0.2s;
  &:hover { background: ${C.bg}; color: ${C.primary}; }
  &.active { background: ${C.navActive}; color: ${C.accent}; font-weight: 700; svg { color: ${C.accent}; } }
`;

const LogoutBtn = styled.button`
  display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin: 16px; border-radius: 10px;
  background: ${C.bg}; color: ${C.textMuted}; border: 1px solid ${C.border}; font-size: 14px; font-weight: 500; cursor: pointer; transition: 0.2s;
  &:hover { background: #FEF2F2; color: #EF4444; border-color: #FEE2E2; }
`;

const MainContainer = styled.div`
  flex: 1; display: flex; flex-direction: column; overflow: hidden;
`;

const TopBar = styled.header`
  height: 80px; background: white; border-bottom: 1px solid ${C.border}; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; z-index: 5;
`;

const LeftSection = styled.div` display: flex; align-items: center; gap: 16px; `;
const PageTitle = styled.h2` font-size: 18px; font-weight: 700; color: ${C.text}; margin: 0; `;

const TopActions = styled.div` display: flex; align-items: center; gap: 16px; position: relative; `;
const DateTimeBox = styled.div`
  display: flex; flex-direction: column; align-items: flex-end; gap: 2px; padding: 0 16px; border-right: 1px solid ${C.border};
  .day { font-size: 13px; font-weight: 700; color: ${C.text}; }
  .time { font-size: 11px; font-weight: 800; color: ${C.blue}; letter-spacing: 0.5px; opacity: 0.8; }
`;

const AdminInfo = styled.div`
  display: flex; align-items: center; gap: 10px; margin-left: 8px; cursor: pointer;
  .details { display: flex; flex-direction: column; align-items: flex-start; span { font-size: 13px; font-weight: 700; color: ${C.text}; } small { font-size: 10px; font-weight: 600; color: ${C.textMuted}; text-transform: uppercase; } }
`;

const IconBtn = styled.button`
  background: transparent; border: none; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: ${C.textMuted}; cursor: pointer; transition: 0.2s; position: relative;
  &:hover { color: ${C.text}; background: ${C.bg}; }
  &.has-badge::after { content: attr(data-count); position: absolute; top: 4px; right: 4px; min-width: 16px; height: 16px; background: ${C.accent}; color: white; border-radius: 50%; font-size: 9px; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid white; }
`;

const Avatar = styled.div`
  width: 40px; height: 40px; border-radius: 12px; background: ${C.accent}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(192, 57, 43, 0.2); transition: 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(192, 57, 43, 0.3); }
`;

const NotifPopover = styled.div`
  position: absolute; top: 70px; right: 0; width: 320px; background: white; border-radius: 16px; border: 1px solid ${C.border}; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden; z-index: 100; animation: slideDown 0.2s ease-out;
  @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  .header { padding: 16px; border-bottom: 1px solid ${C.border}; display: flex; justify-content: space-between; align-items: center; h3 { font-size: 14px; font-weight: 700; margin: 0; } button { background: none; border: none; font-size: 11px; font-weight: 700; color: ${C.blue}; cursor: pointer; } }
  .list { max-height: 360px; overflow-y: auto; .item { padding: 14px 16px; border-bottom: 1px solid ${C.bg}; cursor: pointer; transition: 0.2s; &:hover { background: ${C.bg}; } &.unread { background: #F0F9FF; } h4 { font-size: 13px; font-weight: 700; margin-bottom: 4px; } p { font-size: 12px; color: ${C.textMuted}; line-height: 1.4; margin: 4px 0; } .time { font-size: 10px; color: ${C.textMuted}; } } }
  .footer { padding: 12px; text-align: center; border-top: 1px solid ${C.border}; font-size: 12px; color: ${C.textMuted}; font-weight: 600; cursor: pointer; &:hover { color: ${C.primary}; } }
`;

const ContentScroller = styled.div` flex: 1; overflow-y: auto; padding: 32px; `;

export const AdminLayout = () => {
  const location = useLocation();
  // Data statis — tanpa API call
  const profile = { name: 'Super Admin', barbershop: 'BarberFlow Staff' };
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifs] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initAdminStorage();
    document.title = 'BarberFlow';
    const link: any = document.querySelector("link[rel~='icon']");
    if (link) link.href = '/barberFlow.png';
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setShowNotifs(false);
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => { clearInterval(timer); document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const currentDateText = format(currentTime, 'EEEE, d MMM yyyy', { locale: id });
  const timeText = format(currentTime, 'HH:mm') + ' WIB';
  const unreadCount = notifs.filter(n => !n.read_at).length;

  const handleLogout = () => { if(confirm('Yakin ingin keluar?')) { window.location.href = '/'; } }

  const getPageTitle = (path: string) => {
    if (path === '/admin') return 'Dashboard Overview';
    if (path === '/admin/reservations') return 'Order Management';
    if (path === '/admin/slots') return 'Schedule Management';
    if (path === '/admin/revenue') return 'Revenue Analytics';
    if (path === '/admin/data') return 'Master Data';
    return 'Admin Panel';
  }

  return (
    <AppContainer>
      <Sidebar>
        <SidebarHeader>
          <div className="logo-box"><img src="/barberFlow.png" alt="Logo" onError={(e:any) => e.target.style.display='none'} /></div>
          <span>Barber<b>ku</b></span>
        </SidebarHeader>
        <NavList>
          <StyledNavLink to="/admin" end><PieChart size={20} /> Dashboard</StyledNavLink>
          <StyledNavLink to="/admin/reservations"><CalendarDays size={20} /> Order List</StyledNavLink>
          <StyledNavLink to="/admin/slots"><Clock size={20} /> Slot Management</StyledNavLink>
          <StyledNavLink to="/admin/revenue"><Wallet size={20} /> Revenue</StyledNavLink>
          <StyledNavLink to="/admin/data"><Users size={20} /> Master Data</StyledNavLink>
        </NavList>
        <LogoutBtn onClick={handleLogout}><LogOut size={20} /> Logout</LogoutBtn>
      </Sidebar>
      
      <MainContainer>
        <TopBar>
          <LeftSection><PageTitle>{getPageTitle(location.pathname)}</PageTitle></LeftSection>
          <TopActions>
            <DateTimeBox><div className="day">{currentDateText}</div><div className="time">{timeText}</div></DateTimeBox>
            
            <IconBtn 
              className={unreadCount > 0 ? "has-badge" : ""} 
              data-count={unreadCount}
              onClick={() => setShowNotifs(!showNotifs)}
              title="Notifications"
            >
              <Bell size={20} />
            </IconBtn>

            {showNotifs && (
              <NotifPopover ref={popoverRef}>
                <div className="header">
                  <h3>Notifications</h3>
                </div>
                <div className="list">
                  <div style={{padding:'32px', textAlign:'center', fontSize:'12px', color:C.textMuted}}>No notifications</div>
                </div>
                <div className="footer" onClick={() => setShowNotifs(false)}>Close</div>
              </NotifPopover>
            )}
            
            <AdminInfo onClick={() => alert(`Profil Admin: ${profile?.name || 'Loading...'}`)}>
              <div className="details">
                <span>{profile?.name || 'Super Admin'}</span>
                <small>{profile?.barbershop || 'BarberFlow Staff'}</small>
              </div>
              <Avatar>{profile?.name ? profile.name[0] : 'A'}</Avatar>
            </AdminInfo>
          </TopActions>
        </TopBar>
        <ContentScroller><Outlet /></ContentScroller>
      </MainContainer>
    </AppContainer>
  );
};
