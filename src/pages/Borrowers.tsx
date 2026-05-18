import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
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
    <div className="min-h-screen bg-[#FFF5E6] flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFF5E6]/80 border-b border-[#FAD4C0]/30 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#111827]">Peminjam</h1>
        <Link to="/dashboard/borrowers/new"><Button size="sm" className="bg-[#111827] text-white hover:bg-[#111827]/90 rounded-full px-4">+ Tambah</Button></Link>
      </header>

      <div className="flex-1 pb-20 p-4 space-y-3 max-w-lg mx-auto w-full">
        {borrowers.length === 0 && <div className="text-center py-12"><p className="text-sm text-[#111827]/50">Tiada peminjam lagi.</p><Link to="/dashboard/borrowers/new"><Button size="sm" className="mt-3 rounded-full bg-[#111827] text-white">+ Tambah Peminjam</Button></Link></div>}
        {borrowers.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl p-4 border border-[#FAD4C0]/30 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#80A1C1]/20 flex items-center justify-center text-sm font-bold text-[#80A1C1]">{b.name[0]}</div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-[#111827]">{b.name}</p>
                <p className="text-xs text-[#111827]/50">{b.phone}</p>
              </div>
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
            <div className="w-8 h-8 rounded-full bg-[#111827] flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
            <span className="text-[10px] font-medium text-[#111827]">Peminjam</span>
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
