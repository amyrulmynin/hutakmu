import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';

export default function PayDebt() {
  const { debtId } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`${API_URL}/api/pay/${debtId}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError("Hutang tidak dijumpai"); setLoading(false) })
  }, [debtId])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !data?.nextInstallment) return

    setUploading(true)
    setMsg("")
    setError("")

    const formData = new FormData()
    formData.append("proof", file)
    formData.append("installmentId", data.nextInstallment.id)

    try {
      const res = await fetch(`${API_URL}/api/pay/${debtId}/pay`, {
        method: "POST",
        body: formData
      })
      const result = await res.json()
      if (res.ok) {
        setMsg(result.message || "Bukti dihantar!")
      } else {
        setError(result.error || "Gagal upload")
      }
    } catch {
      setError("Network error")
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  if (error && !data) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">{error}</p></div>

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-4 py-3 text-center">
        <h1 className="text-lg font-bold">Hutakmu</h1>
        <p className="text-xs text-muted-foreground">Pembayaran Hutang</p>
      </header>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Debt Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Maklumat Hutang</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Peminjam</span>
              <span className="font-medium">{data.borrower.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pemberi Pinjam</span>
              <span className="font-medium">{data.admin.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Jumlah Total</span>
              <span className="font-medium">RM {data.debt.totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bayaran Bulanan</span>
              <span className="font-bold text-primary">RM {data.debt.monthlyPayment}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{data.debt.paidCount}/{data.debt.durationMonths} bulan</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(data.debt.paidCount / data.debt.durationMonths) * 100}%` }} />
            </div>
          </CardContent>
        </Card>

        {/* Next Payment */}
        {data.nextInstallment ? (
          <Card className="border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Bayaran Seterusnya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bulan ke-{data.nextInstallment.month}</span>
                <span className="font-bold text-lg">RM {data.nextInstallment.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Due Date</span>
                <span>{data.nextInstallment.dueDate}</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-500">
            <CardContent className="p-4 text-center">
              <p className="text-green-600 font-bold">Semua hutang dah selesai! 🎉</p>
            </CardContent>
          </Card>
        )}

        {/* Payment Info (QR + Bank) */}
        {data.paymentInfo && Object.keys(data.paymentInfo).length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Cara Bayar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.paymentInfo.qrCodeUrl && (
                <div className="text-center">
                  <img src={`${API_URL}${data.paymentInfo.qrCodeUrl}`} alt="QR Code" className="mx-auto w-48 h-48 object-contain border rounded-lg" />
                  <p className="text-xs text-muted-foreground mt-1">Scan QR untuk bayar</p>
                </div>
              )}
              {data.paymentInfo.bankName && (
                <div className="rounded-lg bg-muted p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bank</span>
                    <span className="font-medium">{data.paymentInfo.bankName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">No. Akaun</span>
                    <span className="font-medium">{data.paymentInfo.accountNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nama</span>
                    <span className="font-medium">{data.paymentInfo.accountName}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upload Proof */}
        {data.nextInstallment && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Upload Bukti Bayaran</CardTitle>
            </CardHeader>
            <CardContent>
              {msg && <p className="text-sm text-green-600 mb-3 text-center">{msg}</p>}
              {error && <p className="text-sm text-red-500 mb-3 text-center">{error}</p>}
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Upload screenshot/receipt pembayaran</p>
                <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="text-sm" />
              </div>
              {uploading && <p className="text-sm text-center mt-2 text-muted-foreground">Uploading...</p>}
            </CardContent>
          </Card>
        )}

        {/* Installment History */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Jadual Bayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.installments.map((inst: any) => (
                <div key={inst.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">Bulan {inst.month}</p>
                    <p className="text-xs text-muted-foreground">{inst.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">RM {inst.amount}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${inst.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {inst.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="border-t px-4 py-4 text-center text-xs text-muted-foreground mt-8">
        Powered by Hutakmu
      </footer>
    </div>
  )
}
