import { useState } from 'react';
import styled from 'styled-components';
import { User, Lock, Mail, Camera } from 'lucide-react';
import { currentUser } from '@/services/storage';

const C = {
  primary: '#0F172A',
  accent: '#C0392B',
  blue: '#3B82F6',
  bg: '#F8FAFC',
  border: '#E2E8F0',
  text: '#1E293B',
  textMuted: '#64748B',
  card: '#FFFFFF'
};

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  .header {
    margin-bottom: 24px;
    h1 { font-size: 24px; font-weight: 700; color: ${C.primary}; margin-bottom: 8px; }
    p { color: ${C.textMuted}; font-size: 14px; }
  }
`;

const FormCard = styled.div`
  background: ${C.card};
  border-radius: 16px;
  border: 1px solid ${C.border};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${C.border};
  h2 { font-size: 16px; font-weight: 700; color: ${C.primary}; }
`;

const CardBody = styled.div`
  padding: 24px;
  display: flex;
  gap: 32px;
  @media (max-width: 768px) { flex-direction: column; }
`;

const ProfilePicSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 200px;
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: ${C.bg};
    border: 1px solid ${C.border};
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-size: 40px;
    color: ${C.textMuted};
    font-weight: 700;
    
    .edit-btn {
       position: absolute;
       bottom: 0;
       right: 0;
       width: 36px;
       height: 36px;
       border-radius: 50%;
       background: white;
       border: 1px solid ${C.border};
       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
       display: flex;
       align-items: center;
       justify-content: center;
       color: ${C.textMuted};
       cursor: pointer;
       transition: 0.2s;
       &:hover { color: ${C.blue}; }
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
  label {
    display: block; font-size: 13px; font-weight: 600; color: ${C.textMuted}; margin-bottom: 8px;
  }
  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    svg { position: absolute; left: 16px; color: ${C.textMuted}; }
    input {
       width: 100%;
       padding: 12px 16px 12px 44px;
       border: 1px solid ${C.border};
       border-radius: 8px;
       font-size: 14px;
       color: ${C.text};
       outline: none;
       transition: 0.2s;
       &:focus { border-color: ${C.blue}; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
       &:disabled { background: ${C.bg}; color: ${C.textMuted}; cursor: not-allowed; }
    }
  }
`;

const BtnPrimary = styled.button`
  background: ${C.accent};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: #B91C1C; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export function AdminProfilePage() {
  const [name, setName] = useState(currentUser.name || '');
  const [email] = useState(currentUser.email || ''); // Email tak bisa diganti
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      currentUser.name = name;
      setMsg({ text: 'Profil berhasil diperbarui.', type: 'success' });
      setIsLoading(false);
      setTimeout(() => setMsg({text:'', type:''}), 3000);
    }, 600);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if(password !== confirmPassword) {
       setMsg({ text: 'Password konfirmasi tidak cocok.', type: 'error' });
       setTimeout(() => setMsg({text:'', type:''}), 3000);
       return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setMsg({ text: 'Password berhasil diperbarui.', type: 'success' });
      setPassword('');
      setConfirmPassword('');
      setIsLoading(false);
      setTimeout(() => setMsg({text:'', type:''}), 3000);
    }, 600);
  };

  return (
    <PageContainer>
      <div className="header">
        <h1>Pengaturan Profil</h1>
        <p>Kelola informasi akun dan amankan kredensial Anda.</p>
      </div>

      {msg.text && (
        <div style={{ padding: '16px', background: msg.type === 'success' ? '#ECFDF5' : '#FEF2F2', color: msg.type === 'success' ? '#059669' : '#DC2626', borderRadius: '8px', border: `1px solid ${msg.type === 'success' ? '#D1FAE5' : '#FEE2E2'}`, marginBottom: '24px', fontSize: '14px', fontWeight: 600 }}>
          {msg.text}
        </div>
      )}

      <FormCard>
        <CardHeader><h2>Informasi Dasar</h2></CardHeader>
        <CardBody>
          <ProfilePicSection>
             <div className="avatar">
                {name ? name[0].toUpperCase() : 'A'}
                <div className="edit-btn"><Camera size={16} /></div>
             </div>
             <p style={{fontSize:'13px', color:C.textMuted, textAlign:'center'}}>Format JPG/PNG maksimal 2MB.</p>
          </ProfilePicSection>
          
          <div style={{flex: 1}}>
             <form onSubmit={handleUpdateProfile}>
               <FormGroup>
                 <label>Alamat Email (Tidak bisa diubah)</label>
                 <div className="input-wrap">
                   <Mail size={18} />
                   <input type="email" value={email} disabled />
                 </div>
               </FormGroup>
               <FormGroup>
                 <label>Nama Lengkap / Panggilan</label>
                 <div className="input-wrap">
                   <User size={18} />
                   <input type="text" value={name} onChange={e=>setName(e.target.value)} required />
                 </div>
               </FormGroup>
               <BtnPrimary type="submit" disabled={isLoading}>Simpan Perubahan</BtnPrimary>
             </form>
          </div>
        </CardBody>
      </FormCard>

      <FormCard>
        <CardHeader><h2>Keamanan & Sandi</h2></CardHeader>
        <CardBody style={{flexDirection: 'column', gap: '0'}}>
             <form onSubmit={handleUpdatePassword}>
               <FormGroup style={{maxWidth: '400px'}}>
                 <label>Password Baru</label>
                 <div className="input-wrap">
                   <Lock size={18} />
                   <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
                 </div>
               </FormGroup>
               <FormGroup style={{maxWidth: '400px'}}>
                 <label>Ulangi Password Baru</label>
                 <div className="input-wrap">
                   <Lock size={18} />
                   <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required />
                 </div>
               </FormGroup>
               <BtnPrimary type="submit" disabled={isLoading}>Update Password</BtnPrimary>
             </form>
        </CardBody>
      </FormCard>
    </PageContainer>
  );
}
