import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export function CustomerRegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register({ email, password, password_confirmation: password, name, phone });
      navigate("/booking");
    } catch (err) {
      console.log(err);
      setError("Registrasi gagal. Email mungkin sudah terdaftar.");
    }
  };

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
        className="min-h-screen flex items-center justify-center px-5 py-10 relative"
        style={{ background: "url('/hero_bg.png') center/cover no-repeat" }}
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
            Join Pointcut
          </h1>

          {/* Subtitle */}
          <p
            className="mb-8"
            style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}
          >
            Buat akun untuk mulai mengatur reservasi Anda
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-xs text-left">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-left"
          >
            {/* Nama */}
            <div>
              <label
                htmlFor="name"
                className="block font-oswald text-xs uppercase mb-1"
                style={{ color: "#c8a96e", letterSpacing: "1px" }}
              >
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Budi Santoso"
                className="input-gold w-full px-4 py-3.5 text-white text-sm border transition-colors duration-200 font-dm"
                style={{
                  background: "rgba(0,0,0,0.2)",
                  borderColor: "rgba(255,255,255,0.1)",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block font-oswald text-xs uppercase mb-1"
                style={{ color: "#c8a96e", letterSpacing: "1px" }}
              >
                Nomor WhatsApp
              </label>
              <input
                id="phone"
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812..."
                className="input-gold w-full px-4 py-3.5 text-white text-sm border transition-colors duration-200 font-dm"
                style={{
                  background: "rgba(0,0,0,0.2)",
                  borderColor: "rgba(255,255,255,0.1)",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block font-oswald text-xs uppercase mb-1"
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
                placeholder="email@example.com"
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
                className="block font-oswald text-xs uppercase mb-1"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold w-full py-3.5 text-white font-oswald font-semibold uppercase border-none mt-2 transition-colors duration-200 cursor-pointer"
              style={{
                background: "#c8a96e",
                fontSize: "14px",
                letterSpacing: "2px",
              }}
            >
              {isLoading ? "Memproses..." : "BUAT AKUN"}
            </button>
          </form>

          {/* Links */}
          <p
            className="mt-6 font-dm"
            style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}
          >
            Sudah punya akun?{" "}
            <Link
              to="/user/login"
              className="font-semibold no-underline hover:underline"
              style={{ color: "#c8a96e" }}
            >
              Login di sini
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
