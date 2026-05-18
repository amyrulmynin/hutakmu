import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Hutakmu</h1>
        <div className="flex gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Log Masuk</Button></Link>
          <Link to="/register"><Button size="sm">Daftar</Button></Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Track Hutang Dengan Mudah</h2>
          <p className="text-muted-foreground">Catat hutang, set bayaran bulanan, dan track pembayaran kawan-kawan anda.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/register"><Button size="lg">Mula Sekarang</Button></Link>
            <Link to="/login"><Button variant="outline" size="lg">Log Masuk</Button></Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 max-w-2xl w-full">
          <div className="rounded-xl border p-4 text-left">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-semibold text-sm">Catat Hutang</h3>
            <p className="text-xs text-muted-foreground mt-1">Set amount, fee, dan tempoh. Auto-kira bayaran bulanan.</p>
          </div>
          <div className="rounded-xl border p-4 text-left">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-semibold text-sm">Track Bayaran</h3>
            <p className="text-xs text-muted-foreground mt-1">Peminjam upload bukti, anda approve.</p>
          </div>
          <div className="rounded-xl border p-4 text-left">
            <div className="text-2xl mb-2">📱</div>
            <h3 className="font-semibold text-sm">SMS Reminder</h3>
            <p className="text-xs text-muted-foreground mt-1">Auto-hantar SMS reminder sebelum due date.</p>
          </div>
        </div>
      </main>

      <footer className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        Hutakmu © 2026
      </footer>
    </div>
  )
}
