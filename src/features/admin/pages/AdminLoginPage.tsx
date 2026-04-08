import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components'
import { LogIn, Lock, Mail, ArrowLeft } from 'lucide-react'

const C = {
  red: '#C0392B',
  blue: '#2980B9',
  blueLight: '#3498DB',
  bg: '#f8fafc',
  border: '#e2e8f0',
  text: '#0f172a',
  textMuted: '#64748b'
};

const GS = createGlobalStyle`
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Inter', sans-serif;background:${C.bg};color:${C.text};overflow:hidden;}
`

const SplitWrap = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const LeftSide = styled.div`
  flex: 1;
  background: ${C.blue};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
  padding: 40px;
  
  img {
    width: 100%;
    max-width: 300px;
    object-fit: contain;
    margin-bottom: 24px;
  }
    
  h2 {
    font-weight: 500;
    font-size: 20px;
    opacity: 0.8;
  }

  @media(max-width: 768px) {
    display: none;
  }
`;

const RightSide = styled.div`
  flex: 1;
  max-width: 500px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-shadow: -10px 0 30px rgba(0,0,0,0.05);
  z-index: 2;
`;

const FormBox = styled.div`
  width: 100%;
  max-width: 360px;
`;

const Title = styled.h1`font-size:28px;color:${C.text};margin-bottom:16px;font-weight:700;`
const Sub = styled.p`font-size:15px;color:${C.textMuted};margin-bottom:32px`

const Form = styled.form`display:flex;flex-direction:column;gap:20px;text-align:left`
const Label = styled.label`font-size:13px;font-weight:600;color:#334155`
const Input = styled.input`
  width:100%;
  background:${C.bg};
  border:1px solid ${C.border};
  border-radius:8px;
  padding:14px 16px;
  color:${C.text};
  font-size:14px;
  outline:none;
  transition:.2s;
  margin-top:8px;
  &:focus{border-color:${C.blueLight};box-shadow:0 0 0 3px rgba(37,99,235,0.1)}
`

const BtnSubmit = styled.button`
  background:${C.red};
  color:#fff;
  font-size:15px;
  font-weight:600;
  border-radius:8px;
  padding:14px;
  border:none;
  margin-top:12px;
  cursor:pointer;
  transition:.2s;
  &:hover{background:#b91c1c}
  &:disabled{opacity:0.6;cursor:not-allowed}
`;

const ErrorMsg = styled.div`
  background: #FEF2F2;
  color: #B91C1C;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
  border: 1px solid #FEE2E2;
`;

const LinkText = styled.p`
  font-size:14px;color:${C.textMuted};margin-top:32px;text-align:center;
  a{color:${C.blueLight};text-decoration:none;font-weight:600;&:hover{text-decoration:underline}}
`

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Simulasi — tanpa API call
    await new Promise(r => setTimeout(r, 1000))
    navigate('/admin')
    setIsLoading(false)
  }

  return (
    <>
      <GS />
      <SplitWrap>
        <LeftSide>
          <img src="/barberFlow.png" alt="BarberFlow Hub" onError={(e) => { e.currentTarget.style.display='none'; }}/>
          <h2>Aplikasi Manajemen Barbershop</h2>
        </LeftSide>
        <RightSide>
          <FormBox>
            <Title>Admin Login</Title>
            <Sub>Selamat datang kembali! Silakan masuk ke dashboard Anda.</Sub>

            {error && <ErrorMsg>{error}</ErrorMsg>}
            
            <Form onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email Address
                  <div style={{position:'relative', display:'flex', alignItems:'center'}}>
                    <Mail size={18} style={{position:'absolute', left:'12px', color:C.textMuted}} />
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      value={form.email} 
                      onChange={e => setForm({...form, email: e.target.value})} 
                      placeholder="admin@pointcut.com" 
                      style={{paddingLeft:'40px'}}
                    />
                  </div>
                </Label>
              </div>
              <div>
                <Label htmlFor="password">Password
                  <div style={{position:'relative', display:'flex', alignItems:'center'}}>
                    <Lock size={18} style={{position:'absolute', left:'12px', color:C.textMuted}} />
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      value={form.password} 
                      onChange={e => setForm({...form, password: e.target.value})} 
                      placeholder="••••••••" 
                      style={{paddingLeft:'40px'}}
                    />
                  </div>
                </Label>
              </div>
              <BtnSubmit type="submit" disabled={isLoading}>
                {isLoading ? 'Memproses...' : (
                  <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                    MASUK KE DASHBOARD <LogIn size={18} />
                  </div>
                )}
              </BtnSubmit>
            </Form>

            <LinkText>Belum didaftarkan? <Link to="/admin/register">Hubungi Superadmin</Link></LinkText>
            <LinkText style={{marginTop:'14px', fontSize:'13px'}}>
              <Link to="/" style={{color:C.textMuted, display:'flex', alignItems:'center', justifyContent:'center', gap:'4px'}}>
                <ArrowLeft size={14} /> Kembali ke Beranda
              </Link>
            </LinkText>
          </FormBox>
        </RightSide>
      </SplitWrap>
    </>
  )
}
