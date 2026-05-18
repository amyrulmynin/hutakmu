import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"

export default function MyDebts() {
  const debts = [
    { id: "1", admin: "Myrul", total: 650, monthly: 54.17, months: 12, paid: 3, nextDue: "1 Jun 2026" },
    { id: "2", admin: "Hafiz", total: 350, monthly: 58.33, months: 6, paid: 5, nextDue: "15 Jun 2026" },
  ]

  return (
    <div className="min-h-screen">
      <header className="border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Hutang Saya</h1>
        <Link to="/login"><Button variant="ghost" size="sm">Logout</Button></Link>
      </header>

      <div className="p-4 space-y-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Jumlah Baki</p>
            <p className="text-2xl font-bold">RM 837.53</p>
          </CardContent>
        </Card>

        {debts.map((debt) => (
          <Card key={debt.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Hutang dengan {debt.admin}</p>
                  <p className="text-xs text-muted-foreground">RM{debt.monthly}/bulan • Next: {debt.nextDue}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">RM {debt.total}</p>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{debt.paid}/{debt.months} paid</span>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(debt.paid / debt.months) * 100}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
