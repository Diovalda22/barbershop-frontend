import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components'

const C = {
  dark: '#1a1a18', dark2: '#2a2520', cream: '#f4ede3', beige: '#ede6db',
  gold: '#c8a96e', white: '#fff', muted: '#888', text: '#1a1a18',
  border: '#e0d8ce', fS: "'Playfair Display',serif", fB: "'DM Sans',sans-serif", fO: "'Oswald',sans-serif"
}

const GS = createGlobalStyle`
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:${C.fB};background:${C.cream};color:${C.text};overflow-x:hidden}
`

const Wrap = styled.div`min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;background:url('/hero_bg.png') center/cover no-repeat;position:relative;&::before{content:'';position:absolute;inset:0;background:rgba(26,26,24,0.85);z-index:0}`
const Card = styled.div`width:100%;max-width:400px;background:${C.dark2};padding:40px;border:1px solid rgba(255,255,255,.1);position:relative;z-index:1;text-align:center`
const Logo = styled.img`height:40px;margin:0 auto 20px`
const Title = styled.h1`font-family:${C.fS};font-size:28px;color:${C.white};margin-bottom:8px`
const Sub = styled.p`font-size:13px;color:rgba(255,255,255,.6);margin-bottom:32px`

const Form = styled.form`display:flex;flex-direction:column;gap:16px;text-align:left`
const Label = styled.label`font-family:${C.fO};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${C.gold}`
const Input = styled.input`width:100%;background:rgba(0,0,0,.2);border:1px solid rgba(255,255,255,.1);padding:14px;color:${C.white};font-family:${C.fB};font-size:14px;outline:none;transition:.2s;&:focus{border-color:${C.gold}}`

const BtnGold = styled.button`background:${C.gold};color:#fff;font-family:${C.fO};font-size:14px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:14px;border:none;margin-top:8px;transition:.2s;&:hover{background:#b09558}:disabled{opacity:0.6;cursor:not-allowed}`

const LinkText = styled.p`font-size:13px;color:rgba(255,255,255,.5);margin-top:24px;a{color:${C.gold};text-decoration:none;font-weight:600;&:hover{text-decoration:underline}}`

export function CustomerRegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  // Ensure fonts exist for auth page
  useEffect(() => {
    const id = 'pc-f'; if (document.getElementById(id)) return;
    const l = document.createElement('link'); l.id = id; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500&display=swap';
    document.head.appendChild(l);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate register
    await new Promise(r => setTimeout(r, 800))
    // Automatically log them in after registration (or prompt them to login)
    localStorage.setItem('customer_token', 'user-token-123')
    localStorage.setItem('customer_name', form.name || 'Pelanggan')
    
    navigate('/booking')

    setIsLoading(false)
  }

  return (
    <>
      <GS />
      <Wrap>
        <Card>
          <Link to="/">
            <Logo src="/logopointcut.png" alt="Pointcut" />
          </Link>
          <Title>Join Pointcut</Title>
          <Sub>Buat akun untuk mulai mengatur reservasi Anda</Sub>
          
          <Form onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Budi Santoso" />
            </div>
            <div>
              <Label htmlFor="phone">Nomor WhatsApp</Label>
              <Input id="phone" type="text" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="0812..." />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
            </div>
            <BtnGold type="submit" disabled={isLoading}>{isLoading ? 'Memproses...' : 'BUAT AKUN'}</BtnGold>
          </Form>

          <LinkText>Sudah punya akun? <Link to="/user/login">Login di sini</Link></LinkText>
          <LinkText style={{marginTop:'8px'}}><Link to="/">← Kembali ke Beranda</Link></LinkText>
        </Card>
      </Wrap>
    </>
  )
}
