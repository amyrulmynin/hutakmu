import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function NewDebt() {
  const [amount, setAmount] = useState("")
  const [fee, setFee] = useState("")
  const [months, setMonths] = useState("12")

  const total = (parseFloat(amount) || 0) + (parseFloat(fee) || 0)
  const monthly = total / (parseInt(months) || 1)

  return (
    <div className="min-h-screen">
      <header className="border-b px-4 py-3 flex items-center gap-3">
        <Link to="/dashboard/debts"><Button variant="ghost" size="sm">←</Button></Link>
        <h1 className="text-lg font-bold">Catat Hutang Baru</h1>
      </header>

      <div className="p-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Maklumat Hutang</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Peminjam</label>
              <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                <option value="">Pilih peminjam...</option>
                <option value="ahmad">Ahmad</option>
                <option value="siti">Siti</option>
                <option value="ali">Ali</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Jumlah Hutang (RM)</label>
              <Input type="number" placeholder="600" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Flat Fee (RM)</label>
              <Input type="number" placeholder="50" value={fee} onChange={(e) => setFee(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tempoh (Bulan)</label>
              <Input type="number" placeholder="12" value={months} onChange={(e) => setMonths(e.target.value)} />
            </div>

            <div className="rounded-lg bg-muted p-3 space-y-1">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Jumlah hutang</span><span>RM {parseFloat(amount) || 0}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Flat fee</span><span>RM {parseFloat(fee) || 0}</span></div>
              <div className="border-t my-1" />
              <div className="flex justify-between text-sm font-semibold"><span>Total</span><span>RM {total.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm font-semibold text-primary"><span>Bayaran bulanan</span><span>RM {monthly.toFixed(2)}</span></div>
            </div>

            <Button className="w-full">Simpan Hutang</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
