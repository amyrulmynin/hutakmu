import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { api } from "../lib/api"

export default function Approvals() {
  const [approvals, setApprovals] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/login"); return }
    loadApprovals()
  }, [navigate])

  const loadApprovals = () => { api.getPendingPayments().then(setApprovals).catch(() => navigate("/login")) }
  const handleApprove = async (id: string) => { await api.approvePayment(id); loadApprovals() }
  const handleReject = async (id: string) => { await api.rejectPayment(id); loadApprovals() }

  return (
    <div className="min-h-screen bg-[#FFF5E6] flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFF5E6]/80 border-b border-[#FAD4C0]/30 px-4 py-3">
        <h1 className="text-lg font-bold text-[#111827]">Pending Approvals</h1>
        <p className="text-xs text-[#111827]/50">{approvals.length} bukti menunggu review</p>
      </header>

      <div className="flex-1 pb-20 p-4 space-y-3 max-w-lg mx-auto w-full">
        {approvals.length === 0 && <div className="text-center py-12"><div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg></div><p className="text-sm text-[#111827]/50">Semua clear! Tiada pending.</p></div>}
        {approvals.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl p-4 border border-[#FAD4C0]/30 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#FAD4C0]/30 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-[#111827]">{a.borrowerName}</p>
                <p className="text-xs text-[#111827]/50">RM{a.amount} • Due: {a.dueDate}</p>
                <p className="text-xs text-[#111827]/40">{new Date(a.submittedAt).toLocaleDateString('ms-MY')}</p>
              </div>
            </div>
            {a.proofUrl && <img src={a.proofUrl} alt="Bukti" className="mt-3 rounded-xl border border-[#FAD4C0]/30 w-full max-h-40 object-cover" />}
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl" onClick={() => handleApprove(a.id)}>Approve</Button>
              <Button size="sm" className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl" onClick={() => handleReject(a.id)}>Reject</Button>
            </div>
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
            <div className="w-8 h-8 rounded-full flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" opacity="0.4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
            <span className="text-[10px] text-[#111827]/40">Hutang</span>
          </Link>
          <Link to="/dashboard/borrowers" className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" opacity="0.4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
            <span className="text-[10px] text-[#111827]/40">Peminjam</span>
          </Link>
          <Link to="/dashboard/settings" className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" opacity="0.4"><circle cx="12" cy="12" r="3"/></svg></div>
            <span className="text-[10px] text-[#111827]/40">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
