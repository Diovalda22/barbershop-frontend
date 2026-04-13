import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import { UserPlus, ArrowLeft, ShieldCheck, Mail, Lock, User } from 'lucide-react'

const C = {
  primary: '#0F172A',
  accent: '#C0392B',
  blue: '#3B82F6',
  bg: '#F8FAFC',
  border: '#E2E8F0',
  text: '#1E293B',
  textMuted: '#64748B',
  white: '#FFFFFF'
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const GS = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: ${C.bg}; color: ${C.text}; overflow: hidden; }
`;

const PageWrap = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: white;
`;

const HeroSide = styled.div`
  flex: 1.2;
  background: ${C.primary};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: white;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.15), transparent);
    z-index: 1;
  }

  .content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 480px;
    padding: 40px;
    
    .logo-box {
      width: 80px;
      height: 80px;
      background: ${C.blue};
      border-radius: 20px;
      margin: 0 auto 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
      
      img { width: 50px; height: 50px; }
    }

    h1 { font-size: 42px; font-weight: 900; letter-spacing: -1.5px; margin-bottom: 16px; }
    p { font-size: 18px; color: rgba(255,255,255,0.6); line-height: 1.6; }
  }

  @media(max-width: 900px) { display: none; }
`;

const FormSide = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: ${C.bg};
  position: relative;
`;


const FormCard = styled.div`
  width: 100%;
  max-width: 420px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.div`
  margin-bottom: 40px;
  h2 { font-size: 32px; font-weight: 800; color: ${C.primary}; letter-spacing: -1px; margin-bottom: 8px; }
  p { color: ${C.textMuted}; font-size: 15px; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label { font-size: 13px; font-weight: 700; color: ${C.primary}; text-transform: uppercase; letter-spacing: 0.5px; }
  
  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    
    svg { position: absolute; left: 16px; color: ${C.textMuted}; width: 18px; }
    
    input {
      width: 100%;
      padding: 14px 16px 14px 48px;
      background: white;
      border: 1px solid ${C.border};
      border-radius: 14px;
      font-size: 15px;
      color: ${C.text};
      transition: all 0.2s;
      outline: none;
      
      &:focus { border-color: ${C.blue}; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
      &::placeholder { color: ${C.border}; }
    }
  }
`;

const SubmitBtn = styled.button`
  background: ${C.primary};
  color: white;
  padding: 16px;
  border-radius: 14px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s;
  margin-top: 10px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.1);

  &:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(15, 23, 42, 0.2); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const Footer = styled.div`
  margin-top: 32px;
  text-align: center;
  font-size: 14px;
  color: ${C.textMuted};
  
  a { color: ${C.blue}; font-weight: 700; text-decoration: none; &:hover { text-decoration: underline; } }
`;

export function AdminRegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.title = "Admin Registration - BarberFlow";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    alert('Permintaan pendaftaran berhasil dikirim ke Superadmin.')
    navigate('/admin/login')
    setIsLoading(false)
  }

  return (
    <>
      <GS />
      <PageWrap>
        <HeroSide>
          <div className="content">
            <div className="logo-box">
              <ShieldCheck size={40} color="white" />
            </div>
            <h1>Join the Control Center</h1>
            <p>Daftarkan akun manajerial baru Anda untuk mulai mengelola barbershop secara profesional.</p>
          </div>
        </HeroSide>

        <FormSide>
            <ArrowLeft size={18} /> Kembali ke Login
          
          <FormCard>
            <Header>
              <h2>Buat Akun Manager</h2>
              <p>Silakan isi detail di bawah untuk meminta akses.</p>
            </Header>

            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <label>Nama Lengkap</label>
                <div className="input-wrap">
                  <User />
                  <input 
                    type="text" 
                    required 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    placeholder="Masukkan nama lengkap Anda" 
                  />
                </div>
              </InputGroup>

              <InputGroup>
                <label>Username / Email</label>
                <div className="input-wrap">
                  <Mail />
                  <input 
                    type="text" 
                    required 
                    value={form.username} 
                    onChange={e => setForm({...form, username: e.target.value})} 
                    placeholder="admin@example.com" 
                  />
                </div>
              </InputGroup>

              <InputGroup>
                <label>Password</label>
                <div className="input-wrap">
                  <Lock />
                  <input 
                    type="password" 
                    required 
                    value={form.password} 
                    onChange={e => setForm({...form, password: e.target.value})} 
                    placeholder="••••••••" 
                  />
                </div>
              </InputGroup>

              <SubmitBtn type="submit" disabled={isLoading}>
                {isLoading ? 'Mengirim Permintaan...' : (
                  <>
                    <UserPlus size={20} /> Kirim Pendaftaran
                  </>
                )}
              </SubmitBtn>
            </Form>

            <Footer>
              Sudah punya akun? <Link to="/admin/login">Login di sini</Link>
            </Footer>
          </FormCard>
        </FormSide>
      </PageWrap>
    </>
  )
}
