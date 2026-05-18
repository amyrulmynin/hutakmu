import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Hutakmu</h1>
        <Link to="/login"><Button variant="ghost" size="sm">Logout</Button></Link>
      </header>

      <div className="flex-1 pb-16 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs text-muted-foreground font-normal">Hutang Aktif</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-bold">RM 2,450</p>
              <p className="text-xs text-muted-foreground">5 peminjam</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs text-muted-foreground font-normal">Dah Collect</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-bold">RM 850</p>
              <p className="text-xs text-muted-foreground">Bulan ini</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">3</p>
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

        <div className="space-y-2">
          <h2 className="text-sm font-semibold">Aktiviti Terkini</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-xs">💰</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Ahmad bayar RM54.17</p>
                <p className="text-xs text-muted-foreground">2 jam lepas</p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Pending</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs">📝</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Hutang baru: Ali - RM600</p>
                <p className="text-xs text-muted-foreground">Semalam</p>
              </div>
            </div>
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
