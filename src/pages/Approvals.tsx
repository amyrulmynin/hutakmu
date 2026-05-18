import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { api } from "../lib/api"

export default function Approvals() {
  const [approvals, setApprovals] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/login"); return }
    loadApprovals()
  }, [navigate])

  const loadApprovals = () => {
    api.getPendingPayments().then(setApprovals).catch(() => navigate("/login"))
  }

  const handleApprove = async (id: string) => {
    await api.approvePayment(id)
    loadApprovals()
  }

  const handleReject = async (id: string) => {
    await api.rejectPayment(id)
    loadApprovals()
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b px-4 py-3">
        <h1 className="text-lg font-bold">Pending Approvals</h1>
        <p className="text-xs text-muted-foreground">{approvals.length} bukti bayaran menunggu review</p>
      </header>

      <div className="p-4 space-y-3">
        {approvals.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Tiada pending approvals.</p>}
        {approvals.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xs">📷</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{a.borrowerName}</p>
                  <p className="text-xs text-muted-foreground">RM{a.amount} • Due: {a.dueDate}</p>
                  <p className="text-xs text-muted-foreground">{new Date(a.submittedAt).toLocaleDateString('ms-MY')}</p>
                </div>
              </div>
              {a.proofUrl && (
                <img src={a.proofUrl} alt="Bukti" className="mt-2 rounded-lg border w-full max-h-40 object-cover" />
              )}
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleApprove(a.id)}>Approve</Button>
                <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleReject(a.id)}>Reject</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-2">
        <div className="flex justify-around">
          <Link to="/dashboard" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">🏠</span><span className="text-[10px]">Home</span></Link>
          <Link to="/dashboard/debts" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">📋</span><span className="text-[10px]">Hutang</span></Link>
          <Link to="/dashboard/borrowers" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">👥</span><span className="text-[10px]">Peminjam</span></Link>
          <Link to="/dashboard/settings" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">⚙️</span><span className="text-[10px]">Settings</span></Link>
        </div>
      </nav>
    </div>
  )
}
