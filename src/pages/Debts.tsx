import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
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

  const loadDebts = () => { api.getDebts().then(setDebts).catch(() => navigate("/login")) }

  const shareLink = (debtId: string) => {
    const url = `${window.location.origin}/pay/${debtId}`
    navigator.clipboard.writeText(url).then(() => { setCopied(debtId); setTimeout(() => setCopied(""), 2000) })
  }

  const startEdit = (debt: any) => {
    setEditingId(debt.id)
    setEditData({ amount: String(debt.amount), flatFee: String(debt.flatFee), durationMonths: String(debt.durationMonths), startDate: debt.startDate })
  }

  const saveEdit = async (debtId: string) => {
    setSaving(true)
    try {
      await api.editDebt(debtId, { amount: parseFloat(editData.amount), flatFee: parseFloat(editData.flatFee), durationMonths: parseInt(editData.durationMonths), startDate: editData.startDate })
      setEditingId(null)
      loadDebts()
    } catch { alert("Gagal save") }
    finally { setSaving(false) }
  }

  const deleteDebt = async (debtId: string) => {
    if (!confirm("Confirm padam hutang ini?")) return
    try { await api.deleteDebt(debtId); loadDebts() } catch { alert("Gagal padam") }
  }

  return (
    <div className="min-h-screen bg-[#FFF5E6] flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFF5E6]/80 border-b border-[#FAD4C0]/30 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#111827]">Senarai Hutang</h1>
        <Link to="/dashboard/debts/new"><Button size="sm" className="bg-[#111827] text-white hover:bg-[#111827]/90 rounded-full px-4">+ Catat Baru</Button></Link>
      </header>

      <div className="flex-1 pb-20 p-4 space-y-3 max-w-lg mx-auto w-full">
        {debts.length === 0 && <div className="text-center py-12"><p className="text-sm text-[#111827]/50">Tiada hutang lagi.</p><Link to="/dashboard/debts/new"><Button size="sm" className="mt-3 rounded-full bg-[#111827] text-white">+ Catat Hutang Pertama</Button></Link></div>}
        {debts.map((debt) => (
          <div key={debt.id} className="bg-white rounded-2xl p-4 border border-[#FAD4C0]/30 shadow-sm">
            {editingId === debt.id ? (
              <div className="space-y-3">
                <p className="font-semibold text-sm text-[#111827]">{debt.borrowerName}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs text-[#111827]/50">Hutang (RM)</label><Input type="number" value={editData.amount} onChange={(e) => setEditData({...editData, amount: e.target.value})} className="h-9 rounded-xl border-[#FAD4C0]/50" /></div>
                  <div><label className="text-xs text-[#111827]/50">Fee (RM)</label><Input type="number" value={editData.flatFee} onChange={(e) => setEditData({...editData, flatFee: e.target.value})} className="h-9 rounded-xl border-[#FAD4C0]/50" /></div>
                  <div><label className="text-xs text-[#111827]/50">Tempoh (Bulan)</label><Input type="number" value={editData.durationMonths} onChange={(e) => setEditData({...editData, durationMonths: e.target.value})} className="h-9 rounded-xl border-[#FAD4C0]/50" /></div>
                  <div><label className="text-xs text-[#111827]/50">Tarikh Mula</label><Input type="date" value={editData.startDate} onChange={(e) => setEditData({...editData, startDate: e.target.value})} className="h-9 rounded-xl border-[#FAD4C0]/50" /></div>
                </div>
                <div className="bg-[#FFF5E6] rounded-xl p-2 text-xs">
                  <span className="text-[#111827]/50">Total: </span><span className="font-bold text-[#111827]">RM {((parseFloat(editData.amount)||0)+(parseFloat(editData.flatFee)||0)).toFixed(2)}</span>
                  <span className="text-[#111827]/50 ml-2">Bulanan: </span><span className="font-bold text-[#80A1C1]">RM {(((parseFloat(editData.amount)||0)+(parseFloat(editData.flatFee)||0))/(parseInt(editData.durationMonths)||1)).toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-[#111827] text-white rounded-xl" onClick={() => saveEdit(debt.id)} disabled={saving}>{saving ? "..." : "Save"}</Button>
                  <Button size="sm" variant="outline" className="flex-1 rounded-xl border-[#FAD4C0]" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-[#111827]">{debt.borrowerName}</p>
                    <p className="text-xs text-[#111827]/50">RM{debt.monthlyPayment}/bln x {debt.durationMonths} bln • Mula: {debt.startDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-[#111827]">RM {debt.totalAmount}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${debt.status === "active" ? "bg-[#80A1C1]/20 text-[#80A1C1]" : "bg-green-100 text-green-700"}`}>
                      {debt.status === "active" ? `${debt.paidCount}/${debt.durationMonths}` : "Selesai"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-[#FFF5E6] rounded-full overflow-hidden">
                  <div className="h-full bg-[#80A1C1] rounded-full transition-all" style={{ width: `${(debt.paidCount / debt.durationMonths) * 100}%` }} />
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1 bg-[#111827] text-white rounded-xl text-xs" onClick={() => shareLink(debt.id)}>
                    {copied === debt.id ? "Copied!" : "Share Link"}
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-xl border-[#FAD4C0] text-xs" onClick={() => startEdit(debt)}>Edit</Button>
                  <Button size="sm" variant="outline" className="rounded-xl border-red-200 text-red-500 text-xs" onClick={() => deleteDebt(debt.id)}>Padam</Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#FAD4C0]/30 px-4 py-2 shadow-lg shadow-black/5">
        <div className="flex justify-around max-w-lg mx-auto">
          <Link to="/dashboard" className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" opacity="0.4"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>
            <span className="text-[10px] text-[#111827]/40">Home</span>
          </Link>
          <Link to="/dashboard/debts" className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-8 rounded-full bg-[#111827] flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
            <span className="text-[10px] font-medium text-[#111827]">Hutang</span>
          </Link>
          <Link to="/dashboard/borrowers" className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" opacity="0.4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
            <span className="text-[10px] text-[#111827]/40">Peminjam</span>
          </Link>
          <Link to="/dashboard/settings" className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" opacity="0.4"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
            <span className="text-[10px] text-[#111827]/40">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
