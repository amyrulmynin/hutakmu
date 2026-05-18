import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { api } from "../lib/api"

export default function NewDebt() {
  const [borrowers, setBorrowers] = useState<any[]>([])
  const [borrowerId, setBorrowerId] = useState("")
  const [amount, setAmount] = useState("")
  const [fee, setFee] = useState("")
  const [months, setMonths] = useState("12")
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => { api.getBorrowers().then(setBorrowers).catch(() => {}) }, [])

  const total = (parseFloat(amount) || 0) + (parseFloat(fee) || 0)
  const monthly = total / (parseInt(months) || 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true)
    try {
      await api.createDebt({ borrowerId, amount: parseFloat(amount), flatFee: parseFloat(fee) || 0, durationMonths: parseInt(months), startDate })
      navigate("/dashboard/debts")
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#FFF5E6] flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFF5E6]/80 border-b border-[#FAD4C0]/30 px-4 py-3 flex items-center gap-3">
        <Link to="/dashboard/debts"><Button variant="ghost" size="sm" className="text-[#111827]">←</Button></Link>
        <h1 className="text-lg font-bold text-[#111827]">Catat Hutang Baru</h1>
      </header>

      <div className="flex-1 p-4 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-2xl p-5 border border-[#FAD4C0]/30 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 text-center">{error}</div>}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#111827]">Peminjam</label>
              <select className="flex h-11 w-full rounded-xl border border-[#FAD4C0]/50 bg-transparent px-3 py-1 text-sm" value={borrowerId} onChange={(e) => setBorrowerId(e.target.value)} required>
                <option value="">Pilih peminjam...</option>
                {borrowers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#111827]">Jumlah Hutang (RM)</label>
              <Input type="number" placeholder="600" value={amount} onChange={(e) => setAmount(e.target.value)} required className="h-11 rounded-xl border-[#FAD4C0]/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#111827]">Flat Fee (RM)</label>
              <Input type="number" placeholder="50" value={fee} onChange={(e) => setFee(e.target.value)} className="h-11 rounded-xl border-[#FAD4C0]/50" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#111827]">Tempoh (Bulan)</label>
                <Input type="number" placeholder="12" value={months} onChange={(e) => setMonths(e.target.value)} required className="h-11 rounded-xl border-[#FAD4C0]/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#111827]">Tarikh Mula</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-11 rounded-xl border-[#FAD4C0]/50" />
              </div>
            </div>

            <div className="rounded-xl bg-[#FFF5E6] p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-[#111827]/50">Jumlah hutang</span><span className="text-[#111827]">RM {parseFloat(amount) || 0}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#111827]/50">Flat fee</span><span className="text-[#111827]">RM {parseFloat(fee) || 0}</span></div>
              <div className="border-t border-[#FAD4C0]/50 my-1" />
              <div className="flex justify-between text-sm font-semibold"><span className="text-[#111827]">Total</span><span className="text-[#111827]">RM {total.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm font-bold"><span className="text-[#80A1C1]">Bayaran bulanan</span><span className="text-[#80A1C1]">RM {monthly.toFixed(2)}</span></div>
            </div>

            <Button className="w-full h-11 bg-[#111827] text-white hover:bg-[#111827]/90 rounded-xl font-medium" type="submit" disabled={loading}>{loading ? "Saving..." : "Simpan Hutang"}</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
