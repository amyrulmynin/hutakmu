import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { api } from "../lib/api"

export default function NewBorrower() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await api.createBorrower({ name, phone, email })
      navigate("/dashboard/borrowers")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b px-4 py-3 flex items-center gap-3">
        <Link to="/dashboard/borrowers"><Button variant="ghost" size="sm">←</Button></Link>
        <h1 className="text-lg font-bold">Tambah Peminjam</h1>
      </header>

      <div className="p-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Maklumat Peminjam</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama</label>
                <Input placeholder="Nama penuh" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">No. Telefon</label>
                <Input placeholder="0123456789" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email (optional)</label>
                <Input type="email" placeholder="email@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button className="w-full" type="submit" disabled={loading}>{loading ? "Saving..." : "Simpan"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
