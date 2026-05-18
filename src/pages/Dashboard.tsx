import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { api } from "../lib/api"

export default function Dashboard() {
  const [stats, setStats] = useState({ totalOwed: 0, totalCollected: 0, activeDebts: 0, totalBorrowers: 0, pendingApprovals: 0 })
  const [userName, setUserName] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/login"); return }
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    setUserName(user.name || "")
    api.stats().then(setStats).catch(() => navigate("/login"))
  }, [navigate])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-[#FFF5E6] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFF5E6]/80 border-b border-[#FAD4C0]/30 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#111827]">Hutakmu</h1>
          <p className="text-xs text-[#111827]/50">Hi, {userName}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="text-[#111827]/60">Logout</Button>
      </header>

      <div className="flex-1 pb-20 p-4 space-y-4 max-w-lg mx-auto w-full">
        {/* Stats Bento Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-[#FAD4C0]/30 shadow-sm">
            <p className="text-xs text-[#111827]/50 font-medium">Hutang Aktif</p>
            <p className="text-2xl font-bold text-[#111827] mt-1">RM {stats.totalOwed.toFixed(0)}</p>
            <p className="text-xs text-[#111827]/40 mt-1">{stats.totalBorrowers} peminjam</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#FAD4C0]/30 shadow-sm">
            <p className="text-xs text-[#111827]/50 font-medium">Dah Collect</p>
            <p className="text-2xl font-bold text-green-600 mt-1">RM {stats.totalCollected.toFixed(0)}</p>
            <p className="text-xs text-[#111827]/40 mt-1">{stats.activeDebts} hutang aktif</p>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-[#111827] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 font-medium">Pending Approval</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.pendingApprovals}</p>
            <p className="text-xs text-white/40">Bukti menunggu review</p>
          </div>
          <Link to="/dashboard/approvals">
            <Button size="sm" className="bg-white text-[#111827] hover:bg-white/90 rounded-full px-4">Review</Button>
          </Link>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-[#111827] mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/dashboard/debts/new">
              <div className="bg-white rounded-2xl p-4 border border-[#FAD4C0]/30 shadow-sm text-center hover:border-[#80A1C1]/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#FAD4C0]/30 flex items-center justify-center mx-auto mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
                <p className="text-xs font-medium text-[#111827]">Catat Hutang</p>
              </div>
            </Link>
            <Link to="/dashboard/borrowers/new">
              <div className="bg-white rounded-2xl p-4 border border-[#FAD4C0]/30 shadow-sm text-center hover:border-[#80A1C1]/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#80A1C1]/20 flex items-center justify-center mx-auto mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#80A1C1" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                </div>
                <p className="text-xs font-medium text-[#111827]">Tambah Peminjam</p>
              </div>
            </Link>
            <Link to="/dashboard/approvals">
              <div className="bg-white rounded-2xl p-4 border border-[#FAD4C0]/30 shadow-sm text-center hover:border-[#80A1C1]/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="text-xs font-medium text-[#111827]">Approvals</p>
              </div>
            </Link>
            <Link to="/dashboard/settings">
              <div className="bg-white rounded-2xl p-4 border border-[#FAD4C0]/30 shadow-sm text-center hover:border-[#80A1C1]/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#111827]/5 flex items-center justify-center mx-auto mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </div>
                <p className="text-xs font-medium text-[#111827]">Settings</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#FAD4C0]/30 px-4 py-2 shadow-lg shadow-black/5">
        <div className="flex justify-around max-w-lg mx-auto">
          <Link to="/dashboard" className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-8 rounded-full bg-[#111827] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            </div>
            <span className="text-[10px] font-medium text-[#111827]">Home</span>
          </Link>
          <Link to="/dashboard/debts" className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" opacity="0.4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <span className="text-[10px] text-[#111827]/40">Hutang</span>
          </Link>
          <Link to="/dashboard/borrowers" className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" opacity="0.4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span className="text-[10px] text-[#111827]/40">Peminjam</span>
          </Link>
          <Link to="/dashboard/settings" className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" opacity="0.4"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </div>
            <span className="text-[10px] text-[#111827]/40">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
