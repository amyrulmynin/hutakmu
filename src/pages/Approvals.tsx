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
        {approvals.length === 0 && <div className="text-center py-12"><div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3"><span className="text-2xl">✅</span></div><p className="text-sm text-[#111827]/50">Semua clear! Tiada pending.</p></div>}
        {approvals.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl p-4 border border-[#FAD4C0]/30 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#FAD4C0]/30 flex items-center justify-center shrink-0">
                <span className="text-xl">🖼️</span>
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
            <span className="text-lg">🏠</span>
            <span className="text-[10px] text-[#111827]/40">Home</span>
          </Link>
          <Link to="/dashboard/debts" className="flex flex-col items-center gap-0.5">
            <span className="text-lg">📋</span>
            <span className="text-[10px] text-[#111827]/40">Hutang</span>
          </Link>
          <Link to="/dashboard/borrowers" className="flex flex-col items-center gap-0.5">
            <span className="text-lg">👥</span>
            <span className="text-[10px] text-[#111827]/40">Peminjam</span>
          </Link>
          <Link to="/dashboard/settings" className="flex flex-col items-center gap-0.5">
            <span className="text-lg">⚙️</span>
            <span className="text-[10px] text-[#111827]/40">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
