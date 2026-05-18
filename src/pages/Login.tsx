import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { api } from "../lib/api"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await api.login({ email, password })
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      if (data.user.role === "borrower") {
        navigate("/my-debts")
      } else {
        navigate("/dashboard")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF5E6] flex flex-col">
      <header className="px-4 py-4">
        <Link to="/" className="text-xl font-bold text-[#111827]">Hutakmu</Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#111827]">Selamat Kembali</h1>
            <p className="text-sm text-[#111827]/60 mt-2">Log masuk ke akaun anda</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#FAD4C0]/30 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#111827]">Email</label>
                <Input
                  type="email"
                  placeholder="email@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 rounded-xl border-[#FAD4C0]/50 focus:border-[#80A1C1] focus:ring-[#80A1C1]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#111827]">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 rounded-xl border-[#FAD4C0]/50 focus:border-[#80A1C1] focus:ring-[#80A1C1]/20"
                />
              </div>
              <Button
                className="w-full h-11 bg-[#111827] text-white hover:bg-[#111827]/90 rounded-xl text-sm font-medium"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Log Masuk"}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-[#111827]/60 mt-6">
            Belum ada akaun?{" "}
            <Link to="/register" className="text-[#80A1C1] font-medium hover:underline">Daftar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
