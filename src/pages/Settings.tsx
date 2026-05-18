import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { api } from "../lib/api"

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';

export default function Settings() {
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [smsMethod, setSmsMethod] = useState("POST")
  const [smsUrl, setSmsUrl] = useState("")
  const [reminderDays, setReminderDays] = useState("3")
  const [headers, setHeaders] = useState<{key:string,value:string}[]>([])
  const [body, setBody] = useState<{key:string,value:string}[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/login"); return }
    api.getSettings().then((data: any) => {
      if (data.paymentInfo) {
        setBankName(data.paymentInfo.bankName || "")
        setAccountNumber(data.paymentInfo.accountNumber || "")
        setAccountName(data.paymentInfo.accountName || "")
        setQrCodeUrl(data.paymentInfo.qrCodeUrl || "")
      }
      if (data.smsConfig) {
        setSmsMethod(data.smsConfig.method || "POST")
        setSmsUrl(data.smsConfig.apiUrl || "")
        setReminderDays(String(data.smsConfig.reminderDaysBefore || 3))
        if (data.smsConfig.headers) {
          setHeaders(Object.entries(data.smsConfig.headers).map(([key, value]) => ({ key, value: value as string })))
        }
        if (data.smsConfig.body) {
          setBody(Object.entries(data.smsConfig.body).map(([key, value]) => ({ key, value: value as string })))
        }
      }
    }).catch(() => navigate("/login"))
  }, [navigate])

  const handleSavePayment = async () => {
    setSaving(true)
    setMsg("")
    try {
      await api.saveSettings({
        paymentInfo: { bankName, accountNumber, accountName, qrCodeUrl },
      })
      setMsg("Saved!")
    } catch (err: any) {
      setMsg(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSms = async () => {
    setSaving(true)
    setMsg("")
    try {
      const headersObj: Record<string, string> = {}
      headers.forEach(h => { if (h.key) headersObj[h.key] = h.value })
      const bodyObj: Record<string, string> = {}
      body.forEach(b => { if (b.key) bodyObj[b.key] = b.value })

      await api.saveSettings({
        smsConfig: {
          enabled: true,
          method: smsMethod,
          apiUrl: smsUrl,
          headers: headersObj,
          body: bodyObj,
          reminderDaysBefore: parseInt(reminderDays)
        }
      })
      setMsg("SMS Config saved!")
    } catch (err: any) {
      setMsg(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUploadQr = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("qrcode", file)

    const token = localStorage.getItem("token")
    const res = await fetch(`${API_URL}/api/settings/upload-qr`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
    const data = await res.json()
    if (data.qrCodeUrl) {
      setQrCodeUrl(data.qrCodeUrl)
      setMsg("QR Code uploaded!")
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b px-4 py-3">
        <h1 className="text-lg font-bold">Settings</h1>
      </header>

      {msg && <div className="mx-4 mt-3 p-2 rounded bg-green-100 text-green-800 text-sm text-center">{msg}</div>}

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
              {qrCodeUrl && <img src={`${API_URL}${qrCodeUrl}`} alt="QR" className="w-32 h-32 object-contain border rounded-lg" />}
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Upload QR Code</p>
                <input type="file" accept="image/*" onChange={handleUploadQr} className="mt-2 text-sm" />
              </div>
            </div>
            <Button className="w-full" onClick={handleSavePayment} disabled={saving}>{saving ? "Saving..." : "Simpan"}</Button>
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
                <Button variant="outline" size="sm" onClick={() => setHeaders([...headers, {key:"",value:""}])}>+ Add</Button>
              </div>
              {headers.length === 0 && <div className="rounded-lg border p-3 text-xs text-muted-foreground text-center">Tiada header.</div>}
              {headers.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder="Key" value={h.key} onChange={(e) => { const n = [...headers]; n[i].key = e.target.value; setHeaders(n) }} className="flex-1" />
                  <Input placeholder="Value" value={h.value} onChange={(e) => { const n = [...headers]; n[i].value = e.target.value; setHeaders(n) }} className="flex-1" />
                  <Button variant="ghost" size="sm" onClick={() => setHeaders(headers.filter((_,idx) => idx !== i))}>×</Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Body</label>
                <Button variant="outline" size="sm" onClick={() => setBody([...body, {key:"",value:""}])}>+ Add</Button>
              </div>
              {body.length === 0 && <div className="rounded-lg border p-3 text-xs text-muted-foreground text-center">Tiada body params.</div>}
              {body.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder="Key" value={b.key} onChange={(e) => { const n = [...body]; n[i].key = e.target.value; setBody(n) }} className="flex-1" />
                  <Input placeholder="Value" value={b.value} onChange={(e) => { const n = [...body]; n[i].value = e.target.value; setBody(n) }} className="flex-1" />
                  <Button variant="ghost" size="sm" onClick={() => setBody(body.filter((_,idx) => idx !== i))}>×</Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reminder (hari sebelum due)</label>
              <Input type="number" value={reminderDays} onChange={(e) => setReminderDays(e.target.value)} />
            </div>

            <Button className="w-full" onClick={handleSaveSms} disabled={saving}>{saving ? "Saving..." : "Simpan SMS Config"}</Button>
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
