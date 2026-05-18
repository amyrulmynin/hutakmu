import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"

export default function Approvals() {
  const approvals = [
    { id: "1", borrower: "Ahmad", amount: 54.17, date: "14 Mei 2026", debt: "Hutang RM650" },
    { id: "2", borrower: "Ali", amount: 91.67, date: "13 Mei 2026", debt: "Hutang RM1100" },
    { id: "3", borrower: "Ahmad", amount: 54.17, date: "12 Mei 2026", debt: "Hutang RM650" },
  ]

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b px-4 py-3">
        <h1 className="text-lg font-bold">Pending Approvals</h1>
        <p className="text-xs text-muted-foreground">{approvals.length} bukti bayaran menunggu review</p>
      </header>

      <div className="p-4 space-y-3">
        {approvals.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xs">📷</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{a.borrower}</p>
                  <p className="text-xs text-muted-foreground">{a.debt} • RM{a.amount}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">Approve</Button>
                <Button size="sm" variant="destructive" className="flex-1">Reject</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-2">
        <div className="flex justify-around">
          <Link to="/dashboard" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">🏠</span><span className="text-[10px]">Home</span></Link>
          <Link to="/dashboard/debts" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">📋</span><span className="text-[10px]">Hutang</span></Link>
          <Link to="/dashboard/borrowers" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">👥</span><span className="text-[10px]">Peminjam</span></Link>
          <Link to="/dashboard/settings" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">⚙️</span><span className="text-[10px]">Settings</span></Link>
        </div>
      </nav>
    </div>
  )
}
