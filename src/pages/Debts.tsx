import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { api } from "../lib/api"

export default function Debts() {
  const [debts, setDebts] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/login"); return }
    api.getDebts().then(setDebts).catch(() => navigate("/login"))
  }, [navigate])

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Senarai Hutang</h1>
        <Link to="/dashboard/debts/new"><Button size="sm">+ Catat Baru</Button></Link>
      </header>

      <div className="p-4 space-y-3">
        {debts.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Tiada hutang lagi. Klik + Catat Baru untuk mula.</p>}
        {debts.map((debt) => (
          <Card key={debt.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{debt.borrowerName}</p>
                  <p className="text-xs text-muted-foreground">RM{debt.monthlyPayment}/bulan x {debt.durationMonths} bulan</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">RM {debt.totalAmount}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${debt.status === "active" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                    {debt.status === "active" ? `${debt.paidCount}/${debt.durationMonths} paid` : "Selesai"}
                  </span>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(debt.paidCount / debt.durationMonths) * 100}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-2">
        <div className="flex justify-around">
          <Link to="/dashboard" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">🏠</span><span className="text-[10px]">Home</span></Link>
          <Link to="/dashboard/debts" className="flex flex-col items-center gap-0.5 text-primary"><span className="text-lg">📋</span><span className="text-[10px]">Hutang</span></Link>
          <Link to="/dashboard/borrowers" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">👥</span><span className="text-[10px]">Peminjam</span></Link>
          <Link to="/dashboard/settings" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">⚙️</span><span className="text-[10px]">Settings</span></Link>
        </div>
      </nav>
    </div>
  )
}
