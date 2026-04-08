import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import { LogIn, Lock, Mail, ArrowLeft } from 'lucide-react'

const C = {
  primary: '#1A1A18', // Deep Charcoal
  accent: '#C8A96E',  // Pointcut Gold
  bg: '#F4EDE3',      // Pointcut Cream
  border: '#E0D8CE',  // Pointcut Border
  text: '#1A1A18',
  textMuted: '#888888',
  white: '#FFFFFF'
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const GS = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: ${C.bg}; color: ${C.text}; overflow: hidden; }
`;

const PageWrap = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: ${C.white};
`;

const HeroSide = styled.div`
  flex: 1.2;
  background: ${C.primary};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: ${C.white};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80');
    background-size: cover;
    background-position: center;
    opacity: 0.3;
    z-index: 1;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(26,26,24,0.4), rgba(26,26,24,0.9));
    z-index: 2;
  }

  .content {
    position: relative;
    z-index: 3;
    text-align: center;
    max-width: 480px;
    padding: 40px;
    
    .logo-badge {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      color: ${C.accent};
      margin-bottom: 24px;
      display: inline-block;
      letter-spacing: 4px;
      text-transform: uppercase;
    }

    h1 { font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 700; margin-bottom: 20px; }
    p { font-size: 18px; color: rgba(255,255,255,0.7); line-height: 1.6; font-weight: 300; }
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

const BackLink = styled(Link)`
  position: absolute;
  top: 40px;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${C.textMuted};
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: 0.2s;
  &:hover { color: ${C.primary}; transform: translateX(-4px); }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.div`
  margin-bottom: 40px;
  h2 { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: ${C.primary}; margin-bottom: 8px; }
  p { color: ${C.textMuted}; font-size: 15px; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label { font-size: 12px; font-weight: 700; color: ${C.primary}; text-transform: uppercase; letter-spacing: 1.5px; }
  
  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    
    svg { position: absolute; left: 0; color: ${C.primary}; width: 18px; opacity: 0.3; }
    
    input {
      width: 100%;
      padding: 12px 0 12px 32px;
      background: transparent;
      border: none;
      border-bottom: 2px solid ${C.border};
      font-size: 16px;
      color: ${C.text};
      transition: all 0.3s;
      outline: none;
      
      &:focus { border-color: ${C.accent}; }
      &::placeholder { color: #BBB; }
    }
  }
`;

const SubmitBtn = styled.button`
  background: ${C.primary};
  color: white;
  padding: 18px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s;
  margin-top: 10px;

  &:hover { background: ${C.accent}; transform: translateY(-2px); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const Footer = styled.div`
  margin-top: 40px;
  text-align: center;
  font-size: 14px;
  color: ${C.textMuted};
  
  a { color: ${C.primary}; font-weight: 700; text-decoration: none; border-bottom: 1px solid ${C.accent}; &:hover { color: ${C.accent}; } }
`;

export function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.title = "Login - Pointcut Barbershop";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulasi — tanpa API call
    await new Promise(r => setTimeout(r, 1000))
    navigate('/booking')
    setIsLoading(false)
  }

  return (
    <>
      <GS />
      <PageWrap>
        <HeroSide>
          <div className="overlay" />
          <div className="content">
            <span className="logo-badge">Est. 2024</span>
            <h1>Classic Elegance, Modern Style.</h1>
            <p>Masuk untuk menjadwalkan sesi grooming terbaik Anda dan nikmati layanan dari kapster ahli kami.</p>
          </div>
        </HeroSide>

        <FormSide>
          <BackLink to="/">
            <ArrowLeft size={18} /> BACK TO HOME
          </BackLink>
          
          <FormCard>
            <Header>
              <h2>Welcome Back</h2>
              <p>Enter your details to access your account.</p>
            </Header>

            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <label>Email Address</label>
                <div className="input-wrap">
                  <Mail />
                  <input 
                    type="email" 
                    required 
                    value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})} 
                    placeholder="john@example.com" 
                  />
                </div>
              </InputGroup>

              <InputGroup>
                <label>Security Password</label>
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
                {isLoading ? 'Processing...' : (
                  <>
                    Sign In Now <LogIn size={18} />
                  </>
                )}
              </SubmitBtn>
            </Form>

            <Footer>
              Don't have an account? <Link to="/register">Create one for free</Link>
            </Footer>
          </FormCard>
        </FormSide>
      </PageWrap>
    </>
  )
}
