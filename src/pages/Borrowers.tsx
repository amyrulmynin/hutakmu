import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { api } from "../lib/api"

export default function Borrowers() {
  const [borrowers, setBorrowers] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/login"); return }
    api.getBorrowers().then(setBorrowers).catch(() => navigate("/login"))
  }, [navigate])

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Peminjam</h1>
        <Link to="/dashboard/borrowers/new"><Button size="sm">+ Tambah</Button></Link>
      </header>

      <div className="p-4 space-y-3">
        {borrowers.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Tiada peminjam lagi. Klik + Tambah untuk mula.</p>}
        {borrowers.map((b) => (
          <Card key={b.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">{b.name[0]}</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-2">
        <div className="flex justify-around">
          <Link to="/dashboard" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">🏠</span><span className="text-[10px]">Home</span></Link>
          <Link to="/dashboard/debts" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">📋</span><span className="text-[10px]">Hutang</span></Link>
          <Link to="/dashboard/borrowers" className="flex flex-col items-center gap-0.5 text-primary"><span className="text-lg">👥</span><span className="text-[10px]">Peminjam</span></Link>
          <Link to="/dashboard/settings" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">⚙️</span><span className="text-[10px]">Settings</span></Link>
        </div>
      </nav>
    </div>
  )
}
