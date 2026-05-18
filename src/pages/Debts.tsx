import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { api } from "../lib/api"

export default function Debts() {
  const [debts, setDebts] = useState<any[]>([])
  const [copied, setCopied] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ amount: "", flatFee: "", durationMonths: "", startDate: "" })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/login"); return }
    loadDebts()
  }, [navigate])

  const loadDebts = () => {
    api.getDebts().then(setDebts).catch(() => navigate("/login"))
  }

  const shareLink = (debtId: string) => {
    const url = `${window.location.origin}/pay/${debtId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(debtId)
      setTimeout(() => setCopied(""), 2000)
    })
  }

  const startEdit = (debt: any) => {
    setEditingId(debt.id)
    setEditData({
      amount: String(debt.amount),
      flatFee: String(debt.flatFee),
      durationMonths: String(debt.durationMonths),
      startDate: debt.startDate
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (debtId: string) => {
    setSaving(true)
    try {
      await api.editDebt(debtId, {
        amount: parseFloat(editData.amount),
        flatFee: parseFloat(editData.flatFee),
        durationMonths: parseInt(editData.durationMonths),
        startDate: editData.startDate
      })
      setEditingId(null)
      loadDebts()
    } catch (err) {
      alert("Gagal save")
    } finally {
      setSaving(false)
    }
  }

  const deleteDebt = async (debtId: string) => {
    if (!confirm("Confirm padam hutang ini?")) return
    try {
      await api.deleteDebt(debtId)
      loadDebts()
    } catch (err) {
      alert("Gagal padam")
    }
  }

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
              {editingId === debt.id ? (
                /* Edit Mode */
                <div className="space-y-3">
                  <p className="font-semibold text-sm">{debt.borrowerName}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Hutang (RM)</label>
                      <Input type="number" value={editData.amount} onChange={(e) => setEditData({...editData, amount: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Fee (RM)</label>
                      <Input type="number" value={editData.flatFee} onChange={(e) => setEditData({...editData, flatFee: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Tempoh (Bulan)</label>
                      <Input type="number" value={editData.durationMonths} onChange={(e) => setEditData({...editData, durationMonths: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Tarikh Mula</label>
                      <Input type="date" value={editData.startDate} onChange={(e) => setEditData({...editData, startDate: e.target.value})} />
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-xs">
                    <span className="text-muted-foreground">Total: </span>
                    <span className="font-bold">RM {((parseFloat(editData.amount)||0) + (parseFloat(editData.flatFee)||0)).toFixed(2)}</span>
                    <span className="text-muted-foreground"> • Bulanan: </span>
                    <span className="font-bold">RM {(((parseFloat(editData.amount)||0) + (parseFloat(editData.flatFee)||0)) / (parseInt(editData.durationMonths)||1)).toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => saveEdit(debt.id)} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={cancelEdit}>Cancel</Button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{debt.borrowerName}</p>
                      <p className="text-xs text-muted-foreground">RM{debt.monthlyPayment}/bulan x {debt.durationMonths} bulan</p>
                      <p className="text-xs text-muted-foreground">Mula: {debt.startDate}</p>
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
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => shareLink(debt.id)}>
                      {copied === debt.id ? "✅ Copied!" : "📤 Share"}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => startEdit(debt)}>✏️ Edit</Button>
                    <Button variant="outline" size="sm" className="text-red-500" onClick={() => deleteDebt(debt.id)}>🗑️</Button>
                  </div>
                </>
              )}
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
