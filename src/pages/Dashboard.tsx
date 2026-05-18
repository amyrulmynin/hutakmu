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
                <span className="text-2xl block mb-2">➕</span>
                <p className="text-xs font-medium text-[#111827]">Catat Hutang</p>
              </div>
            </Link>
            <Link to="/dashboard/borrowers/new">
              <div className="bg-white rounded-2xl p-4 border border-[#FAD4C0]/30 shadow-sm text-center hover:border-[#80A1C1]/50 transition-colors">
                <span className="text-2xl block mb-2">👤</span>
                <p className="text-xs font-medium text-[#111827]">Tambah Peminjam</p>
              </div>
            </Link>
            <Link to="/dashboard/approvals">
              <div className="bg-white rounded-2xl p-4 border border-[#FAD4C0]/30 shadow-sm text-center hover:border-[#80A1C1]/50 transition-colors">
                <span className="text-2xl block mb-2">✅</span>
                <p className="text-xs font-medium text-[#111827]">Approvals</p>
              </div>
            </Link>
            <Link to="/dashboard/settings">
              <div className="bg-white rounded-2xl p-4 border border-[#FAD4C0]/30 shadow-sm text-center hover:border-[#80A1C1]/50 transition-colors">
                <span className="text-2xl block mb-2">⚙️</span>
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
            <span className="text-lg">🏠</span>
            <span className="text-[10px] font-medium text-[#111827]">Home</span>
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
