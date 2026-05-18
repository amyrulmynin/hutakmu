import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { api } from "../lib/api"

export default function NewBorrower() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true)
    try { await api.createBorrower({ name, phone, email }); navigate("/dashboard/borrowers") }
    catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#FFF5E6] flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFF5E6]/80 border-b border-[#FAD4C0]/30 px-4 py-3 flex items-center gap-3">
        <Link to="/dashboard/borrowers"><Button variant="ghost" size="sm" className="text-[#111827]">←</Button></Link>
        <h1 className="text-lg font-bold text-[#111827]">Tambah Peminjam</h1>
      </header>

      <div className="flex-1 p-4 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-2xl p-5 border border-[#FAD4C0]/30 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 text-center">{error}</div>}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#111827]">Nama</label>
              <Input placeholder="Nama penuh" value={name} onChange={(e) => setName(e.target.value)} required className="h-11 rounded-xl border-[#FAD4C0]/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#111827]">No. Telefon</label>
              <Input placeholder="0123456789" value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-11 rounded-xl border-[#FAD4C0]/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#111827]">Email (optional)</label>
              <Input type="email" placeholder="email@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl border-[#FAD4C0]/50" />
            </div>
            <Button className="w-full h-11 bg-[#111827] text-white hover:bg-[#111827]/90 rounded-xl font-medium" type="submit" disabled={loading}>{loading ? "Saving..." : "Simpan"}</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
