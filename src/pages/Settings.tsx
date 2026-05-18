import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function Settings() {
  const [bankName, setBankName] = useState("Maybank")
  const [accountNumber, setAccountNumber] = useState("1234567890")
  const [accountName, setAccountName] = useState("")
  const [smsMethod, setSmsMethod] = useState("POST")
  const [smsUrl, setSmsUrl] = useState("")
  const [reminderDays, setReminderDays] = useState("3")

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b px-4 py-3">
        <h1 className="text-lg font-bold">Settings</h1>
      </header>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Maklumat Pembayaran</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Bank</label>
              <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">No. Akaun</label>
              <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Pemilik Akaun</label>
              <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">QR Code</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground">Upload QR Code</p>
                <Button variant="outline" size="sm" className="mt-2">Pilih Fail</Button>
              </div>
            </div>
            <Button className="w-full">Simpan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">SMS Notification</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">SMS Send Method</label>
              <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                <option value="custom-api">Custom API</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">API URL</label>
              <div className="flex gap-2">
                <select className="h-9 rounded-md border border-input bg-transparent px-2 text-sm w-20" value={smsMethod} onChange={(e) => setSmsMethod(e.target.value)}>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                </select>
                <Input placeholder="https://api.sms-provider.com/send" value={smsUrl} onChange={(e) => setSmsUrl(e.target.value)} className="flex-1" />
              </div>
            </div>

            <div className="rounded-lg bg-primary/5 p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-primary">Short Code</span>
                <span className="text-xs font-semibold text-primary">Description</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <code className="text-xs bg-muted px-1 rounded">{"{{message}}"}</code>
                  <span className="text-xs text-muted-foreground">Message</span>
                </div>
                <div className="flex justify-between text-sm">
                  <code className="text-xs bg-muted px-1 rounded">{"{{number}}"}</code>
                  <span className="text-xs text-muted-foreground">Number</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Headers</label>
                <Button variant="outline" size="sm">+ Add</Button>
              </div>
              <div className="rounded-lg border p-3 text-xs text-muted-foreground text-center">Tiada header.</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Body</label>
                <Button variant="outline" size="sm">+ Add</Button>
              </div>
              <div className="rounded-lg border p-3 text-xs text-muted-foreground text-center">Tiada body params.</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reminder (hari sebelum due)</label>
              <Input type="number" value={reminderDays} onChange={(e) => setReminderDays(e.target.value)} />
            </div>

            <Button className="w-full">Simpan SMS Config</Button>
          </CardContent>
        </Card>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-2">
        <div className="flex justify-around">
          <Link to="/dashboard" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">🏠</span><span className="text-[10px]">Home</span></Link>
          <Link to="/dashboard/debts" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">📋</span><span className="text-[10px]">Hutang</span></Link>
          <Link to="/dashboard/borrowers" className="flex flex-col items-center gap-0.5 text-muted-foreground"><span className="text-lg">👥</span><span className="text-[10px]">Peminjam</span></Link>
          <Link to="/dashboard/settings" className="flex flex-col items-center gap-0.5 text-primary"><span className="text-lg">⚙️</span><span className="text-[10px]">Settings</span></Link>
        </div>
      </nav>
    </div>
  )
}
