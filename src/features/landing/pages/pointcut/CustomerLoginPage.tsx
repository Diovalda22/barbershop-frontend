import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export function CustomerLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      navigate("/booking");
    } catch {
      setError("Email atau password salah");
    }
  };

  useEffect(() => {
    const id = "pc-f";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500&display=swap";
    document.head.appendChild(l);
  }, []);

  return (
    <>
      <style>{`
        body { margin: 0; padding: 0; box-sizing: border-box; overflow-x: hidden; }
        *, *::before, *::after { box-sizing: border-box; }
        .font-serif-display { font-family: 'Playfair Display', serif; }
        .font-oswald { font-family: 'Oswald', sans-serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
        .input-gold:focus { border-color: #c8a96e !important; outline: none; }
        .btn-gold:hover { background: #b09558 !important; }
        .btn-gold:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      {/* Wrap */}
      <div
        className="min-h-screen flex items-center justify-center p-5 relative"
        style={{
          background: "url('/hero_bg.png') center/cover no-repeat",
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{ background: "rgba(26,26,24,0.85)" }}
        />

        {/* Card */}
        <div
          className="w-full max-w-sm relative z-10 text-center p-10 border font-dm"
          style={{
            background: "#2a2520",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          {/* Logo */}
          <Link to="/">
            <img
              src="/logopointcut.png"
              alt="Pointcut"
              className="h-10 mx-auto mb-5"
            />
          </Link>

          {/* Title */}
          <h1
            className="font-serif-display text-white mb-2"
            style={{ fontSize: "28px" }}
          >
            Welcome Back
          </h1>

          {/* Subtitle */}
          <p
            className="text-sm mb-8"
            style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}
          >
            Silakan login untuk mengatur reservasi Anda
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-left"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block font-oswald text-xs tracking-widest uppercase mb-1"
                style={{ color: "#c8a96e", letterSpacing: "1px" }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                className="input-gold w-full px-4 py-3.5 text-white text-sm border transition-colors duration-200 font-dm"
                style={{
                  background: "rgba(0,0,0,0.2)",
                  borderColor: "rgba(255,255,255,0.1)",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block font-oswald text-xs tracking-widest uppercase mb-1"
                style={{ color: "#c8a96e", letterSpacing: "1px" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-gold w-full px-4 py-3.5 text-white text-sm border transition-colors duration-200 font-dm"
                style={{
                  background: "rgba(0,0,0,0.2)",
                  borderColor: "rgba(255,255,255,0.1)",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold w-full py-3.5 text-white font-oswald font-semibold uppercase tracking-widest border-none mt-2 transition-colors duration-200 cursor-pointer"
              style={{
                background: "#c8a96e",
                fontSize: "14px",
                letterSpacing: "2px",
              }}
            >
              {isLoading ? "Memproses..." : "LOGIN"}
            </button>
          </form>

          {/* Links */}
          <p
            className="mt-6 font-dm"
            style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}
          >
            Belum punya akun?{" "}
            <Link
              to="/user/register"
              className="font-semibold no-underline hover:underline"
              style={{ color: "#c8a96e" }}
            >
              Daftar sekarang
            </Link>
          </p>
          <p
            className="mt-2 font-dm"
            style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}
          >
            <Link
              to="/"
              className="font-semibold no-underline hover:underline"
              style={{ color: "#c8a96e" }}
            >
              ← Kembali ke Beranda
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
