import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function NewBorrower() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  return (
    <div className="min-h-screen">
      <header className="border-b px-4 py-3 flex items-center gap-3">
        <Link to="/dashboard/borrowers"><Button variant="ghost" size="sm">←</Button></Link>
        <h1 className="text-lg font-bold">Tambah Peminjam</h1>
      </header>

      <div className="p-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Maklumat Peminjam</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama</label>
              <Input placeholder="Nama penuh" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">No. Telefon</label>
              <Input placeholder="0123456789" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email (optional)</label>
              <Input type="email" placeholder="email@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button className="w-full">Simpan</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
