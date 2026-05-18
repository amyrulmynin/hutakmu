import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { api } from "../lib/api"

export default function Dashboard() {
  const [stats, setStats] = useState({ totalOwed: 0, totalCollected: 0, activeDebts: 0, totalBorrowers: 0, pendingApprovals: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/login"); return }
    api.stats().then(setStats).catch(() => navigate("/login"))
  }, [navigate])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Hutakmu</h1>
        <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
      </header>

      <div className="flex-1 pb-16 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs text-muted-foreground font-normal">Hutang Aktif</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-bold">RM {stats.totalOwed.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{stats.totalBorrowers} peminjam</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs text-muted-foreground font-normal">Dah Collect</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-bold">RM {stats.totalCollected.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{stats.activeDebts} hutang aktif</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
            <p className="text-xs text-muted-foreground">Bukti bayaran menunggu review</p>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/dashboard/debts/new"><Button variant="outline" className="w-full h-auto py-3 flex-col gap-1"><span className="text-lg">➕</span><span className="text-xs">Catat Hutang</span></Button></Link>
            <Link to="/dashboard/borrowers/new"><Button variant="outline" className="w-full h-auto py-3 flex-col gap-1"><span className="text-lg">👤</span><span className="text-xs">Tambah Peminjam</span></Button></Link>
            <Link to="/dashboard/approvals"><Button variant="outline" className="w-full h-auto py-3 flex-col gap-1"><span className="text-lg">✅</span><span className="text-xs">Approvals</span></Button></Link>
            <Link to="/dashboard/settings"><Button variant="outline" className="w-full h-auto py-3 flex-col gap-1"><span className="text-lg">⚙️</span><span className="text-xs">Settings</span></Button></Link>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-2">
        <div className="flex justify-around">
          <Link to="/dashboard" className="flex flex-col items-center gap-0.5 text-primary"><span className="text-lg">🏠</span><span className="text-[10px]">Home</span></Link>
          <Link to="/dashboard/debts" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">📋</span><span className="text-[10px]">Hutang</span></Link>
          <Link to="/dashboard/borrowers" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">👥</span><span className="text-[10px]">Peminjam</span></Link>
          <Link to="/dashboard/settings" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">⚙️</span><span className="text-[10px]">Settings</span></Link>
        </div>
      </nav>
    </div>
  )
}
